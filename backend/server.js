require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const userRoutes = require('./routes/userRoutes');
const albumRoutes = require('./routes/albumRoutes');
const artistRoutes = require('./routes/artistRoutes');
const configRoutes = require('./routes/configRoutes');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// Статика: обложки и музыка из папки frontend/public
app.use('/covers', express.static(path.join(__dirname, '../frontend/public/covers')));
app.use('/music', express.static(path.join(__dirname, '../frontend/public/music')));

// API маршруты
app.use('/api/users', userRoutes);
app.use('/api/albums', albumRoutes);
app.use('/api/artists', artistRoutes);
app.use('/api/config', configRoutes);

// Раздача собранного React-фронта (после npm run build)
const frontendDist = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDist));

// Все остальные запросы → index.html (для React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'));
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Внутренняя ошибка сервера' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
