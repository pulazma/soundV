const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema({
  title: { type: String, required: true },
  duration: { type: String, default: '0:00' },
  audioFile: { type: String, default: '' },
  plays: { type: Number, default: 0 },
});

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 10 },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

const albumSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Название альбома обязательно'],
      trim: true,
    },
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Artist',
      required: true,
    },
    artistName: { type: String, required: true },
    year: { type: Number, required: true },
    genre: { type: String, required: true },
    cover: { type: String, default: '' },
    description: { type: String, default: '' },
    tracks: [trackSchema],
    reviews: [reviewSchema],
    plays: { type: Number, default: 0 },
  },
  { timestamps: true }
);

albumSchema.virtual('avgRating').get(function () {
  if (this.reviews.length === 0) return 0;
  const sum = this.reviews.reduce((acc, r) => acc + r.rating, 0);
  return (sum / this.reviews.length).toFixed(1);
});

albumSchema.set('toJSON', { virtuals: true });
albumSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Album', albumSchema);
