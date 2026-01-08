const Maintenance = require('../models/Maintenance')
const Property = require('../models/Property')
const { ErrorResponse, asyncHandler } = require('../middleware/error')

// @desc    Get all maintenance requests
// @route   GET /api/maintenance
// @access  Private/Admin/Manager/Landlord
exports.getAllMaintenance = asyncHandler(async (req, res) => {
  let query = {}
  
  // Landlords can only see maintenance for their properties
  if (req.user.role === 'landlord') {
    const properties = await Property.find({ landlord: req.user.id }).select('_id')
    const propertyIds = properties.map(p => p._id)
    query.property = { $in: propertyIds }
  }
  
  // Managers can see all maintenance
  // Admins can see all maintenance
  
  const maintenance = await Maintenance.find(query)
    .populate('property', 'name address')
    .populate('requestedBy', 'firstName lastName email phone')
    .populate('assignedTo', 'firstName lastName')
    .populate('approvedBy', 'firstName lastName')
    .sort('-submittedDate')
  
  res.json({
    success: true,
    count: maintenance.length,
    data: maintenance
  })
})

// @desc    Get single maintenance request
// @route   GET /api/maintenance/:id
// @access  Private
exports.getMaintenanceById = asyncHandler(async (req, res) => {
  const maintenance = await Maintenance.findById(req.params.id)
    .populate('property', 'name address')
    .populate('requestedBy', 'firstName lastName email phone profilePicture')
    .populate('assignedTo', 'firstName lastName email phone')
    .populate('approvedBy', 'firstName lastName')
  
  if (!maintenance) {
    throw new ErrorResponse(`Maintenance request not found with id of ${req.params.id}`, 404)
  }
  
  // Check if user has access to this maintenance request
  if (maintenance.requestedBy._id.toString() !== req.user.id && 
      req.user.role !== 'admin' && 
      req.user.role !== 'manager') {
    
    // Check if user is landlord of the property
    const property = await Property.findById(maintenance.property)
    if (property.landlord.toString() !== req.user.id) {
      throw new ErrorResponse('Not authorized to access this maintenance request', 403)
    }
  }
  
  res.json({
    success: true,
    data: maintenance
  })
})

// @desc    Create maintenance request
// @route   POST /api/maintenance
// @access  Private
exports.createMaintenance = asyncHandler(async (req, res) => {
  // Add requester to req.body
  req.body.requestedBy = req.user.id
  
  // Handle file uploads
  if (req.files && req.files.length > 0) {
    req.body.photos = req.files.map(file => ({
      url: `/uploads/maintenance/${file.filename}`,
      caption: file.originalname,
      uploadedAt: new Date()
    }))
  }
  
  const maintenance = await Maintenance.create(req.body)
  
  res.status(201).json({
    success: true,
    data: maintenance
  })
})

// @desc    Update maintenance request
// @route   PUT /api/maintenance/:id
// @access  Private
exports.updateMaintenance = asyncHandler(async (req, res) => {
  let maintenance = await Maintenance.findById(req.params.id)
  
  if (!maintenance) {
    throw new ErrorResponse(`Maintenance request not found with id of ${req.params.id}`, 404)
  }
  
  // Check authorization
  if (maintenance.requestedBy.toString() !== req.user.id && 
      req.user.role !== 'admin' && 
      req.user.role !== 'manager') {
    
    const property = await Property.findById(maintenance.property)
    if (property.landlord.toString() !== req.user.id) {
      throw new ErrorResponse('Not authorized to update this maintenance request', 403)
    }
  }
  
  maintenance = await Maintenance.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  )
  
  res.json({
    success: true,
    data: maintenance
  })
})

// @desc    Delete maintenance request
// @route   DELETE /api/maintenance/:id
// @access  Private/Admin
exports.deleteMaintenance = asyncHandler(async (req, res) => {
  const maintenance = await Maintenance.findById(req.params.id)
  
  if (!maintenance) {
    throw new ErrorResponse(`Maintenance request not found with id of ${req.params.id}`, 404)
  }
  
  // Only admin can delete maintenance requests
  if (req.user.role !== 'admin') {
    throw new ErrorResponse('Not authorized to delete maintenance requests', 403)
  }
  
  await maintenance.deleteOne()
  
  res.json({
    success: true,
    data: {}
  })
})

// @desc    Get user maintenance requests
// @route   GET /api/maintenance/my-requests
// @access  Private
exports.getUserMaintenance = asyncHandler(async (req, res) => {
  const maintenance = await Maintenance.find({ requestedBy: req.user.id })
    .populate('property', 'name address')
    .populate('assignedTo', 'firstName lastName')
    .sort('-submittedDate')
  
  res.json({
    success: true,
    count: maintenance.length,
    data: maintenance
  })
})

// @desc    Get property maintenance requests
// @route   GET /api/maintenance/property/:propertyId
// @access  Private
exports.getPropertyMaintenance = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.propertyId)
  
  if (!property) {
    throw new ErrorResponse('Property not found', 404)
  }
  
  // Check if user has access to property maintenance
  if (property.landlord.toString() !== req.user.id && 
      req.user.role !== 'admin' && 
      req.user.role !== 'manager') {
    throw new ErrorResponse('Not authorized to access these maintenance requests', 403)
  }
  
  const maintenance = await Maintenance.find({ property: req.params.propertyId })
    .populate('requestedBy', 'firstName lastName email phone')
    .populate('assignedTo', 'firstName lastName')
    .sort('-submittedDate')
  
  res.json({
    success: true,
    count: maintenance.length,
    data: maintenance
  })
})

// @desc    Assign maintenance request
// @route   PUT /api/maintenance/:id/assign
// @access  Private/Admin/Manager/Landlord
exports.assignMaintenance = asyncHandler(async (req, res) => {
  const maintenance = await Maintenance.findById(req.params.id)
  
  if (!maintenance) {
    throw new ErrorResponse(`Maintenance request not found with id of ${req.params.id}`, 404)
  }
  
  // Check authorization
  const property = await Property.findById(maintenance.property)
  if (property.landlord.toString() !== req.user.id && 
      req.user.role !== 'admin' && 
      req.user.role !== 'manager') {
    throw new ErrorResponse('Not authorized to assign maintenance requests', 403)
  }
  
  maintenance.assignedTo = req.body.assignedTo
  maintenance.vendor = req.body.vendor
  maintenance.status = 'scheduled'
  
  if (req.body.scheduledDate) {
    maintenance.scheduledDate = req.body.scheduledDate
  }
  
  await maintenance.save()
  
  res.json({
    success: true,
    data: maintenance
  })
})

// @desc    Update maintenance status
// @route   PUT /api/maintenance/:id/status
// @access  Private
exports.updateStatus = asyncHandler(async (req, res) => {
  const maintenance = await Maintenance.findById(req.params.id)
  
  if (!maintenance) {
    throw new ErrorResponse(`Maintenance request not found with id of ${req.params.id}`, 404)
  }
  
  // Check authorization
  const canUpdateStatus = 
    maintenance.requestedBy.toString() === req.user.id ||
    maintenance.assignedTo?.toString() === req.user.id ||
    req.user.role === 'admin' ||
    req.user.role === 'manager'
  
  if (!canUpdateStatus) {
    const property = await Property.findById(maintenance.property)
    if (property.landlord.toString() !== req.user.id) {
      throw new ErrorResponse('Not authorized to update maintenance status', 403)
    }
  }
  
  maintenance.status = req.body.status
  
  if (req.body.status === 'completed') {
    maintenance.completedDate = new Date()
  }
  
  await maintenance.save()
  
  res.json({
    success: true,
    data: maintenance
  })
})

// @desc    Add update to maintenance request
// @route   POST /api/maintenance/:id/updates
// @access  Private
exports.addUpdate = asyncHandler(async (req, res) => {
  const maintenance = await Maintenance.findById(req.params.id)
  
  if (!maintenance) {
    throw new ErrorResponse(`Maintenance request not found with id of ${req.params.id}`, 404)
  }
  
  // Check authorization
  const canAddUpdate = 
    maintenance.requestedBy.toString() === req.user.id ||
    maintenance.assignedTo?.toString() === req.user.id ||
    req.user.role === 'admin' ||
    req.user.role === 'manager'
  
  if (!canAddUpdate) {
    const property = await Property.findById(maintenance.property)
    if (property.landlord.toString() !== req.user.id) {
      throw new ErrorResponse('Not authorized to add updates to this maintenance request', 403)
    }
  }
  
  const update = {
    user: req.user.id,
    status: req.body.status,
    note: req.body.note,
    photos: req.body.photos || []
  }
  
  await maintenance.addUpdate(update)
  
  res.status(201).json({
    success: true,
    data: maintenance.updates[maintenance.updates.length - 1]
  })
})

// @desc    Add feedback to maintenance request
// @route   POST /api/maintenance/:id/feedback
// @access  Private
exports.addFeedback = asyncHandler(async (req, res) => {
  const maintenance = await Maintenance.findById(req.params.id)
  
  if (!maintenance) {
    throw new ErrorResponse(`Maintenance request not found with id of ${req.params.id}`, 404)
  }
  
  // Check if user is the requester
  if (maintenance.requestedBy.toString() !== req.user.id) {
    throw new ErrorResponse('Only the requester can provide feedback', 403)
  }
  
  if (maintenance.status !== 'completed') {
    throw new ErrorResponse('Feedback can only be provided for completed maintenance', 400)
  }
  
  maintenance.tenantFeedback = {
    rating: req.body.rating,
    comment: req.body.comment,
    submittedAt: new Date()
  }
  
  await maintenance.save()
  
  res.json({
    success: true,
    data: maintenance.tenantFeedback
  })
})

// @desc    Schedule recurring maintenance
// @route   POST /api/maintenance/:id/schedule-recurring
// @access  Private/Admin/Manager
exports.scheduleRecurring = asyncHandler(async (req, res) => {
  const maintenance = await Maintenance.findById(req.params.id)
  
  if (!maintenance) {
    throw new ErrorResponse(`Maintenance request not found with id of ${req.params.id}`, 404)
  }
  
  // Only admin/manager can schedule recurring maintenance
  if (req.user.role !== 'admin' && req.user.role !== 'manager') {
    throw new ErrorResponse('Not authorized to schedule recurring maintenance', 403)
  }
  
  maintenance.isRecurring = true
  maintenance.recurrence = {
    frequency: req.body.frequency,
    nextDate: req.body.nextDate
  }
  
  await maintenance.save()
  
  res.json({
    success: true,
    data: maintenance.recurrence
  })
})

// @desc    Get maintenance statistics
// @route   GET /api/maintenance/stats
// @access  Private/Admin/Manager
exports.getMaintenanceStats = asyncHandler(async (req, res) => {
  const stats = await Maintenance.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        avgDaysOpen: { $avg: '$daysOpen' }
      }
    }
  ])
  
  const totalRequests = await Maintenance.countDocuments()
  const openRequests = await Maintenance.countDocuments({ 
    status: { $in: ['submitted', 'reviewed', 'scheduled', 'in_progress'] } 
  })
  const completedRequests = await Maintenance.countDocuments({ status: 'completed' })
  
  const categoryStats = await Maintenance.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ])
  
  res.json({
    success: true,
    data: {
      totalRequests,
      openRequests,
      completedRequests,
      byStatus: stats,
      byCategory: categoryStats
    }
  })
})
