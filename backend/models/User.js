const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  // Basic Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    match: [/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/, 'Please enter a valid phone number']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },
  
  // Profile Information
  profilePicture: {
    type: String,
    default: 'default-avatar.jpg'
  },
  nationalId: {
    type: String,
    required: [true, 'National ID is required'],
    unique: true
  },
  nationalIdPhoto: {
    type: String,
    default: '' // Changed from required to optional
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  
  // Contact Information
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  address: {
    street: String,
    city: String,
    county: String,
    postalCode: String
  },
  
  // Vehicle Information (for parking allocation)
  vehicles: [{
    registration: String,
    make: String,
    model: String,
    color: String,
    photo: String
  }],
  
  // Rental Information
  currentProperty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property'
  },
  unitNumber: String,
  moveInDate: Date,
  leaseEndDate: Date,
  
  // Account Settings
  role: {
    type: String,
    enum: ['tenant', 'landlord', 'admin', 'manager'],
    default: 'tenant'
  },
  language: {
    type: String,
    enum: ['en', 'sw'],
    default: 'en'
  },
  notifications: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: true },
    push: { type: Boolean, default: true }
  },
  
  // Payment Information
  mpesaNumber: String,
  paymentMethod: {
    type: String,
    enum: ['mpesa', 'bank', 'cash', 'card'],
    default: 'mpesa'
  },
  
  // Account Status
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isProfileComplete: {
    type: Boolean,
    default: false
  },
  
  // Security
  lastLogin: Date,
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update updatedAt on save
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token
userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { id: this._id, role: this.role, email: this.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// Check if account is locked
userSchema.methods.isLocked = function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

// Increment login attempts
userSchema.methods.incLoginAttempts = function() {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 24 * 60 * 60 * 1000 }; // 24 hours
  }
  
  return this.updateOne(updates);
};

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for age
userSchema.virtual('age').get(function() {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
});

module.exports = mongoose.model('User', userSchema);
