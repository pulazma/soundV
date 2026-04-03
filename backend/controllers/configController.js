const SiteConfig = require('../models/SiteConfig');
const Album = require('../models/Album');

const getFeatured = async (req, res) => {
  try {
    const config = await SiteConfig.findOne({ key: 'featuredAlbum' });
    if (!config || !config.value) {
      return res.json(null);
    }
    const album = await Album.findById(config.value);
    res.json(album);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

const setFeatured = async (req, res) => {
  try {
    const { albumId } = req.body;
    if (!albumId) {
      return res.status(400).json({ message: 'albumId обязателен' });
    }
    const album = await Album.findById(albumId);
    if (!album) {
      return res.status(404).json({ message: 'Альбом не найден' });
    }

    await SiteConfig.findOneAndUpdate(
      { key: 'featuredAlbum' },
      { key: 'featuredAlbum', value: albumId },
      { upsert: true, new: true }
    );

    res.json({ message: 'Альбом месяца установлен', album });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

module.exports = { getFeatured, setFeatured };
