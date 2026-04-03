import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMe } from '../api';
import AlbumCard from '../components/AlbumCard';

export default function Profile() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe()
      .then(setProfile)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page loading-page"><div className="spinner" /></div>;

  const favorites = profile?.favorites || [];

  return (
    <div className="page profile-page">
      <div className="profile-hero">
        <div className="profile-avatar">
          {user?.username?.[0]?.toUpperCase()}
        </div>
        <div className="profile-info">
          <h1>{user.username}</h1>
          <p className="profile-email">{user.email}</p>
          <span className={`role-badge ${user.role === 'admin' ? 'role-admin' : 'role-user'}`}>
            {user.role === 'admin' ? '👑 Администратор' : '👤 Пользователь'}
          </span>
          <p className="profile-since">
            На сайте с {new Date(user.createdAt || Date.now()).toLocaleDateString('ru-RU')}
          </p>
        </div>
        <button className="btn btn-danger" onClick={logout}>Выйти</button>
      </div>

      <section className="section">
        <div className="section-header">
          <h2>Избранные альбомы ({favorites.length})</h2>
        </div>
        {favorites.length === 0 ? (
          <p className="empty-msg">
            Вы ещё не добавили альбомы в избранное.{' '}
            <Link to="/albums">Перейти к каталогу →</Link>
          </p>
        ) : (
          <div className="albums-grid">
            {favorites.map((album) => (
              <AlbumCard key={album._id} album={album} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
