const Alert = require('../models/Alert')
const { ErrorResponse, asyncHandler } = require('../middleware/error')
const emailService = require('../config/email')

// @desc    Get all alerts
// @route   GET /api/alerts
// @access  Private
exports.getAllAlerts = asyncHandler(async (req, res) => {
  const alerts = await Alert.find({
    $or: [
      { recipients: 'all' },
      { recipientIds: req.user.id },
      { buildingId: req.user.currentProperty },
      { role: req.user.role }
    ]
  })
  .sort('-createdAt')
  .limit(100)
  
  res.json({
    success: true,
    count: alerts.length,
    data: alerts
  })
})

// @desc    Get single alert
// @route   GET /api/alerts/:id
// @access  Private
exports.getAlertById = asyncHandler(async (req, res) => {
  const alert = await Alert.findById(req.params.id)
  
  if (!alert) {
    throw new ErrorResponse(`Alert not found with id of ${req.params.id}`, 404)
  }
  
  // Check if user has access to this alert
  const hasAccess = 
    alert.recipients === 'all' ||
    alert.recipientIds?.includes(req.user.id) ||
    alert.buildingId?.toString() === req.user.currentProperty?.toString() ||
    alert.role === req.user.role
  
  if (!hasAccess && req.user.role !== 'admin' && req.user.role !== 'manager') {
    throw new ErrorResponse('Not authorized to access this alert', 403)
  }
  
  res.json({
    success: true,
    data: alert
  })
})

// @desc    Create alert
// @route   POST /api/alerts
// @access  Private/Admin/Manager/Landlord
exports.createAlert = asyncHandler(async (req, res) => {
  const alert = await Alert.create(req.body)
  
  // If alert is scheduled to send immediately, send it
  if (!alert.schedule?.sendAt || alert.schedule.sendAt <= new Date()) {
    await this.sendAlertToRecipients(alert)
    alert.status = 'sent'
    await alert.save()
  }
  
  res.status(201).json({
    success: true,
    data: alert
  })
})

// @desc    Update alert
// @route   PUT /api/alerts/:id
// @access  Private/Admin/Manager/Landlord
exports.updateAlert = asyncHandler(async (req, res) => {
  let alert = await Alert.findById(req.params.id)
  
  if (!alert) {
    throw new ErrorResponse(`Alert not found with id of ${req.params.id}`, 404)
  }
  
  // Only creator, admin, or manager can update
  if (req.user.role !== 'admin' && req.user.role !== 'manager') {
    throw new ErrorResponse('Not authorized to update alerts', 403)
  }
  
  alert = await Alert.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  )
  
  res.json({
    success: true,
    data: alert
  })
})

// @desc    Delete alert
// @route   DELETE /api/alerts/:id
// @access  Private/Admin
exports.deleteAlert = asyncHandler(async (req, res) => {
  const alert = await Alert.findById(req.params.id)
  
  if (!alert) {
    throw new ErrorResponse(`Alert not found with id of ${req.params.id}`, 404)
  }
  
  // Only admin can delete alerts
  if (req.user.role !== 'admin') {
    throw new ErrorResponse('Not authorized to delete alerts', 403)
  }
  
  await alert.deleteOne()
  
  res.json({
    success: true,
    data: {}
  })
})

// @desc    Get user alerts
// @route   GET /api/alerts/my-alerts
// @access  Private
exports.getUserAlerts = asyncHandler(async (req, res) => {
  const alerts = await Alert.find({
    $or: [
      { recipients: 'all' },
      { recipientIds: req.user.id },
      { buildingId: req.user.currentProperty },
      { role: req.user.role }
    ]
  })
  .sort('-createdAt')
  .limit(50)
  
  // Mark unread alerts count
  const unreadCount = alerts.filter(alert => 
    !alert.readBy?.some(read => read.userId.toString() === req.user.id)
  ).length
  
  res.json({
    success: true,
    count: alerts.length,
    unreadCount,
    data: alerts
  })
})

// @desc    Get building alerts
// @route   GET /api/alerts/building/:buildingId
// @access  Private
exports.getBuildingAlerts = asyncHandler(async (req, res) => {
  const alerts = await Alert.find({
    $or: [
      { buildingId: req.params.buildingId },
      { recipients: 'all' }
    ]
  })
  .sort('-createdAt')
  .limit(50)
  
  res.json({
    success: true,
    count: alerts.length,
    data: alerts
  })
})

// @desc    Mark alert as read
// @route   PUT /api/alerts/:id/read
// @access  Private
exports.markAlertAsRead = asyncHandler(async (req, res) => {
  const alert = await Alert.findById(req.params.id)
  
  if (!alert) {
    throw new ErrorResponse(`Alert not found with id of ${req.params.id}`, 404)
  }
  
  // Check if user has access to this alert
  const hasAccess = 
    alert.recipients === 'all' ||
    alert.recipientIds?.includes(req.user.id) ||
    alert.buildingId?.toString() === req.user.currentProperty?.toString() ||
    alert.role === req.user.role
  
  if (!hasAccess) {
    throw new ErrorResponse('Not authorized to mark this alert as read', 403)
  }
  
  // Check if already read
  if (!alert.readBy?.some(read => read.userId.toString() === req.user.id)) {
    alert.readBy = alert.readBy || []
    alert.readBy.push({
      userId: req.user.id,
      readAt: new Date()
    })
    
    await alert.save()
  }
  
  res.json({
    success: true,
    message: 'Alert marked as read'
  })
})

// @desc    Acknowledge alert
// @route   PUT /api/alerts/:id/acknowledge
// @access  Private
exports.acknowledgeAlert = asyncHandler(async (req, res) => {
  const alert = await Alert.findById(req.params.id)
  
  if (!alert) {
    throw new ErrorResponse(`Alert not found with id of ${req.params.id}`, 404)
  }
  
  // Check if user has access to this alert
  const hasAccess = 
    alert.recipients === 'all' ||
    alert.recipientIds?.includes(req.user.id) ||
    alert.buildingId?.toString() === req.user.currentProperty?.toString() ||
    alert.role === req.user.role
  
  if (!hasAccess) {
    throw new ErrorResponse('Not authorized to acknowledge this alert', 403)
  }
  
  // Check if already acknowledged
  if (!alert.acknowledgedBy?.some(ack => ack.userId.toString() === req.user.id)) {
    alert.acknowledgedBy = alert.acknowledgedBy || []
    alert.acknowledgedBy.push({
      userId: req.user.id,
      acknowledgedAt: new Date(),
      notes: req.body.notes
    })
    
    await alert.save()
  }
  
  res.json({
    success: true,
    message: 'Alert acknowledged'
  })
})

// @desc    Send alert immediately
// @route   POST /api/alerts/:id/send
// @access  Private/Admin/Manager/Landlord
exports.sendAlert = asyncHandler(async (req, res) => {
  const alert = await Alert.findById(req.params.id)
  
  if (!alert) {
    throw new ErrorResponse(`Alert not found with id of ${req.params.id}`, 404)
  }
  
  // Only admin, manager, or landlord can send alerts
  if (req.user.role !== 'admin' && req.user.role !== 'manager') {
    throw new ErrorResponse('Not authorized to send alerts', 403)
  }
  
  await this.sendAlertToRecipients(alert)
  
  alert.status = 'sent'
  await alert.save()
  
  res.json({
    success: true,
    message: 'Alert sent successfully'
  })
})

// @desc    Get alert statistics
// @route   GET /api/alerts/stats
// @access  Private/Admin/Manager
exports.getAlertStats = asyncHandler(async (req, res) => {
  const stats = await Alert.aggregate([
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
        readCount: {
          $sum: {
            $cond: [{ $gt: [{ $size: '$readBy' }, 0] }, 1, 0]
          }
        }
      }
    }
  ])
  
  const totalAlerts = await Alert.countDocuments()
  const unreadAlerts = await Alert.countDocuments({
    readBy: { $size: 0 }
  })
  
  res.json({
    success: true,
    data: {
      totalAlerts,
      unreadAlerts,
      byType: stats
    }
  })
})

// @desc    Get upcoming alerts
// @route   GET /api/alerts/upcoming
// @access  Private
exports.getUpcomingAlerts = asyncHandler(async (req, res) => {
  const alerts = await Alert.find({
    schedule: {
      $exists: true,
      $ne: null
    },
    'schedule.sendAt': {
      $gte: new Date(),
      $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Next 7 days
    },
    status: 'scheduled'
  })
  .sort('schedule.sendAt')
  
  res.json({
    success: true,
    count: alerts.length,
    data: alerts
  })
})

// Helper function to send alert to recipients
exports.sendAlertToRecipients = async (alert) => {
  // This function would send alerts via different channels
  // For now, we'll just log it
  console.log(`Sending alert: ${alert.title} to recipients`)
  
  // TODO: Implement actual sending logic
  // - In-app notifications (socket.io)
  // - Email notifications
  // - SMS notifications
  // - Push notifications
}
