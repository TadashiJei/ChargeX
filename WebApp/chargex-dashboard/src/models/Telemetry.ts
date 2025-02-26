import mongoose from 'mongoose';

const telemetrySchema = new mongoose.Schema({
  battery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Battery',
    required: [true, 'Battery is required'],
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: [true, 'Timestamp is required'],
  },
  voltage: {
    type: Number,
    required: [true, 'Voltage is required'],
  },
  current: {
    type: Number,
    required: [true, 'Current is required'],
  },
  temperature: {
    type: Number,
    required: [true, 'Temperature is required'],
  },
  chargeLevel: {
    type: Number,
    required: [true, 'Charge level is required'],
    min: [0, 'Charge level must be positive'],
    max: [100, 'Charge level cannot exceed 100%'],
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
  },
  status: {
    type: String,
    enum: ['idle', 'charging', 'discharging', 'error'],
    default: 'idle',
  },
  alerts: [{
    type: String,
    enum: ['low_charge', 'high_temperature', 'low_temperature', 'high_voltage', 'low_voltage', 'high_current', 'connection_lost'],
  }],
  cycleCount: {
    type: Number,
    default: 0,
  },
  healthScore: {
    type: Number,
    min: [0, 'Health score must be positive'],
    max: [100, 'Health score cannot exceed 100%'],
  },
  deviceId: {
    type: String,
    required: [true, 'Device ID is required'],
  },
  firmwareVersion: {
    type: String,
  },
  signalStrength: {
    type: Number,
  },
});

// Index for faster querying
telemetrySchema.index({ battery: 1, timestamp: -1 });
telemetrySchema.index({ location: '2dsphere' });

const Telemetry = mongoose.models.Telemetry || mongoose.model('Telemetry', telemetrySchema);

export default Telemetry;
