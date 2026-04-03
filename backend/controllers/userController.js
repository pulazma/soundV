const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Заполните все поля' });
    }
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const count = await User.countDocuments();
    const role = count === 0 ? 'admin' : 'user';
    const user = await User.create({ username, email, password: hashedPassword, role });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      favorites: [],
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

// POST /api/users/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Заполните все поля' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      favorites: user.favorites,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('favorites', 'title artistName cover year plays');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

const toggleFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const albumId = req.params.albumId;

    const idx = user.favorites.findIndex((id) => id.toString() === albumId);
    if (idx === -1) {
      user.favorites.push(albumId);
    } else {
      user.favorites.splice(idx, 1);
    }

    await user.save();

    const updated = await User.findById(user._id)
      .select('favorites')
      .populate('favorites', 'title artistName cover year plays');

    res.json({ favorites: updated.favorites });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

module.exports = { register, login, getMe, toggleFavorite };
