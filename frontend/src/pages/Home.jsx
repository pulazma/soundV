import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAlbums, getArtists, getFeaturedAlbum } from '../api';
import AlbumCard from '../components/AlbumCard';
import FeaturedBanner from '../components/FeaturedBanner';

export default function Home() {
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [featured, setFeatured] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getAlbums({ sort: 'plays' }),
      getArtists(),
      getFeaturedAlbum(),
    ])
      .then(([a, ar, feat]) => {
        setAlbums(a.slice(0, 6));
        setArtists(ar.slice(0, 4));
        setFeatured(feat);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page loading-page"><div className="spinner" /></div>;

  return (
    <div className="page home-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="hero-accent">Sound</span>Vault
          </h1>
          <p className="hero-subtitle">
            Слушай музыку, читай рецензии и делись мнением
          </p>
          <div className="hero-btns">
            <Link to="/albums" className="btn btn-primary btn-lg">Все альбомы</Link>
            <Link to="/register" className="btn btn-outline btn-lg">Присоединиться</Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="vinyl-disc">
            <div className="vinyl-inner" />
          </div>
        </div>
      </section>

      {/* Баннер "Альбом месяца" */}
      {featured && <FeaturedBanner album={featured} />}

      {/* Популярные альбомы */}
      <section className="section">
        <div className="section-header">
          <h2>Популярные альбомы</h2>
          <Link to="/albums" className="see-all">Все альбомы →</Link>
        </div>
        <div className="albums-grid">
          {albums.map((album) => (
            <AlbumCard key={album._id} album={album} />
          ))}
        </div>
      </section>

      {/* Исполнители */}
      <section className="section">
        <div className="section-header">
          <h2>Исполнители</h2>
          <Link to="/artists" className="see-all">Все исполнители →</Link>
        </div>
        <div className="artists-row">
          {artists.map((artist) => (
            <div key={artist._id} className="artist-chip">
              <img src={artist.image} alt={artist.name} className="artist-chip-img" />
              <div>
                <div className="artist-chip-name">{artist.name}</div>
                <div className="artist-chip-genre">{artist.genre}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
