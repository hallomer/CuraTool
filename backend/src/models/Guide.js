const mongoose = require('mongoose');

const stepSchema = new mongoose.Schema({
  description: String,
  imageUrl: {
    type: String,
    default: null,
  },
});

const materialSchema = new mongoose.Schema({
  name: String,
  imageUrl: {
    type: String,
    default: null,
  },
});

const guideSchema = new mongoose.Schema({
  category: String,
  title: String,
  intro: String,
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'] },
  timeRequired: String,
  materials: [materialSchema],
  steps: [stepSchema],
  safetyTips: [String],
  notes: [String],
  symbol: String,
});

guideSchema.index({ title: 'text', intro: 'text', notes: 'text' });

const Guide = mongoose.model('Guide', guideSchema);

module.exports = Guide;
