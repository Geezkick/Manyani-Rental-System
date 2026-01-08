const Booking = require('../models/Booking')
const Property = require('../models/Property')
const User = require('../models/User')
const { ErrorResponse, asyncHandler } = require('../middleware/error')

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin/Manager/Landlord
exports.getAllBookings = asyncHandler(async (req, res) => {
  let query = {}
  
  // Landlords can only see bookings for their properties
  if (req.user.role === 'landlord') {
    const properties = await Property.find({ landlord: req.user.id }).select('_id')
    const propertyIds = properties.map(p => p._id)
    query.property = { $in: propertyIds }
  }
  
  // Managers can see all bookings
  // Admins can see all bookings
  
  const bookings = await Booking.find(query)
    .populate('property', 'name address')
    .populate('tenant', 'firstName lastName email phone')
    .sort('-createdAt')
  
  res.json({
    success: true,
    count: bookings.length,
    data: bookings
  })
})

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('property', 'name address')
    .populate('tenant', 'firstName lastName email phone profilePicture')
  
  if (!booking) {
    throw new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404)
  }
  
  // Check if user has access to this booking
  if (booking.tenant._id.toString() !== req.user.id && 
      req.user.role !== 'admin' && 
      req.user.role !== 'manager') {
    
    // Check if user is landlord of the property
    const propertyObj = await Property.findById(booking.property)
    if (propertyObj.landlord.toString() !== req.user.id) {
      throw new ErrorResponse('Not authorized to access this booking', 403)
    }
  }
  
  res.json({
    success: true,
    data: booking
  })
})

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = asyncHandler(async (req, res) => {
  // Add tenant to req.body
  req.body.tenant = req.user.id
  
  // Get property details
  const property = await Property.findById(req.body.propertyId)
  if (!property) {
    throw new ErrorResponse('Property not found', 404)
  }
  
  // Get unit details
  const unit = property.units.id(req.body.unitId)
  if (!unit) {
    throw new ErrorResponse('Unit not found', 404)
  }
  
  // Check if unit is available
  if (unit.status !== 'available') {
    throw new ErrorResponse('This unit is not available for booking', 400)
  }
  
  // Prepare booking data
  const bookingData = {
    ...req.body,
    property: req.body.propertyId,
    unit: {
      unitNumber: unit.unitNumber,
      unitId: unit._id
    },
    monthlyRent: unit.price,
    securityDeposit: unit.deposit,
    amenityFees: property.amenityCosts
  }
  
  const booking = await Booking.create(bookingData)
  
  // Update unit status
  unit.status = 'reserved'
  await property.save()
  
  res.status(201).json({
    success: true,
    data: booking
  })
})

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private
exports.updateBooking = asyncHandler(async (req, res) => {
  let booking = await Booking.findById(req.params.id)
  
  if (!booking) {
    throw new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404)
  }
  
  // Check authorization
  if (booking.tenant.toString() !== req.user.id && 
      req.user.role !== 'admin' && 
      req.user.role !== 'manager') {
    
    const propertyObj = await Property.findById(booking.property)
    if (propertyObj.landlord.toString() !== req.user.id) {
      throw new ErrorResponse('Not authorized to update this booking', 403)
    }
  }
  
  booking = await Booking.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  )
  
  res.json({
    success: true,
    data: booking
  })
})

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private/Admin
exports.deleteBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
  
  if (!booking) {
    throw new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404)
  }
  
  // Only admin can delete bookings
  if (req.user.role !== 'admin') {
    throw new ErrorResponse('Not authorized to delete bookings', 403)
  }
  
  // If booking was active, free up the unit
  if (booking.status === 'active') {
    const propertyObj = await Property.findById(booking.property)
    const unit = propertyObj.units.id(booking.unit.unitId)
    if (unit) {
      unit.status = 'available'
      unit.currentTenant = undefined
      await propertyObj.save()
    }
  }
  
  await booking.deleteOne()
  
  res.json({
    success: true,
    data: {}
  })
})

// @desc    Get user bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
exports.getUserBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ tenant: req.user.id })
    .populate('property', 'name address photos')
    .sort('-createdAt')
  
  res.json({
    success: true,
    count: bookings.length,
    data: bookings
  })
})

// @desc    Get property bookings
// @route   GET /api/bookings/property/:propertyId
// @access  Private
exports.getPropertyBookings = asyncHandler(async (req, res) => {
  const propertyObj = await Property.findById(req.params.propertyId)
  
  if (!propertyObj) {
    throw new ErrorResponse('Property not found', 404)
  }
  
  // Check if user has access to property bookings
  if (propertyObj.landlord.toString() !== req.user.id && 
      req.user.role !== 'admin' && 
      req.user.role !== 'manager') {
    throw new ErrorResponse('Not authorized to access these bookings', 403)
  }
  
  const bookings = await Booking.find({ property: req.params.propertyId })
    .populate('tenant', 'firstName lastName email phone')
    .sort('-createdAt')
  
  res.json({
    success: true,
    count: bookings.length,
    data: bookings
  })
})

// @desc    Approve booking
// @route   PUT /api/bookings/:id/approve
// @access  Private/Admin/Manager/Landlord
exports.approveBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
  
  if (!booking) {
    throw new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404)
  }
  
  // Check authorization
  const propertyObj = await Property.findById(booking.property)
  if (propertyObj.landlord.toString() !== req.user.id && 
      req.user.role !== 'admin' && 
      req.user.role !== 'manager') {
    throw new ErrorResponse('Not authorized to approve bookings', 403)
  }
  
  if (booking.status !== 'pending') {
    throw new ErrorResponse('Only pending bookings can be approved', 400)
  }
  
  booking.status = 'approved'
  await booking.save()
  
  res.json({
    success: true,
    data: booking
  })
})

// @desc    Reject booking
// @route   PUT /api/bookings/:id/reject
// @access  Private/Admin/Manager/Landlord
exports.rejectBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
  
  if (!booking) {
    throw new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404)
  }
  
  // Check authorization
  const propertyObj = await Property.findById(booking.property)
  if (propertyObj.landlord.toString() !== req.user.id && 
      req.user.role !== 'admin' && 
      req.user.role !== 'manager') {
    throw new ErrorResponse('Not authorized to reject bookings', 403)
  }
  
  if (booking.status !== 'pending') {
    throw new ErrorResponse('Only pending bookings can be rejected', 400)
  }
  
  booking.status = 'rejected'
  
  // Free up the unit
  const propertyObj2 = await Property.findById(booking.property)
  const unit = propertyObj2.units.id(booking.unit.unitId)
  if (unit) {
    unit.status = 'available'
    await propertyObj2.save()
  }
  
  await booking.save()
  
  res.json({
    success: true,
    data: booking
  })
})

// @desc    Submit vacate notice
// @route   PUT /api/bookings/:id/vacate-notice
// @access  Private
exports.submitVacateNotice = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
  
  if (!booking) {
    throw new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404)
  }
  
  // Check if user is the tenant
  if (booking.tenant.toString() !== req.user.id) {
    throw new ErrorResponse('Only the tenant can submit vacate notice', 403)
  }
  
  if (booking.status !== 'active') {
    throw new ErrorResponse('Only active bookings can submit vacate notice', 400)
  }
  
  booking.vacateNotice = {
    submitted: true,
    noticeDate: new Date(),
    intendedVacateDate: req.body.intendedVacateDate,
    reason: req.body.reason,
    approved: false
  }
  
  await booking.save()
  
  res.json({
    success: true,
    data: booking.vacateNotice
  })
})

// @desc    Schedule inspection
// @route   PUT /api/bookings/:id/schedule-inspection
// @access  Private/Admin/Manager/Landlord
exports.scheduleInspection = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
  
  if (!booking) {
    throw new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404)
  }
  
  // Check authorization
  const propertyObj = await Property.findById(booking.property)
  if (propertyObj.landlord.toString() !== req.user.id && 
      req.user.role !== 'admin' && 
      req.user.role !== 'manager') {
    throw new ErrorResponse('Not authorized to schedule inspections', 403)
  }
  
  booking.inspection = {
    ...req.body,
    status: 'scheduled'
  }
  
  await booking.save()
  
  res.json({
    success: true,
    data: booking.inspection
  })
})

// @desc    Renew lease
// @route   PUT /api/bookings/:id/renew
// @access  Private
exports.renewLease = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
  
  if (!booking) {
    throw new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404)
  }
  
  // Check if user is the tenant
  if (booking.tenant.toString() !== req.user.id) {
    throw new ErrorResponse('Only the tenant can renew lease', 403)
  }
  
  if (booking.status !== 'active') {
    throw new ErrorResponse('Only active bookings can be renewed', 400)
  }
  
  booking.renewal = {
    offered: true,
    offerDate: new Date(),
    newRent: req.body.newRent,
    accepted: false
  }
  
  await booking.save()
  
  res.json({
    success: true,
    data: booking.renewal
  })
})

// @desc    Get booking statistics
// @route   GET /api/bookings/stats
// @access  Private/Admin/Manager
exports.getBookingStats = asyncHandler(async (req, res) => {
  const stats = await Booking.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalRevenue: { $sum: '$monthlyRent' }
      }
    }
  ])
  
  const totalBookings = await Booking.countDocuments()
  const activeBookings = await Booking.countDocuments({ status: 'active' })
  const pendingBookings = await Booking.countDocuments({ status: 'pending' })
  
  res.json({
    success: true,
    data: {
      totalBookings,
      activeBookings,
      pendingBookings,
      byStatus: stats
    }
  })
})
