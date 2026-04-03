const express = require('express');
const router = express.Router();
const {
  getArtists,
  getArtistById,
  createArtist,
  updateArtist,
  deleteArtist,
} = require('../controllers/artistController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getArtists);
router.get('/:id', getArtistById);
router.post('/', protect, adminOnly, createArtist);
router.put('/:id', protect, adminOnly, updateArtist);
router.delete('/:id', protect, adminOnly, deleteArtist);

module.exports = router;
