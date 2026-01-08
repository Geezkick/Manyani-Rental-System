const User = require('../models/User');
const { ErrorResponse, asyncHandler } = require('../middleware/error');
const emailService = require('../config/email');
const crypto = require('crypto');
const path = require('path');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phone, password, nationalId, dateOfBirth, gender } = req.body;

  // Check if user exists
  const existingUser = await User.findOne({ 
    $or: [{ email }, { phone }, { nationalId }] 
  });

  if (existingUser) {
    throw new ErrorResponse('User with this email, phone or national ID already exists', 400);
  }

  // Create user without requiring nationalIdPhoto
  const user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    password,
    nationalId,
    dateOfBirth,
    gender,
    isVerified: false,
    nationalIdPhoto: req.body.nationalIdPhoto || '' // Make it optional
  });

  // Generate verification token
  const verificationToken = user.generateAuthToken();

  // Send welcome email
  try {
    await emailService.sendWelcomeEmail(user);
  } catch (error) {
    console.error('Failed to send welcome email:', error);
  }

  res.status(201).json({
    success: true,
    message: 'Registration successful.',
    token: verificationToken,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role
    }
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    throw new ErrorResponse('Please provide email and password', 400);
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new ErrorResponse('Invalid credentials', 401);
  }

  // Check if user is active
  if (!user.isActive) {
    throw new ErrorResponse('Account is deactivated. Please contact support.', 401);
  }

  // Check if account is locked
  if (user.isLocked()) {
    throw new ErrorResponse('Account is locked. Please try again later or contact support.', 401);
  }

  // Check password
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    // Increment login attempts
    await user.incLoginAttempts();
    throw new ErrorResponse('Invalid credentials', 401);
  }

  // Reset login attempts on successful login
  await User.findByIdAndUpdate(user._id, {
    loginAttempts: 0,
    lockUntil: undefined,
    lastLogin: new Date()
  });

  // Generate token
  const token = user.generateAuthToken();

  // Set cookie
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  res.json({
    success: true,
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profilePicture: user.profilePicture,
      language: user.language
    }
  });
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
    .populate('currentProperty', 'name address');

  res.json({
    success: true,
    user
  });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, phone, address, emergencyContact, language } = req.body;

  const updateData = {};
  if (firstName) updateData.firstName = firstName;
  if (lastName) updateData.lastName = lastName;
  if (phone) updateData.phone = phone;
  if (address) updateData.address = address;
  if (emergencyContact) updateData.emergencyContact = emergencyContact;
  if (language) updateData.language = language;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    updateData,
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    message: 'Profile updated successfully',
    user
  });
});

// @desc    Upload profile picture
// @route   POST /api/auth/upload-profile
// @access  Private
exports.uploadProfilePicture = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ErrorResponse('Please upload a file', 400);
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { profilePicture: `/uploads/profile-pictures/${req.file.filename}` },
    { new: true }
  );

  res.json({
    success: true,
    message: 'Profile picture uploaded successfully',
    profilePicture: user.profilePicture
  });
});

// @desc    Upload national ID photo
// @route   POST /api/auth/upload-national-id
// @access  Private
exports.uploadNationalId = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ErrorResponse('Please upload a file', 400);
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { nationalIdPhoto: `/uploads/documents/id-cards/${req.file.filename}` },
    { new: true }
  );

  res.json({
    success: true,
    message: 'National ID photo uploaded successfully',
    nationalIdPhoto: user.nationalIdPhoto
  });
});

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Get user with password
  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new ErrorResponse('Current password is incorrect', 400);
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.json({
    success: true,
    message: 'Password changed successfully'
  });
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ErrorResponse('No user found with this email', 404);
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(20).toString('hex');
  
  // Hash token and set to resetPasswordToken field
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set token expiry (1 hour)
  const resetPasswordExpire = Date.now() + 60 * 60 * 1000;

  await User.findByIdAndUpdate(user._id, {
    resetPasswordToken,
    resetPasswordExpire
  });

  // Create reset URL
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  // Send email (implementation needed)
  console.log('Reset URL:', resetUrl);

  res.json({
    success: true,
    message: 'Password reset email sent'
  });
});

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:token
// @access  Public
exports.resetPassword = asyncHandler(async (req, res) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    throw new ErrorResponse('Invalid or expired reset token', 400);
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.json({
    success: true,
    message: 'Password reset successful'
  });
});

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
exports.verifyEmail = asyncHandler(async (req, res) => {
  // Implementation depends on your email verification strategy
  res.json({
    success: true,
    message: 'Email verification endpoint'
  });
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});
