const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Property name is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['apartment', 'house', 'studio', 'commercial', 'townhouse', 'bungalow'],
    required: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  
  // Location
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    county: { type: String, required: true },
    postalCode: String,
    coordinates: {
      lat: Number,
      lng: Number
    },
    landmarks: [String]
  },
  
  // Building Information
  buildingName: String,
  totalUnits: Number,
  availableUnits: Number,
  floors: Number,
  yearBuilt: Number,
  
  // Unit Details
  units: [{
    unitNumber: { type: String, required: true },
    floor: Number,
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    size: { type: Number, required: true }, // in sq ft
    price: { type: Number, required: true }, // monthly rent
    deposit: { type: Number, required: true }, // security deposit
    status: {
      type: String,
      enum: ['available', 'occupied', 'maintenance', 'reserved'],
      default: 'available'
    },
    features: [String],
    photos: [String],
    currentTenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    moveInDate: Date,
    leaseEndDate: Date
  }],
  
  // Amenities
  amenities: {
    // Basic
    water: { type: Boolean, default: true },
    electricity: { type: Boolean, default: true },
    wifi: { type: Boolean, default: false },
    parking: { type: Boolean, default: false },
    security: { type: Boolean, default: false },
    
    // Additional
    gym: { type: Boolean, default: false },
    pool: { type: Boolean, default: false },
    laundry: { type: Boolean, default: false },
    elevator: { type: Boolean, default: false },
    cctv: { type: Boolean, default: false },
    generator: { type: Boolean, default: false },
    garbage: { type: Boolean, default: true }
  },
  
  // Amenity Costs (Monthly)
  amenityCosts: {
    water: { type: Number, default: 0 },
    electricity: { type: Number, default: 0 },
    garbage: { type: Number, default: 0 },
    maintenance: { type: Number, default: 0 },
    security: { type: Number, default: 0 },
    parking: { type: Number, default: 0 }
  },
  
  // Management
  landlord: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  propertyManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  caretaker: {
    name: String,
    phone: String
  },
  
  // Policies
  policies: {
    petsAllowed: { type: Boolean, default: false },
    smokingAllowed: { type: Boolean, default: false },
    maxOccupants: Number,
    noticePeriod: { type: Number, default: 30 } // days
  },
  
  // Photos
  photos: [String],
  floorPlans: [String],
  documents: [{
    name: String,
    url: String,
    type: String
  }],
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  
  // Ratings & Reviews
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
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

// Update available units count
propertySchema.pre('save', function(next) {
  if (this.units && this.units.length > 0) {
    this.totalUnits = this.units.length;
    this.availableUnits = this.units.filter(unit => unit.status === 'available').length;
  }
  next();
});

// Virtual for full address
propertySchema.virtual('fullAddress').get(function() {
  return `${this.address.street}, ${this.address.city}, ${this.address.county}`;
});

// Virtual for total monthly revenue
propertySchema.virtual('monthlyRevenue').get(function() {
  if (!this.units) return 0;
  return this.units
    .filter(unit => unit.status === 'occupied' && unit.price)
    .reduce((total, unit) => total + unit.price, 0);
});

// Indexes for better query performance
propertySchema.index({ 'address.city': 1 });
propertySchema.index({ 'address.county': 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ type: 1 });
propertySchema.index({ 'amenities.security': 1 });

module.exports = mongoose.model('Property', propertySchema);
