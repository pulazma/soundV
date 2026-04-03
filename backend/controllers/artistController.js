const Artist = require('../models/Artist');

// GET /api/artists
const getArtists = async (req, res) => {
  try {
    const artists = await Artist.find().sort({ name: 1 });
    res.json(artists);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

// GET /api/artists/:id
const getArtistById = async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);
    if (!artist) {
      return res.status(404).json({ message: 'Исполнитель не найден' });
    }
    res.json(artist);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

// POST /api/artists  (только admin)
const createArtist = async (req, res) => {
  try {
    const { name, genre, country, bio, image, formedYear } = req.body;
    if (!name || !genre) {
      return res.status(400).json({ message: 'Имя и жанр обязательны' });
    }
    const artist = await Artist.create({ name, genre, country, bio, image, formedYear });
    res.status(201).json(artist);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

// PUT /api/artists/:id  (только admin)
const updateArtist = async (req, res) => {
  try {
    const artist = await Artist.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!artist) return res.status(404).json({ message: 'Исполнитель не найден' });
    res.json(artist);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

// DELETE /api/artists/:id  (только admin)
const deleteArtist = async (req, res) => {
  try {
    const artist = await Artist.findByIdAndDelete(req.params.id);
    if (!artist) return res.status(404).json({ message: 'Исполнитель не найден' });
    res.json({ message: 'Исполнитель удалён' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

module.exports = { getArtists, getArtistById, createArtist, updateArtist, deleteArtist };
