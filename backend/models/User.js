const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Имя пользователя обязательно'],
      trim: true,
      minlength: [3, 'Минимум 3 символа'],
    },
    email: {
      type: String,
      required: [true, 'Email обязателен'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Пароль обязателен'],
      minlength: [6, 'Минимум 6 символов'],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Album',
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
