const mongoose = require('mongoose');

const communicationSchema = new mongoose.Schema({
  // Thread Information
  threadId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: [true, 'Thread title is required']
  },
  type: {
    type: String,
    enum: ['community', 'security', 'maintenance', 'general', 'emergency', 'social'],
    default: 'general'
  },
  
  // Participants
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    role: {
      type: String,
      enum: ['member', 'admin', 'moderator'],
      default: 'member'
    },
    isMuted: {
      type: Boolean,
      default: false
    }
  }],
  
  // Building/Property Context
  building: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property'
  },
  floor: Number,
  unitNumber: String,
  
  // Messages
  messages: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true
    },
    translation: {
      sw: String,
      en: String
    },
    attachments: [{
      name: String,
      url: String,
      type: String,
      size: Number
    }],
    isEdited: {
      type: Boolean,
      default: false
    },
    editedAt: Date,
    isDeleted: {
      type: Boolean,
      default: false
    },
    deletedAt: Date,
    reactions: [{
      user: mongoose.Schema.Types.ObjectId,
      emoji: String,
      reactedAt: Date
    }],
    readBy: [{
      user: mongoose.Schema.Types.ObjectId,
      readAt: Date
    }],
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Security Features
  isEncrypted: {
    type: Boolean,
    default: false
  },
  encryptionKey: String,
  isReported: {
    type: Boolean,
    default: false
  },
  reports: [{
    reporter: mongoose.Schema.Types.ObjectId,
    reason: String,
    description: String,
    reportedAt: Date,
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
      default: 'pending'
    }
  }],
  
  // Settings
  settings: {
    allowImages: { type: Boolean, default: true },
    allowFiles: { type: Boolean, default: true },
    allowVoice: { type: Boolean, default: false },
    requireModeration: { type: Boolean, default: false },
    autoTranslate: { type: Boolean, default: true }
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  lastActivity: {
    type: Date,
    default: Date.now
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

// Generate thread ID before save
communicationSchema.pre('save', async function(next) {
  if (!this.threadId) {
    const prefix = 'THREAD';
    const random = Math.random().toString(36).substr(2, 9).toUpperCase();
    this.threadId = `${prefix}-${random}`;
  }
  
  // Update last activity timestamp
  if (this.messages && this.messages.length > 0) {
    const lastMessage = this.messages[this.messages.length - 1];
    this.lastActivity = lastMessage.createdAt || new Date();
  }
  
  next();
});

// Virtual for unread count for a specific user
communicationSchema.methods.getUnreadCount = function(userId) {
  if (!this.messages || this.messages.length === 0) return 0;
  
  const userMessages = this.messages.filter(msg => 
    msg.sender.toString() !== userId.toString()
  );
  
  return userMessages.filter(msg => 
    !msg.readBy.some(read => read.user.toString() === userId.toString())
  ).length;
};

// Virtual for last message
communicationSchema.virtual('lastMessage').get(function() {
  if (!this.messages || this.messages.length === 0) return null;
  return this.messages[this.messages.length - 1];
});

// Virtual for participant count
communicationSchema.virtual('participantCount').get(function() {
  return this.participants ? this.participants.length : 0;
});

// Virtual for message count
communicationSchema.virtual('messageCount').get(function() {
  return this.messages ? this.messages.length : 0;
});

// Method to add a message
communicationSchema.methods.addMessage = function(message) {
  this.messages.push(message);
  this.lastActivity = new Date();
  return this.save();
};

// Method to mark messages as read
communicationSchema.methods.markAsRead = function(userId) {
  const now = new Date();
  
  this.messages.forEach(message => {
    if (message.sender.toString() !== userId.toString()) {
      const alreadyRead = message.readBy.some(read => 
        read.user.toString() === userId.toString()
      );
      
      if (!alreadyRead) {
        message.readBy.push({
          user: userId,
          readAt: now
        });
      }
    }
  });
  
  return this.save();
};

// Indexes for better query performance
communicationSchema.index({ threadId: 1 }, { unique: true });
communicationSchema.index({ building: 1 });
communicationSchema.index({ 'participants.user': 1 });
communicationSchema.index({ lastActivity: -1 });
communicationSchema.index({ type: 1 });
communicationSchema.index({ isActive: 1 });
communicationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Communication', communicationSchema);
