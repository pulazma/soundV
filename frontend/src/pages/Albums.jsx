import { useState, useEffect } from 'react';
import { getAlbums } from '../api';
import AlbumCard from '../components/AlbumCard';

const GENRES = ['Все', 'Trap / Dark Hip-Hop', 'Cloud Rap / Emo Rap', 'Rap / Trap', 'Cloud Rap / Alternative', 'Emo Rap / Trap', 'Drill / Trap'];

export default function Albums() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [genre, setGenre] = useState('Все');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (genre !== 'Все') params.genre = genre;
    if (search) params.search = search;
    if (sort) params.sort = sort;

    getAlbums(params)
      .then(setAlbums)
      .finally(() => setLoading(false));
  }, [genre, search, sort]);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Альбомы</h1>
        <p>Каталог музыкальных альбомов с рецензиями</p>
      </div>

      {/* Фильтры */}
      <div className="filters-bar">
        <input
          className="search-input"
          placeholder="🔍  Поиск по альбому или исполнителю..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="sort-select"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="">Сортировка</option>
          <option value="plays">По популярности</option>
          <option value="rating">По рейтингу</option>
          <option value="year">По году</option>
        </select>
      </div>

      <div className="genre-tabs">
        {GENRES.map((g) => (
          <button
            key={g}
            className={`genre-tab ${genre === g ? 'active' : ''}`}
            onClick={() => setGenre(g)}
          >
            {g}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-page"><div className="spinner" /></div>
      ) : albums.length === 0 ? (
        <p className="empty-msg">Альбомы не найдены</p>
      ) : (
        <div className="albums-grid">
          {albums.map((album) => (
            <AlbumCard key={album._id} album={album} />
          ))}
        </div>
      )}
    </div>
  );
}
