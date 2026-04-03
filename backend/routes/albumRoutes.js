const express = require('express');
const router = express.Router();
const {
  getAlbums,
  getAlbumById,
  createAlbum,
  updateAlbum,
  deleteAlbum,
  addReview,
  deleteReview,
  incrementAlbumPlays,
  incrementTrackPlays,
} = require('../controllers/albumController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getAlbums);
router.get('/:id', getAlbumById);
router.post('/', protect, adminOnly, createAlbum);
router.put('/:id', protect, adminOnly, updateAlbum);
router.delete('/:id', protect, adminOnly, deleteAlbum);

router.post('/:id/reviews', protect, addReview);
router.delete('/:id/reviews/:reviewId', protect, deleteReview);

router.post('/:id/play', incrementAlbumPlays);
router.post('/:id/tracks/:trackId/play', incrementTrackPlays);

module.exports = router;
