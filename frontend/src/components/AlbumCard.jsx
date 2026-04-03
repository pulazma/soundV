import { Link } from 'react-router-dom';

export default function AlbumCard({ album }) {
  const avgRating = album.avgRating || album.rating || '—';

  return (
    <Link to={`/albums/${album._id}`} className="album-card">
      <div className="album-card-cover-wrap">
        <img src={album.cover} alt={album.title} className="album-card-cover" />
        <div className="album-card-overlay">
          <span className="overlay-play">▶</span>
        </div>
      </div>
      <div className="album-card-body">
        <div className="album-card-title">{album.title}</div>
        <div className="album-card-artist">{album.artistName}</div>
        <div className="album-card-meta">
          <span className="album-card-year">{album.year}</span>
          <span className="album-card-rating">⭐ {avgRating}</span>
        </div>
        {album.plays > 0 && (
          <div className="album-card-plays">▶ {album.plays.toLocaleString()} прослушиваний</div>
        )}
        <span className="album-card-genre">{album.genre}</span>
      </div>
    </Link>
  );
}
