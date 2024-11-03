const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  image: { type: String, default: '' }, 
  createdAt: { type: Date, default: Date.now },
});

const ratingSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  value: { type: Number, required: true, enum: [-1, 1] },
  createdAt: { type: Date, default: Date.now },
});

const postSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  image: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  comments: [commentSchema],
  ratings: [ratingSchema],
});

module.exports = mongoose.model('CommunityPost', postSchema);
