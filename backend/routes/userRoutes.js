const express = require('express');
const router = express.Router();
const { register, login, getMe, toggleFavorite } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/favorites/:albumId', protect, toggleFavorite);

module.exports = router;
