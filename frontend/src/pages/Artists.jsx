import { useState, useEffect } from 'react';
import { getArtists, getAlbums } from '../api';

export default function Artists() {
  const [artists, setArtists] = useState([]);
  const [albumsMap, setAlbumsMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getArtists(), getAlbums()])
      .then(([arts, albs]) => {
        setArtists(arts);
        // Считаем кол-во альбомов и прослушиваний каждого исполнителя
        const map = {};
        albs.forEach((a) => {
          const aid = a.artist;
          if (!map[aid]) map[aid] = { count: 0, plays: 0 };
          map[aid].count += 1;
          map[aid].plays += a.plays || 0;
        });
        setAlbumsMap(map);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page loading-page"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Исполнители</h1>
        <p>Все артисты в каталоге SoundVault</p>
      </div>

      <div className="artists-grid">
        {artists.map((artist) => {
          const stats = albumsMap[artist._id] || { count: 0, plays: 0 };
          return (
            <div key={artist._id} className="artist-card">
              <img src={artist.image} alt={artist.name} className="artist-card-img" />
              <div className="artist-card-body">
                <h3 className="artist-card-name">{artist.name}</h3>
                <span className="genre-tag">{artist.genre}</span>
                <p className="artist-card-bio">{artist.bio}</p>
                <div className="artist-card-meta">
                  <span>🌍 {artist.country}</span>
                  <span>📀 {stats.count} альб.</span>
                  {stats.plays > 0 && <span>▶ {stats.plays.toLocaleString()}</span>}
                  {artist.formedYear && <span>📅 с {artist.formedYear}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
