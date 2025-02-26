import mongoose from 'mongoose';

const batterySchema = new mongoose.Schema({
  serialNumber: {
    type: String,
    required: [true, 'Serial number is required'],
    unique: true,
    trim: true,
  },
  model: {
    type: String,
    required: [true, 'Battery model is required'],
    trim: true,
  },
  capacity: {
    type: Number,
    required: [true, 'Battery capacity is required'],
    min: [0, 'Capacity must be positive'],
  },
  currentCharge: {
    type: Number,
    required: [true, 'Current charge is required'],
    min: [0, 'Current charge must be positive'],
    max: [100, 'Current charge cannot exceed 100%'],
  },
  health: {
    type: Number,
    required: [true, 'Battery health is required'],
    min: [0, 'Health must be positive'],
    max: [100, 'Health cannot exceed 100%'],
  },
  status: {
    type: String,
    enum: ['available', 'leased', 'charging', 'maintenance', 'decommissioned'],
    default: 'available',
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      default: [0, 0],
    },
    address: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
  },
  temperature: {
    type: Number,
    default: 25,
  },
  voltage: {
    type: Number,
    default: 0,
  },
  current: {
    type: Number,
    default: 0,
  },
  lastCharged: {
    type: Date,
    default: Date.now,
  },
  lastMaintenance: {
    type: Date,
    default: Date.now,
  },
  manufactureDate: {
    type: Date,
    required: [true, 'Manufacture date is required'],
  },
  cycleCount: {
    type: Number,
    default: 0,
  },
  contractAddress: {
    type: String,
    trim: true,
  },
  tokenId: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for geospatial queries
batterySchema.index({ location: '2dsphere' });

// Update the updatedAt field before saving
batterySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Battery = mongoose.models.Battery || mongoose.model('Battery', batterySchema);

export default Battery;
