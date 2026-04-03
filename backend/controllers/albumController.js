const Album = require('../models/Album');

const getAlbums = async (req, res) => {
  try {
    const { genre, search, sort } = req.query;
    let query = {};

    if (genre && genre !== 'Все') {
      query.genre = genre;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { artistName: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'rating') sortOption = { avgRating: -1 };
    if (sort === 'year') sortOption = { year: -1 };
    if (sort === 'plays') sortOption = { plays: -1 };

    const albums = await Album.find(query).sort(sortOption);
    res.json(albums);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

const getAlbumById = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    if (!album) {
      return res.status(404).json({ message: 'Альбом не найден' });
    }
    res.json(album);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

const createAlbum = async (req, res) => {
  try {
    const { title, artist, artistName, year, genre, cover, description, tracks } = req.body;

    if (!title || !artistName || !year || !genre) {
      return res.status(400).json({ message: 'Заполните обязательные поля' });
    }

    const album = await Album.create({
      title, artist, artistName, year, genre, cover, description,
      tracks: tracks || [],
    });

    res.status(201).json(album);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

const updateAlbum = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    if (!album) {
      return res.status(404).json({ message: 'Альбом не найден' });
    }

    const { title, artistName, year, genre, cover, description, tracks } = req.body;

    album.title = title || album.title;
    album.artistName = artistName || album.artistName;
    album.year = year || album.year;
    album.genre = genre || album.genre;
    album.cover = cover || album.cover;
    album.description = description || album.description;
    if (tracks) album.tracks = tracks;

    const updated = await album.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

const deleteAlbum = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    if (!album) {
      return res.status(404).json({ message: 'Альбом не найден' });
    }

    await album.deleteOne();
    res.json({ message: 'Альбом удалён' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

const addReview = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    if (!album) {
      return res.status(404).json({ message: 'Альбом не найден' });
    }

    const { rating, text } = req.body;
    if (!rating || !text) {
      return res.status(400).json({ message: 'Укажите оценку и текст рецензии' });
    }

    const already = album.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (already) {
      return res.status(400).json({ message: 'Вы уже оставили рецензию на этот альбом' });
    }

    album.reviews.unshift({
      user: req.user._id,
      username: req.user.username,
      rating: Number(rating),
      text,
    });

    await album.save();
    res.status(201).json(album.reviews[0]);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    if (!album) {
      return res.status(404).json({ message: 'Альбом не найден' });
    }

    const review = album.reviews.id(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Рецензия не найдена' });
    }

    const isOwner = review.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Нет прав для удаления рецензии' });
    }

    review.deleteOne();
    await album.save();
    res.json({ message: 'Рецензия удалена' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

const incrementAlbumPlays = async (req, res) => {
  try {
    const album = await Album.findByIdAndUpdate(
      req.params.id,
      { $inc: { plays: 1 } },
      { new: true }
    );
    if (!album) return res.status(404).json({ message: 'Альбом не найден' });
    res.json({ plays: album.plays });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

const incrementTrackPlays = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    if (!album) return res.status(404).json({ message: 'Альбом не найден' });

    const track = album.tracks.id(req.params.trackId);
    if (!track) return res.status(404).json({ message: 'Трек не найден' });

    track.plays += 1;
    await album.save();

    res.json({ trackId: track._id, plays: track.plays });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

module.exports = {
  getAlbums,
  getAlbumById,
  createAlbum,
  updateAlbum,
  deleteAlbum,
  addReview,
  deleteReview,
  incrementAlbumPlays,
  incrementTrackPlays,
};
