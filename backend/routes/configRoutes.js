const express = require('express');
const router = express.Router();
const { getFeatured, setFeatured } = require('../controllers/configController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/featured', getFeatured);
router.put('/featured', protect, adminOnly, setFeatured);

module.exports = router;
