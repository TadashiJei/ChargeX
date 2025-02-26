import mongoose from 'mongoose';

const batteryTelemetrySchema = new mongoose.Schema({
  batteryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Battery',
    required: true
  },
  serialNumber: {
    type: String,
    required: true
  },
  chargeLevel: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  temperature: {
    type: Number,
    required: true
  },
  voltage: {
    type: Number,
    required: true
  },
  current: {
    type: Number,
    required: true
  },
  power: {
    type: Number,
    required: true
  },
  health: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    enum: ['charging', 'discharging', 'idle', 'offline', 'error'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Create indexes for efficient queries
batteryTelemetrySchema.index({ batteryId: 1, timestamp: -1 });
batteryTelemetrySchema.index({ serialNumber: 1 });

const BatteryTelemetry = mongoose.models.BatteryTelemetry || 
  mongoose.model('BatteryTelemetry', batteryTelemetrySchema);

export default BatteryTelemetry;
