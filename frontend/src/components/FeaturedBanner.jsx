import { Link } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext';

export default function FeaturedBanner({ album }) {
  const { playAlbum } = usePlayer();

  if (!album) return null;

  const avgRating = album.reviews?.length > 0
    ? (album.reviews.reduce((s, r) => s + r.rating, 0) / album.reviews.length).toFixed(1)
    : album.avgRating || '—';

  return (
    <div className="featured-banner">
      {/* Фоновая обложка с блюром */}
      <div
        className="featured-bg"
        style={{ backgroundImage: `url(${album.cover})` }}
      />
      <div className="featured-overlay" />

      <div className="featured-content">
        {/* Левая часть — текст */}
        <div className="featured-info">
          <div className="featured-label">
            <span className="featured-crown">👑</span>
            Альбом марта
          </div>
          <h2 className="featured-title">{album.title}</h2>
          <p className="featured-artist">{album.artistName}</p>
          <div className="featured-meta">
            <span>📅 {album.year}</span>
            <span>🎵 {album.genre}</span>
            <span>⭐ {avgRating}</span>
            {album.plays > 0 && <span>▶ {album.plays.toLocaleString()} прослушиваний</span>}
          </div>
          <p className="featured-desc">{album.description?.slice(0, 130)}...</p>
          <div className="featured-btns">
            <Link to={`/albums/${album._id}`} className="btn btn-primary btn-lg">
              Открыть альбом →
            </Link>
            <button
              className="btn btn-outline btn-lg"
              onClick={() => playAlbum(album.tracks, album._id)}
            >
              ▶ Слушать
            </button>
          </div>
        </div>

        {/* Правая часть — обложка */}
        <Link to={`/albums/${album._id}`} className="featured-cover-link">
          <img src={album.cover} alt={album.title} className="featured-cover" />
        </Link>
      </div>
    </div>
  );
}
