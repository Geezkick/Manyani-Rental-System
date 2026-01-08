const Property = require('../models/Property')
const { ErrorResponse, asyncHandler } = require('../middleware/error')

// @desc    Get all properties
// @route   GET /api/properties
// @access  Public
exports.getAllProperties = asyncHandler(async (req, res) => {
  const properties = await Property.find({ isActive: true })
    .populate('landlord', 'firstName lastName email phone')
    .sort('-createdAt')
  
  res.json({
    success: true,
    count: properties.length,
    data: properties
  })
})

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
exports.getPropertyById = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id)
    .populate('landlord', 'firstName lastName email phone profilePicture')
    .populate('propertyManager', 'firstName lastName email phone')
  
  if (!property) {
    throw new ErrorResponse(`Property not found with id of ${req.params.id}`, 404)
  }
  
  res.json({
    success: true,
    data: property
  })
})

// @desc    Create property
// @route   POST /api/properties
// @access  Private
exports.createProperty = asyncHandler(async (req, res) => {
  // Add user to req.body
  req.body.landlord = req.user.id
  
  const property = await Property.create(req.body)
  
  res.status(201).json({
    success: true,
    data: property
  })
})

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private
exports.updateProperty = asyncHandler(async (req, res) => {
  let property = await Property.findById(req.params.id)
  
  if (!property) {
    throw new ErrorResponse(`Property not found with id of ${req.params.id}`, 404)
  }
  
  // Make sure user is property owner, admin, or manager
  if (property.landlord.toString() !== req.user.id && 
      req.user.role !== 'admin' && 
      req.user.role !== 'manager') {
    throw new ErrorResponse('Not authorized to update this property', 403)
  }
  
  property = await Property.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  )
  
  res.json({
    success: true,
    data: property
  })
})

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private
exports.deleteProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id)
  
  if (!property) {
    throw new ErrorResponse(`Property not found with id of ${req.params.id}`, 404)
  }
  
  // Make sure user is property owner or admin
  if (property.landlord.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new ErrorResponse('Not authorized to delete this property', 403)
  }
  
  // Soft delete - mark as inactive
  property.isActive = false
  await property.save()
  
  res.json({
    success: true,
    data: {}
  })
})

// @desc    Search properties
// @route   GET /api/properties/search
// @access  Public
exports.searchProperties = asyncHandler(async (req, res) => {
  const { q, type, minPrice, maxPrice, city, amenities } = req.query
  
  let query = { isActive: true }
  
  // Search by text
  if (q) {
    query.$or = [
      { name: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
      { 'address.city': { $regex: q, $options: 'i' } },
      { 'address.county': { $regex: q, $options: 'i' } }
    ]
  }
  
  // Filter by type
  if (type) {
    query.type = type
  }
  
  // Filter by price range
  if (minPrice || maxPrice) {
    query['units.price'] = {}
    if (minPrice) query['units.price'].$gte = Number(minPrice)
    if (maxPrice) query['units.price'].$lte = Number(maxPrice)
  }
  
  // Filter by city
  if (city) {
    query['address.city'] = { $regex: city, $options: 'i' }
  }
  
  // Filter by amenities
  if (amenities) {
    const amenityList = amenities.split(',')
    amenityList.forEach(amenity => {
      query[`amenities.${amenity}`] = true
    })
  }
  
  const properties = await Property.find(query)
    .populate('landlord', 'firstName lastName')
    .sort('-createdAt')
    .limit(50)
  
  res.json({
    success: true,
    count: properties.length,
    data: properties
  })
})

// @desc    Get property units
// @route   GET /api/properties/:id/units
// @access  Public
exports.getPropertyUnits = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id).select('units')
  
  if (!property) {
    throw new ErrorResponse(`Property not found with id of ${req.params.id}`, 404)
  }
  
  res.json({
    success: true,
    count: property.units.length,
    data: property.units
  })
})

// @desc    Add property unit
// @route   POST /api/properties/:id/units
// @access  Private
exports.addPropertyUnit = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id)
  
  if (!property) {
    throw new ErrorResponse(`Property not found with id of ${req.params.id}`, 404)
  }
  
  // Make sure user is property owner, admin, or manager
  if (property.landlord.toString() !== req.user.id && 
      req.user.role !== 'admin' && 
      req.user.role !== 'manager') {
    throw new ErrorResponse('Not authorized to add units to this property', 403)
  }
  
  property.units.push(req.body)
  await property.save()
  
  res.status(201).json({
    success: true,
    data: property.units[property.units.length - 1]
  })
})

// @desc    Update property unit
// @route   PUT /api/properties/:id/units/:unitId
// @access  Private
exports.updatePropertyUnit = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id)
  
  if (!property) {
    throw new ErrorResponse(`Property not found with id of ${req.params.id}`, 404)
  }
  
  // Make sure user is property owner, admin, or manager
  if (property.landlord.toString() !== req.user.id && 
      req.user.role !== 'admin' && 
      req.user.role !== 'manager') {
    throw new ErrorResponse('Not authorized to update units in this property', 403)
  }
  
  const unitIndex = property.units.findIndex(
    unit => unit._id.toString() === req.params.unitId
  )
  
  if (unitIndex === -1) {
    throw new ErrorResponse('Unit not found', 404)
  }
  
  property.units[unitIndex] = {
    ...property.units[unitIndex].toObject(),
    ...req.body
  }
  
  await property.save()
  
  res.json({
    success: true,
    data: property.units[unitIndex]
  })
})

// @desc    Delete property unit
// @route   DELETE /api/properties/:id/units/:unitId
// @access  Private
exports.deletePropertyUnit = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id)
  
  if (!property) {
    throw new ErrorResponse(`Property not found with id of ${req.params.id}`, 404)
  }
  
  // Make sure user is property owner, admin, or manager
  if (property.landlord.toString() !== req.user.id && 
      req.user.role !== 'admin' && 
      req.user.role !== 'manager') {
    throw new ErrorResponse('Not authorized to delete units from this property', 403)
  }
  
  property.units = property.units.filter(
    unit => unit._id.toString() !== req.params.unitId
  )
  
  await property.save()
  
  res.json({
    success: true,
    data: {}
  })
})

// @desc    Get property statistics
// @route   GET /api/properties/stats
// @access  Private/Admin
exports.getPropertyStats = asyncHandler(async (req, res) => {
  const totalProperties = await Property.countDocuments({ isActive: true })
  const totalUnits = await Property.aggregate([
    { $match: { isActive: true } },
    { $project: { unitCount: { $size: '$units' } } },
    { $group: { _id: null, total: { $sum: '$unitCount' } } }
  ])
  
  const availableUnits = await Property.aggregate([
    { $match: { isActive: true } },
    { $unwind: '$units' },
    { $match: { 'units.status': 'available' } },
    { $group: { _id: null, total: { $sum: 1 } } }
  ])
  
  const propertiesByType = await Property.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: '$type', count: { $sum: 1 } } }
  ])
  
  res.json({
    success: true,
    data: {
      totalProperties,
      totalUnits: totalUnits[0]?.total || 0,
      availableUnits: availableUnits[0]?.total || 0,
      byType: propertiesByType
    }
  })
})

// @desc    Upload property photos
// @route   POST /api/properties/:id/upload-photos
// @access  Private
exports.uploadPropertyPhotos = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw new ErrorResponse('Please upload at least one photo', 400)
  }
  
  const property = await Property.findById(req.params.id)
  
  if (!property) {
    throw new ErrorResponse(`Property not found with id of ${req.params.id}`, 404)
  }
  
  // Make sure user is property owner, admin, or manager
  if (property.landlord.toString() !== req.user.id && 
      req.user.role !== 'admin' && 
      req.user.role !== 'manager') {
    throw new ErrorResponse('Not authorized to upload photos for this property', 403)
  }
  
  const photos = req.files.map(file => `/uploads/properties/${file.filename}`)
  property.photos.push(...photos)
  await property.save()
  
  res.json({
    success: true,
    data: photos
  })
})
