const User = require('../models/User')
const { ErrorResponse, asyncHandler } = require('../middleware/error')

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password')
  
  res.json({
    success: true,
    count: users.length,
    data: users
  })
})

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private
exports.getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')
  
  if (!user) {
    throw new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
  }
  
  res.json({
    success: true,
    data: user
  })
})

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
exports.updateUser = asyncHandler(async (req, res) => {
  // Make sure user can only update their own profile or admin
  if (req.user.id !== req.params.id && req.user.role !== 'admin') {
    throw new ErrorResponse('Not authorized to update this user', 403)
  }
  
  const user = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  ).select('-password')
  
  if (!user) {
    throw new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
  }
  
  res.json({
    success: true,
    data: user
  })
})

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  
  if (!user) {
    throw new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
  }
  
  await user.deleteOne()
  
  res.json({
    success: true,
    data: {}
  })
})

// @desc    Get user stats
// @route   GET /api/users/stats
// @access  Private/Admin
exports.getUserStats = asyncHandler(async (req, res) => {
  const stats = await User.aggregate([
    {
      $group: {
        _id: '$role',
        count: { $sum: 1 }
      }
    }
  ])
  
  const totalUsers = await User.countDocuments()
  const activeUsers = await User.countDocuments({ isActive: true })
  
  res.json({
    success: true,
    data: {
      totalUsers,
      activeUsers,
      byRole: stats
    }
  })
})

// @desc    Search users
// @route   GET /api/users/search
// @access  Private/Admin
exports.searchUsers = asyncHandler(async (req, res) => {
  const { q } = req.query
  
  if (!q) {
    throw new ErrorResponse('Please provide a search query', 400)
  }
  
  const users = await User.find({
    $or: [
      { firstName: { $regex: q, $options: 'i' } },
      { lastName: { $regex: q, $options: 'i' } },
      { email: { $regex: q, $options: 'i' } },
      { phone: { $regex: q, $options: 'i' } },
      { nationalId: { $regex: q, $options: 'i' } }
    ]
  }).select('-password').limit(20)
  
  res.json({
    success: true,
    count: users.length,
    data: users
  })
})

// @desc    Get user bookings
// @route   GET /api/users/:id/bookings
// @access  Private
exports.getUserBookings = asyncHandler(async (req, res) => {
  // Check if user is accessing their own bookings or is admin
  if (req.user.id !== req.params.id && req.user.role !== 'admin') {
    throw new ErrorResponse('Not authorized to access these bookings', 403)
  }
  
  const bookings = await Booking.find({ tenant: req.params.id })
    .populate('property', 'name address')
    .sort('-createdAt')
  
  res.json({
    success: true,
    count: bookings.length,
    data: bookings
  })
})

// @desc    Get user payments
// @route   GET /api/users/:id/payments
// @access  Private
exports.getUserPayments = asyncHandler(async (req, res) => {
  // Check if user is accessing their own payments or is admin
  if (req.user.id !== req.params.id && req.user.role !== 'admin') {
    throw new ErrorResponse('Not authorized to access these payments', 403)
  }
  
  const payments = await Payment.find({ tenant: req.params.id })
    .populate('property', 'name')
    .populate('booking', 'bookingNumber')
    .sort('-createdAt')
    .limit(50)
  
  res.json({
    success: true,
    count: payments.length,
    data: payments
  })
})

// @desc    Get user alerts
// @route   GET /api/users/:id/alerts
// @access  Private
exports.getUserAlerts = asyncHandler(async (req, res) => {
  // Check if user is accessing their own alerts or is admin
  if (req.user.id !== req.params.id && req.user.role !== 'admin') {
    throw new ErrorResponse('Not authorized to access these alerts', 403)
  }
  
  const alerts = await Alert.find({
    $or: [
      { recipientIds: req.params.id },
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
