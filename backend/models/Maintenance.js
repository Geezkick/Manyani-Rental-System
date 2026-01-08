const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
  // Request Information
  requestNumber: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  
  // Location
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  unitNumber: String,
  specificLocation: String,
  
  // Requester
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Category & Priority
  category: {
    type: String,
    enum: [
      'plumbing',
      'electrical',
      'structural',
      'appliance',
      'heating_cooling',
      'pest_control',
      'cleaning',
      'security',
      'other'
    ],
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'emergency'],
    default: 'medium'
  },
  
  // Status Tracking
  status: {
    type: String,
    enum: [
      'submitted',     // Request submitted
      'reviewed',      // Request reviewed by management
      'scheduled',     // Scheduled for maintenance
      'in_progress',   // Maintenance in progress
      'completed',     // Maintenance completed
      'cancelled',     // Request cancelled
      'on_hold'        // Request on hold
    ],
    default: 'submitted'
  },
  
  // Dates
  submittedDate: {
    type: Date,
    default: Date.now
  },
  preferredDate: Date,
  preferredTime: String,
  scheduledDate: Date,
  completedDate: Date,
  
  // Assigned Personnel
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  vendor: {
    name: String,
    contact: String,
    company: String
  },
  
  // Cost & Approval
  estimatedCost: Number,
  actualCost: Number,
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvalDate: Date,
  
  // Photos & Documents
  photos: [{
    url: String,
    caption: String,
    uploadedAt: Date
  }],
  documents: [{
    name: String,
    url: String,
    type: String
  }],
  
  // Updates & Comments
  updates: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: String,
    note: String,
    photos: [String],
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Feedback
  tenantFeedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    submittedAt: Date
  },
  
  // Recurring Maintenance
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurrence: {
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'quarterly', 'yearly']
    },
    nextDate: Date
  },
  
  // Access Requirements
  accessInstructions: String,
  tenantWillBePresent: Boolean,
  
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

// Generate request number before save
maintenanceSchema.pre('save', async function(next) {
  if (!this.requestNumber) {
    const prefix = 'MNT';
    const year = new Date().getFullYear().toString().slice(-2);
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const count = await this.constructor.countDocuments();
    this.requestNumber = `${prefix}${year}${month}${(count + 1).toString().padStart(5, '0')}`;
  }
  
  // Set preferred date if not set
  if (!this.preferredDate) {
    this.preferredDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000); // 2 days from now
  }
  
  next();
});

// Virtual for days open
maintenanceSchema.virtual('daysOpen').get(function() {
  if (this.status === 'completed' && this.completedDate) {
    const submitted = new Date(this.submittedDate);
    const completed = new Date(this.completedDate);
    return Math.ceil((completed - submitted) / (1000 * 60 * 60 * 24));
  }
  
  const submitted = new Date(this.submittedDate);
  const today = new Date();
  return Math.ceil((today - submitted) / (1000 * 60 * 60 * 24));
});

// Virtual for status color
maintenanceSchema.virtual('statusColor').get(function() {
  const colors = {
    submitted: 'blue',
    reviewed: 'indigo',
    scheduled: 'purple',
    in_progress: 'orange',
    completed: 'green',
    cancelled: 'red',
    on_hold: 'gray'
  };
  return colors[this.status] || 'gray';
});

// Virtual for priority color
maintenanceSchema.virtual('priorityColor').get(function() {
  const colors = {
    low: 'green',
    medium: 'yellow',
    high: 'orange',
    emergency: 'red'
  };
  return colors[this.priority] || 'gray';
});

// Method to add status update
maintenanceSchema.methods.addUpdate = function(update) {
  this.updates.push(update);
  this.status = update.status;
  
  if (update.status === 'completed') {
    this.completedDate = new Date();
  }
  
  return this.save();
};

// Indexes for better query performance
maintenanceSchema.index({ requestNumber: 1 }, { unique: true });
maintenanceSchema.index({ property: 1 });
maintenanceSchema.index({ requestedBy: 1 });
maintenanceSchema.index({ assignedTo: 1 });
maintenanceSchema.index({ status: 1 });
maintenanceSchema.index({ priority: 1 });
maintenanceSchema.index({ submittedDate: -1 });
maintenanceSchema.index({ category: 1 });

module.exports = mongoose.model('Maintenance', maintenanceSchema);
