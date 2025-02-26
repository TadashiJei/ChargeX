import mongoose from 'mongoose';

const aiPredictionSchema = new mongoose.Schema({
  battery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Battery',
    required: [true, 'Battery is required'],
  },
  predictionType: {
    type: String,
    enum: ['maintenance', 'failure', 'efficiency', 'lifespan'],
    required: [true, 'Prediction type is required'],
  },
  confidence: {
    type: Number,
    required: [true, 'Confidence score is required'],
    min: [0, 'Confidence must be between 0 and 100'],
    max: [100, 'Confidence must be between 0 and 100'],
  },
  predictedValue: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, 'Predicted value is required'],
  },
  predictedDate: {
    type: Date,
  },
  factors: [{
    name: {
      type: String,
      required: true,
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
  }],
  recommendation: {
    type: String,
    trim: true,
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'low',
  },
  status: {
    type: String,
    enum: ['pending', 'acknowledged', 'resolved', 'ignored'],
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
aiPredictionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Index for faster querying
aiPredictionSchema.index({ battery: 1, predictionType: 1, createdAt: -1 });
aiPredictionSchema.index({ severity: 1, status: 1 });

const AIPrediction = mongoose.models.AIPrediction || mongoose.model('AIPrediction', aiPredictionSchema);

export default AIPrediction;
