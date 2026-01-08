const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  // Alert Information
  title: {
    type: String,
    required: [true, 'Alert title is required']
  },
  titleSw: String, // Swahili translation
  description: {
    type: String,
    required: [true, 'Alert description is required']
  },
  descriptionSw: String, // Swahili translation
  
  // Alert Type
  type: {
    type: String,
    enum: [
      'payment',          // Payment due/overdue
      'maintenance',      // Maintenance required/scheduled
      'security',         // Security alert
      'announcement',     // General announcement
      'utility',          // Water/electricity/garbage alerts
      'vacate',           // Vacate notice
      'inspection',       // Property inspection
      'meeting',          // Community meeting
      'emergency',        // Emergency situation
      'system'           // System notification
    ],
    required: true
  },
  
  // Priority
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  
  // Recipients
  recipients: {
    type: String,
    enum: ['all', 'building', 'unit', 'individual', 'role'],
    default: 'all'
  },
  recipientIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  buildingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property'
  },
  unitNumber: String,
  role: String,
  
  // Scheduling
  schedule: {
    sendAt: Date,
    repeat: {
      type: String,
      enum: ['once', 'daily', 'weekly', 'monthly', 'yearly'],
      default: 'once'
    },
    endDate: Date
  },
  
  // Actions
  actions: [{
    label: String,
    url: String,
    type: String, // 'payment', 'view', 'acknowledge', 'dismiss'
    required: Boolean
  }],
  
  // Status
  status: {
    type: String,
    enum: ['scheduled', 'sent', 'read', 'acknowledged', 'expired', 'cancelled'],
    default: 'scheduled'
  },
  
  // Read/Acknowledge tracking
  readBy: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: Date
  }],
  acknowledgedBy: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    acknowledgedAt: Date,
    notes: String
  }],
  
  // Delivery Methods
  deliveryMethods: {
    inApp: { type: Boolean, default: true },
    email: { type: Boolean, default: false },
    sms: { type: Boolean, default: false },
    push: { type: Boolean, default: false }
  },
  
  // Metadata
  metadata: {
    paymentId: mongoose.Schema.Types.ObjectId,
    bookingId: mongoose.Schema.Types.ObjectId,
    maintenanceId: mongoose.Schema.Types.ObjectId,
    utilityType: String,
    amount: Number,
    dueDate: Date
  },
  
  // Expiry
  expiresAt: Date,
  
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

// Pre-save middleware to set expiration if not set
alertSchema.pre('save', function(next) {
  if (!this.expiresAt) {
    // Default expiration based on priority
    const expirationDays = {
      critical: 7,    // 7 days
      high: 14,       // 14 days
      medium: 30,     // 30 days
      low: 60         // 60 days
    };
    
    const days = expirationDays[this.priority] || 30;
    this.expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  }
  
  // Auto-translate if Swahili fields are empty
  if (!this.titleSw) {
    // In production, you would use a translation service
    // This is a simple example
    const translations = {
      'Payment Due': 'Malipo Yanayotakiwa',
      'Maintenance Required': 'Matengenezo Yanahitajika',
      'Security Alert': 'Tahadhari ya Usalama',
      'Water Bill Due': 'Bili ya Maji Inayotakiwa',
      'Electricity Bill Due': 'Bili ya Umeme Inayotakiwa',
      'Garbage Collection': 'Uokoji wa Taka',
      'Vacate Notice': 'Notisi ya Kuondoka',
      'Community Meeting': 'Mkutano wa Jamii'
    };
    
    this.titleSw = translations[this.title] || this.title;
  }
  
  if (!this.descriptionSw) {
    this.descriptionSw = this.description;
  }
  
  next();
});

// Virtual for localized title
alertSchema.virtual('localizedTitle').get(function() {
  return {
    en: this.title,
    sw: this.titleSw || this.title
  };
});

// Virtual for localized description
alertSchema.virtual('localizedDescription').get(function() {
  return {
    en: this.description,
    sw: this.descriptionSw || this.description
  };
});

// Virtual for isExpired
alertSchema.virtual('isExpired').get(function() {
  if (!this.expiresAt) return false;
  return new Date() > this.expiresAt;
});

// Virtual for isRead by specific user
alertSchema.methods.isReadBy = function(userId) {
  return this.readBy.some(record => record.userId.toString() === userId.toString());
};

// Virtual for isAcknowledged by specific user
alertSchema.methods.isAcknowledgedBy = function(userId) {
  return this.acknowledgedBy.some(record => record.userId.toString() === userId.toString());
};

// Indexes
alertSchema.index({ type: 1 });
alertSchema.index({ priority: 1 });
alertSchema.index({ status: 1 });
alertSchema.index({ expiresAt: 1 });
alertSchema.index({ createdAt: -1 });
alertSchema.index({ 'schedule.sendAt': 1 });
alertSchema.index({ buildingId: 1 });
alertSchema.index({ recipientIds: 1 });

module.exports = mongoose.model('Alert', alertSchema);
