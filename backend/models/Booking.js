const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  // Booking Information
  bookingNumber: {
    type: String,
    required: true,
    unique: true
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  unit: {
    unitNumber: String,
    unitId: mongoose.Schema.Types.ObjectId
  },
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Dates
  moveInDate: {
    type: Date,
    required: true
  },
  moveOutDate: Date,
  leaseStartDate: {
    type: Date,
    required: true
  },
  leaseEndDate: {
    type: Date,
    required: true
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  
  // Pricing
  monthlyRent: {
    type: Number,
    required: true
  },
  securityDeposit: {
    type: Number,
    required: true
  },
  amenityFees: {
    water: { type: Number, default: 0 },
    electricity: { type: Number, default: 0 },
    garbage: { type: Number, default: 0 },
    maintenance: { type: Number, default: 0 },
    security: { type: Number, default: 0 },
    parking: { type: Number, default: 0 },
    other: { type: Number, default: 0 }
  },
  totalMonthlyFee: {
    type: Number,
    required: true
  },
  
  // Status
  status: {
    type: String,
    enum: [
      'pending',        // Booking created, awaiting approval
      'approved',       // Booking approved
      'rejected',       // Booking rejected
      'deposit_paid',   // Deposit paid
      'active',         // Tenant moved in
      'terminated',     // Lease terminated early
      'completed',      // Lease completed
      'cancelled'       // Booking cancelled
    ],
    default: 'pending'
  },
  
  // Documents
  leaseAgreement: String,
  inspectionReport: String,
  documents: [{
    name: String,
    url: String,
    uploadedAt: Date
  }],
  
  // Inspection Details
  inspection: {
    date: Date,
    conductedBy: mongoose.Schema.Types.ObjectId,
    notes: String,
    photos: [String],
    status: {
      type: String,
      enum: ['pending', 'scheduled', 'completed', 'failed'],
      default: 'pending'
    }
  },
  
  // Notices
  vacateNotice: {
    submitted: Boolean,
    noticeDate: Date,
    intendedVacateDate: Date,
    reason: String,
    approved: Boolean
  },
  
  // Renewal
  renewal: {
    offered: Boolean,
    offerDate: Date,
    newRent: Number,
    accepted: Boolean,
    responseDate: Date
  },
  
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

// Generate booking number before save
bookingSchema.pre('save', async function(next) {
  if (!this.bookingNumber) {
    const prefix = 'MANY';
    const year = new Date().getFullYear().toString().slice(-2);
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const count = await this.constructor.countDocuments();
    this.bookingNumber = `${prefix}${year}${month}${(count + 1).toString().padStart(5, '0')}`;
  }
  
  // Calculate total monthly fee
  if (this.monthlyRent && this.amenityFees) {
    const amenityTotal = Object.values(this.amenityFees).reduce((sum, fee) => sum + (fee || 0), 0);
    this.totalMonthlyFee = this.monthlyRent + amenityTotal;
  }
  
  next();
});

// Virtual for lease duration in months
bookingSchema.virtual('leaseDuration').get(function() {
  if (!this.leaseStartDate || !this.leaseEndDate) return 0;
  const start = new Date(this.leaseStartDate);
  const end = new Date(this.leaseEndDate);
  const diff = (end - start) / (1000 * 60 * 60 * 24 * 30.44);
  return Math.round(diff * 10) / 10;
});

// Virtual for days until move-in
bookingSchema.virtual('daysUntilMoveIn').get(function() {
  if (!this.moveInDate) return null;
  const today = new Date();
  const moveIn = new Date(this.moveInDate);
  const diff = Math.ceil((moveIn - today) / (1000 * 60 * 60 * 24));
  return diff;
});

// Virtual for total deposit required
bookingSchema.virtual('totalDeposit').get(function() {
  const deposit = this.securityDeposit || 0;
  const firstMonth = this.monthlyRent || 0;
  return deposit + firstMonth;
});

// Check if vacate notice is required (1 month before lease end)
bookingSchema.virtual('requiresVacateNotice').get(function() {
  if (!this.leaseEndDate || this.status !== 'active') return false;
  
  const today = new Date();
  const leaseEnd = new Date(this.leaseEndDate);
  const daysUntilEnd = Math.ceil((leaseEnd - today) / (1000 * 60 * 60 * 24));
  
  return daysUntilEnd <= 30 && !this.vacateNotice?.submitted;
});

// Indexes
bookingSchema.index({ tenant: 1 });
bookingSchema.index({ property: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ leaseEndDate: 1 });
bookingSchema.index({ bookingNumber: 1 }, { unique: true });

module.exports = mongoose.model('Booking', bookingSchema);
