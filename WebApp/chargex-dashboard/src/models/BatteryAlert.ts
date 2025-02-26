import mongoose from 'mongoose';

const batteryAlertSchema = new mongoose.Schema({
  batteryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Battery',
    required: true
  },
  serialNumber: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: [
      'low_charge',
      'high_temperature',
      'low_temperature',
      'high_voltage',
      'low_voltage',
      'high_current',
      'connection_lost',
      'health_degradation',
      'maintenance_required',
      'system_error'
    ],
    required: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  acknowledged: {
    type: Boolean,
    default: false
  }
});

// Create indexes for efficient queries
batteryAlertSchema.index({ batteryId: 1, timestamp: -1 });
batteryAlertSchema.index({ serialNumber: 1 });
batteryAlertSchema.index({ severity: 1 });
batteryAlertSchema.index({ acknowledged: 1 });

const BatteryAlert = mongoose.models.BatteryAlert || 
  mongoose.model('BatteryAlert', batteryAlertSchema);

export default BatteryAlert;
