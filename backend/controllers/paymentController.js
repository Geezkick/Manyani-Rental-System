const Payment = require('../models/Payment')
const Booking = require('../models/Booking')
const Property = require('../models/Property')
const { ErrorResponse, asyncHandler } = require('../middleware/error')
const mpesaService = require('../config/mpesa')

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private/Admin/Manager/Landlord
exports.getAllPayments = asyncHandler(async (req, res) => {
  let query = {}
  
  // Landlords can only see payments for their properties
  if (req.user.role === 'landlord') {
    const properties = await Property.find({ landlord: req.user.id }).select('_id')
    const propertyIds = properties.map(p => p._id)
    query.property = { $in: propertyIds }
  }
  
  const payments = await Payment.find(query)
    .populate('property', 'name')
    .populate('booking', 'bookingNumber')
    .populate('tenant', 'firstName lastName')
    .sort('-createdAt')
  
  res.json({
    success: true,
    count: payments.length,
    data: payments
  })
})

// @desc    Get single payment
// @route   GET /api/payments/:id
// @access  Private
exports.getPaymentById = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id)
    .populate('property', 'name address')
    .populate('booking', 'bookingNumber')
    .populate('tenant', 'firstName lastName email phone')
  
  if (!payment) {
    throw new ErrorResponse(`Payment not found with id of ${req.params.id}`, 404)
  }
  
  // Check if user has access to this payment
  if (payment.tenant._id.toString() !== req.user.id && 
      req.user.role !== 'admin' && 
      req.user.role !== 'manager') {
    
    // Check if user is landlord of the property
    const propertyObj = await Property.findById(payment.property)
    if (propertyObj.landlord.toString() !== req.user.id) {
      throw new ErrorResponse('Not authorized to access this payment', 403)
    }
  }
  
  res.json({
    success: true,
    data: payment
  })
})

// @desc    Create payment
// @route   POST /api/payments
// @access  Private
exports.createPayment = asyncHandler(async (req, res) => {
  // Add tenant to req.body
  req.body.tenant = req.user.id
  
  // Verify booking exists
  const booking = await Booking.findById(req.body.bookingId)
  if (!booking) {
    throw new ErrorResponse('Booking not found', 404)
  }
  
  // Verify user is the tenant
  if (booking.tenant.toString() !== req.user.id) {
    throw new ErrorResponse('Not authorized to create payment for this booking', 403)
  }
  
  const payment = await Payment.create({
    ...req.body,
    booking: req.body.bookingId,
    property: booking.property,
    tenant: req.user.id
  })
  
  res.status(201).json({
    success: true,
    data: payment
  })
})

// @desc    Update payment
// @route   PUT /api/payments/:id
// @access  Private/Admin/Manager
exports.updatePayment = asyncHandler(async (req, res) => {
  let payment = await Payment.findById(req.params.id)
  
  if (!payment) {
    throw new ErrorResponse(`Payment not found with id of ${req.params.id}`, 404)
  }
  
  // Only admin/manager can update payments
  if (req.user.role !== 'admin' && req.user.role !== 'manager') {
    throw new ErrorResponse('Not authorized to update payments', 403)
  }
  
  payment = await Payment.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  )
  
  res.json({
    success: true,
    data: payment
  })
})

// @desc    Delete payment
// @route   DELETE /api/payments/:id
// @access  Private/Admin
exports.deletePayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id)
  
  if (!payment) {
    throw new ErrorResponse(`Payment not found with id of ${req.params.id}`, 404)
  }
  
  // Only admin can delete payments
  if (req.user.role !== 'admin') {
    throw new ErrorResponse('Not authorized to delete payments', 403)
  }
  
  await payment.deleteOne()
  
  res.json({
    success: true,
    data: {}
  })
})

// @desc    Get user payments
// @route   GET /api/payments/my-payments
// @access  Private
exports.getUserPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ tenant: req.user.id })
    .populate('property', 'name')
    .populate('booking', 'bookingNumber')
    .sort('-createdAt')
  
  res.json({
    success: true,
    count: payments.length,
    data: payments
  })
})

// @desc    Get property payments
// @route   GET /api/payments/property/:propertyId
// @access  Private
exports.getPropertyPayments = asyncHandler(async (req, res) => {
  const propertyObj = await Property.findById(req.params.propertyId)
  
  if (!propertyObj) {
    throw new ErrorResponse('Property not found', 404)
  }
  
  // Check if user has access to property payments
  if (propertyObj.landlord.toString() !== req.user.id && 
      req.user.role !== 'admin' && 
      req.user.role !== 'manager') {
    throw new ErrorResponse('Not authorized to access these payments', 403)
  }
  
  const payments = await Payment.find({ property: req.params.propertyId })
    .populate('tenant', 'firstName lastName')
    .populate('booking', 'bookingNumber')
    .sort('-createdAt')
  
  res.json({
    success: true,
    count: payments.length,
    data: payments
  })
})

// @desc    Initiate M-Pesa payment
// @route   POST /api/payments/mpesa/stk-push
// @access  Private
exports.initiateMpesaPayment = asyncHandler(async (req, res) => {
  const { phoneNumber, amount, accountReference, description } = req.body
  
  // Validate M-Pesa payment
  const validation = mpesaService.validatePayment(amount, phoneNumber, accountReference)
  if (!validation.isValid) {
    throw new ErrorResponse(validation.errors.join(', '), 400)
  }
  
  try {
    const result = await mpesaService.initiateSTKPush(
      phoneNumber,
      amount,
      accountReference,
      description || 'Manyani Rental Payment'
    )
    
    // Create payment record with pending status
    const payment = await Payment.create({
      paymentId: `MPESA-${Date.now()}`,
      tenant: req.user.id,
      amount,
      description: description || 'M-Pesa Payment',
      paymentType: 'rent',
      paymentMethod: 'mpesa',
      status: 'pending',
      mpesaDetails: {
        merchantRequestId: result.MerchantRequestID,
        checkoutRequestId: result.CheckoutRequestID,
        phoneNumber,
        amount
      }
    })
    
    res.json({
      success: true,
      message: 'M-Pesa payment initiated. Please check your phone to complete payment.',
      data: {
        paymentId: payment._id,
        checkoutRequestId: result.CheckoutRequestID,
        merchantRequestId: result.MerchantRequestID
      }
    })
  } catch (error) {
    throw new ErrorResponse('Failed to initiate M-Pesa payment', 500)
  }
})

// @desc    Process M-Pesa callback
// @route   POST /api/payments/mpesa/callback
// @access  Public (Called by Safaricom)
exports.processMpesaCallback = asyncHandler(async (req, res) => {
  const callbackData = req.body
  
  // Process callback data
  const result = mpesaService.processCallbackData(callbackData)
  
  if (result.resultCode === '0') {
    // Payment successful
    // Find payment by checkout request ID or transaction ID
    const payment = await Payment.findOne({
      'mpesaDetails.checkoutRequestId': result.checkoutRequestId
    })
    
    if (payment) {
      payment.status = 'completed'
      payment.paidDate = new Date()
      payment.mpesaDetails = {
        ...payment.mpesaDetails,
        ...result
      }
      payment.receiptNumber = result.receiptNumber
      
      await payment.save()
      
      // TODO: Send payment confirmation email
      // TODO: Update booking/payment status
    }
  }
  
  // Always respond to Safaricom
  res.json({
    ResultCode: '0',
    ResultDesc: 'Accept Service'
  })
})

// @desc    Verify payment
// @route   GET /api/payments/:id/verify
// @access  Private
exports.verifyPayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id)
  
  if (!payment) {
    throw new ErrorResponse('Payment not found', 404)
  }
  
  // Check if user has access
  if (payment.tenant.toString() !== req.user.id && 
      req.user.role !== 'admin' && 
      req.user.role !== 'manager') {
    throw new ErrorResponse('Not authorized to verify this payment', 403)
  }
  
  // If it's an M-Pesa payment, query status
  if (payment.paymentMethod === 'mpesa' && payment.status === 'pending') {
    if (payment.mpesaDetails?.checkoutRequestId) {
      try {
        const status = await mpesaService.querySTKPushStatus(
          payment.mpesaDetails.checkoutRequestId
        )
        
        if (status.ResultCode === '0') {
          payment.status = 'completed'
          payment.paidDate = new Date()
          await payment.save()
        }
      } catch (error) {
        console.error('Error querying payment status:', error)
      }
    }
  }
  
  res.json({
    success: true,
    data: {
      status: payment.status,
      paidDate: payment.paidDate,
      receiptNumber: payment.receiptNumber
    }
  })
})

// @desc    Generate receipt
// @route   GET /api/payments/:id/receipt
// @access  Private
exports.generateReceipt = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id)
    .populate('property', 'name address')
    .populate('tenant', 'firstName lastName email phone')
    .populate('booking', 'bookingNumber')
  
  if (!payment) {
    throw new ErrorResponse('Payment not found', 404)
  }
  
  // Check if user has access
  if (payment.tenant._id.toString() !== req.user.id && 
      req.user.role !== 'admin' && 
      req.user.role !== 'manager') {
    throw new ErrorResponse('Not authorized to generate receipt for this payment', 403)
  }
  
  if (payment.status !== 'completed') {
    throw new ErrorResponse('Receipt can only be generated for completed payments', 400)
  }
  
  // Generate receipt data
  const receipt = {
    receiptNumber: payment.receiptNumber || `RCT-${Date.now()}`,
    date: payment.paidDate,
    paymentId: payment.paymentId,
    amount: payment.amount,
    paymentMethod: payment.paymentMethod,
    description: payment.description,
    property: payment.property,
    tenant: payment.tenant,
    booking: payment.booking,
    mpesaDetails: payment.mpesaDetails
  }
  
  // TODO: Generate PDF receipt
  
  res.json({
    success: true,
    data: receipt
  })
})

// @desc    Get payment statistics
// @route   GET /api/payments/stats
// @access  Private/Admin/Manager
exports.getPaymentStats = asyncHandler(async (req, res) => {
  const stats = await Payment.aggregate([
    {
      $match: {
        status: 'completed',
        paidDate: {
          $gte: new Date(new Date().setMonth(new Date().getMonth() - 1))
        }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$paidDate' } },
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ])
  
  const totalRevenue = await Payment.aggregate([
    { $match: { status: 'completed' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ])
  
  const pendingPayments = await Payment.countDocuments({ status: 'pending' })
  const overduePayments = await Payment.countDocuments({ 
    status: 'pending',
    dueDate: { $lt: new Date() }
  })
  
  res.json({
    success: true,
    data: {
      totalRevenue: totalRevenue[0]?.total || 0,
      pendingPayments,
      overduePayments,
      dailyStats: stats
    }
  })
})

// @desc    Get overdue payments
// @route   GET /api/payments/overdue
// @access  Private/Admin/Manager/Landlord
exports.getOverduePayments = asyncHandler(async (req, res) => {
  let query = {
    status: 'pending',
    dueDate: { $lt: new Date() }
  }
  
  // Landlords can only see overdue payments for their properties
  if (req.user.role === 'landlord') {
    const properties = await Property.find({ landlord: req.user.id }).select('_id')
    const propertyIds = properties.map(p => p._id)
    query.property = { $in: propertyIds }
  }
  
  const payments = await Payment.find(query)
    .populate('property', 'name')
    .populate('tenant', 'firstName lastName email phone')
    .sort('dueDate')
  
  res.json({
    success: true,
    count: payments.length,
    data: payments
  })
})

// @desc    Send payment reminder
// @route   POST /api/payments/:id/send-reminder
// @access  Private/Admin/Manager/Landlord
exports.sendPaymentReminder = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id)
    .populate('tenant')
    .populate('property')
  
  if (!payment) {
    throw new ErrorResponse('Payment not found', 404)
  }
  
  // Check authorization
  if (req.user.role === 'landlord') {
    const propertyObj = await Property.findById(payment.property)
    if (propertyObj.landlord.toString() !== req.user.id) {
      throw new ErrorResponse('Not authorized to send reminder for this payment', 403)
    }
  }
  
  if (payment.status === 'completed') {
    throw new ErrorResponse('Cannot send reminder for completed payment', 400)
  }
  
  // TODO: Send email/SMS reminder
  // emailService.sendPaymentReminder(payment, payment.tenant)
  
  res.json({
    success: true,
    message: 'Payment reminder sent successfully'
  })
})
