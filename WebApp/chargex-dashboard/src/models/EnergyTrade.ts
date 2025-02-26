import mongoose from 'mongoose';

const energyTradeSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Seller is required'],
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  battery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Battery',
    required: [true, 'Battery is required'],
  },
  energyAmount: {
    type: Number,
    required: [true, 'Energy amount is required'],
    min: [0, 'Energy amount must be positive'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be positive'],
  },
  status: {
    type: String,
    enum: ['listed', 'pending', 'completed', 'cancelled'],
    default: 'listed',
  },
  type: {
    type: String,
    enum: ['limit', 'market'],
    default: 'limit',
  },
  expiresAt: {
    type: Date,
  },
  completedAt: {
    type: Date,
  },
  transactionHash: {
    type: String,
    trim: true,
  },
  contractAddress: {
    type: String,
    trim: true,
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
energyTradeSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Index for faster querying
energyTradeSchema.index({ status: 1, type: 1 });
energyTradeSchema.index({ seller: 1, status: 1 });
energyTradeSchema.index({ buyer: 1, status: 1 });

const EnergyTrade = mongoose.models.EnergyTrade || mongoose.model('EnergyTrade', energyTradeSchema);

export default EnergyTrade;
