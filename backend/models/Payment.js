const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  // Payment Information
  paymentId: {
    type: String,
    required: true,
    unique: true
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  
  // Payment Details
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'KES'
  },
  description: {
    type: String,
    required: true
  },
  paymentType: {
    type: String,
    enum: [
      'rent',           // Monthly rent
      'deposit',        // Security deposit
      'amenity',        // Amenity fees
      'late_fee',       // Late payment fee
      'maintenance',    // Maintenance fee
      'other'           // Other fees
    ],
    required: true
  },
  
  // Period
  periodMonth: {
    type: String,
    required: true
  },
  periodYear: {
    type: Number,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  paidDate: Date,
  
  // M-Pesa Details
  mpesaDetails: {
    transactionId: String,
    receiptNumber: String,
    phoneNumber: String,
    amount: Number,
    transactionDate: Date,
    accountReference: String,
    merchantRequestId: String,
    checkoutRequestId: String,
    resultCode: String,
    resultDesc: String
  },
  
  // Payment Method
  paymentMethod: {
    type: String,
    enum: ['mpesa', 'bank', 'cash', 'card', 'bank_transfer'],
    default: 'mpesa'
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'],
    default: 'pending'
  },
  
  // Late Payment
  isLate: {
    type: Boolean,
    default: false
  },
  lateDays: Number,
  lateFee: {
    type: Number,
    default: 0
  },
  
  // Receipt
  receiptNumber: String,
  receiptUrl: String,
  
  // Balance
  balanceBefore: Number,
  balanceAfter: Number,
  
  // Notes
  notes: String,
  
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

// Generate payment ID before save
paymentSchema.pre('save', async function(next) {
  if (!this.paymentId) {
    const prefix = 'PAY';
    const year = new Date().getFullYear().toString().slice(-2);
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const count = await this.constructor.countDocuments();
    this.paymentId = `${prefix}${year}${month}${(count + 1).toString().padStart(5, '0')}`;
  }
  
  // Generate receipt number if payment is completed
  if (this.status === 'completed' && !this.receiptNumber) {
    const prefix = 'RCT';
    const year = new Date().getFullYear().toString().slice(-2);
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.receiptNumber = `${prefix}${year}${month}${random}`;
  }
  
  // Check if payment is late
  if (this.dueDate && !this.paidDate) {
    const today = new Date();
    const dueDate = new Date(this.dueDate);
    
    if (today > dueDate) {
      this.isLate = true;
      this.lateDays = Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24));
      
      // Calculate late fee (example: 5% of amount or 500 KES, whichever is higher)
      const percentageFee = this.amount * 0.05;
      this.lateFee = Math.max(percentageFee, 500);
    }
  }
  
  next();
});

// Virtual for total amount with late fee
paymentSchema.virtual('totalAmount').get(function() {
  return this.amount + (this.lateFee || 0);
});

// Virtual for payment status color
paymentSchema.virtual('statusColor').get(function() {
  const colors = {
    pending: 'warning',
    processing: 'info',
    completed: 'success',
    failed: 'error',
    refunded: 'secondary',
    cancelled: 'default'
  };
  return colors[this.status] || 'default';
});

// Virtual for due status
paymentSchema.virtual('dueStatus').get(function() {
  if (this.status === 'completed') return 'paid';
  
  const today = new Date();
  const dueDate = new Date(this.dueDate);
  const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
  
  if (daysUntilDue < 0) return 'overdue';
  if (daysUntilDue <= 3) return 'due-soon';
  if (daysUntilDue <= 7) return 'upcoming';
  return 'future';
});

// Indexes for better query performance
paymentSchema.index({ tenant: 1 });
paymentSchema.index({ property: 1 });
paymentSchema.index({ booking: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ dueDate: 1 });
paymentSchema.index({ paymentId: 1 }, { unique: true });
paymentSchema.index({ periodMonth: 1, periodYear: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
