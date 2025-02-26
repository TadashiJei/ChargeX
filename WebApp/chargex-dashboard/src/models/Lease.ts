import mongoose from 'mongoose';

const leaseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
  },
  battery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Battery',
    required: [true, 'Battery is required'],
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
    default: Date.now,
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled', 'overdue'],
    default: 'active',
  },
  cost: {
    type: Number,
    required: [true, 'Cost is required'],
    min: [0, 'Cost must be positive'],
  },
  paymentMethod: {
    type: String,
    enum: ['crypto', 'credit_card', 'bank_transfer'],
    required: [true, 'Payment method is required'],
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
  },
  transactionHash: {
    type: String,
    trim: true,
  },
  contractAddress: {
    type: String,
    trim: true,
  },
  initialCharge: {
    type: Number,
    required: [true, 'Initial charge is required'],
    min: [0, 'Initial charge must be positive'],
    max: [100, 'Initial charge cannot exceed 100%'],
  },
  returnCharge: {
    type: Number,
    min: [0, 'Return charge must be positive'],
    max: [100, 'Return charge cannot exceed 100%'],
  },
  notes: {
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

// Update the updatedAt field before saving
leaseSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Lease = mongoose.models.Lease || mongoose.model('Lease', leaseSchema);

export default Lease;
