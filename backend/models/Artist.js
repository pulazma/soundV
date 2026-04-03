const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Название исполнителя обязательно'],
      trim: true,
    },
    genre: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      default: 'Неизвестно',
    },
    bio: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    formedYear: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Artist', artistSchema);
