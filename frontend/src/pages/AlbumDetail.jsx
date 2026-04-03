import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getAlbumById, addReview, deleteReview } from '../api';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';
import StarRating from '../components/StarRating';

export default function AlbumDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, toggleFav } = useAuth();
  const { play, playAlbum, currentTrack, isPlaying, togglePlay } = usePlayer();

  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState('');

  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewError, setReviewError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [favLoading, setFavLoading] = useState(false);
  const [favMsg, setFavMsg] = useState('');

  const loadAlbum = () => {
    getAlbumById(id)
      .then(setAlbum)
      .catch(() => setPageError('Альбом не найден'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setPageError('');
    loadAlbum();
  }, [id]);

  if (loading) return <div className="page loading-page"><div className="spinner" /></div>;
  if (pageError || !album) return (
    <div className="page">
      <h2>Альбом не найден</h2>
      <Link to="/albums">← Назад к альбомам</Link>
    </div>
  );

  // Проверяем избранное — сравниваем строки ID
  const isFav = Array.isArray(user?.favorites) && user.favorites.some(
    (f) => String(f._id || f) === String(album._id)
  );

  const handleToggleFav = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Проверяем токен прямо здесь
    const token = localStorage.getItem('token');
    if (!token) {
      setFavMsg('⚠️ Сессия устарела. Войдите заново.');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    if (favLoading) return;
    setFavLoading(true);
    setFavMsg('');
    try {
      await toggleFav(album._id);
      setFavMsg(isFav ? 'Убрано из избранного' : '♥ Добавлено в избранное');
      setTimeout(() => setFavMsg(''), 2500);
    } catch (err) {
      setFavMsg('Ошибка: ' + err.message);
    } finally {
      setFavLoading(false);
    }
  };

  const handlePlayTrack = (track) => {
    if (currentTrack?._id === track._id) {
      togglePlay();
    } else {
      play(track, album._id);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    if (!reviewText.trim() || reviewRating === 0) return;
    try {
      await addReview(album._id, { rating: reviewRating, text: reviewText });
      setReviewText('');
      setReviewRating(0);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      loadAlbum();
    } catch (err) {
      setReviewError(err.message);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Удалить рецензию?')) return;
    try {
      await deleteReview(album._id, reviewId);
      loadAlbum();
    } catch {
      alert('Ошибка при удалении');
    }
  };

  const avgRating = album.reviews?.length > 0
    ? (album.reviews.reduce((s, r) => s + r.rating, 0) / album.reviews.length).toFixed(1)
    : '—';

  const totalTrackPlays = album.tracks?.reduce((s, t) => s + (t.plays || 0), 0);

  return (
    <div className="page album-detail-page">
      {/* Шапка */}
      <div className="album-hero">
        <img src={album.cover} alt={album.title} className="album-hero-cover" />
        <div className="album-hero-info">
          <Link to="/albums" className="back-link">← Все альбомы</Link>
          <span className="genre-tag">{album.genre}</span>
          <h1>{album.title}</h1>
          <h2 className="album-artist-name">{album.artistName}</h2>
          <div className="album-stats">
            <span>📅 {album.year}</span>
            <span>🎵 {album.tracks?.length} треков</span>
            <span>⭐ {avgRating}</span>
            <span>▶ {(album.plays || 0).toLocaleString()} прослушиваний</span>
          </div>
          <p className="album-desc">{album.description}</p>

          <div className="album-actions">
            <button
              className="btn btn-primary"
              onClick={() => playAlbum(album.tracks, album._id)}
            >
              ▶ Слушать альбом
            </button>
            <button
              className={`btn ${isFav ? 'btn-fav-active' : 'btn-outline'}`}
              onClick={handleToggleFav}
              disabled={favLoading}
            >
              {favLoading ? '...' : isFav ? '♥ В избранном' : '♡ В избранное'}
            </button>
          </div>

          {/* Сообщение об избранном */}
          {favMsg && (
            <div className={`fav-msg ${favMsg.includes('Ошибка') || favMsg.includes('⚠️') ? 'fav-msg-err' : 'fav-msg-ok'}`}>
              {favMsg}
            </div>
          )}
        </div>
      </div>

      {/* Треклист */}
      <section className="section">
        <h3>Треклист</h3>
        <ol className="tracklist">
          {album.tracks?.map((track, i) => {
            const isActive = currentTrack?._id === track._id;
            return (
              <li
                key={track._id}
                className={`track-item ${isActive ? 'track-active' : ''}`}
                onClick={() => handlePlayTrack(track)}
              >
                <span className="track-num">{isActive && isPlaying ? '♪' : i + 1}</span>
                <span className="track-name">{track.title}</span>
                <span className="track-dur">{track.duration}</span>
                {track.plays > 0 && <span className="track-plays">▶ {track.plays.toLocaleString()}</span>}
                <span className="track-play-icon">{isActive && isPlaying ? '⏸' : '▶'}</span>
              </li>
            );
          })}
        </ol>
        {totalTrackPlays > 0 && (
          <p className="total-plays">Итого прослушиваний треков: {totalTrackPlays.toLocaleString()}</p>
        )}
      </section>

      {/* Рецензии */}
      <section className="section">
        <h3>Рецензии ({album.reviews?.length || 0})</h3>

        {user ? (
          <form onSubmit={handleReviewSubmit} className="review-form">
            <h4>Оставить рецензию</h4>
            {reviewError && <div className="error-banner">{reviewError}</div>}
            <div className="form-group">
              <label>Оценка (1–10)</label>
              <StarRating value={reviewRating} onChange={setReviewRating} />
            </div>
            <div className="form-group">
              <label>Текст рецензии</label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Расскажите о своих впечатлениях..."
                rows={4}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={reviewRating === 0}>
              Опубликовать
            </button>
            {submitted && <span className="success-msg">✓ Рецензия опубликована!</span>}
          </form>
        ) : (
          <p className="login-prompt">
            <Link to="/login">Войдите</Link>, чтобы оставить рецензию.
          </p>
        )}

        <div className="reviews-list">
          {album.reviews?.length === 0 && <p className="no-reviews">Пока нет рецензий. Будьте первым!</p>}
          {album.reviews?.map((review) => {
            const canDelete = user && (String(user._id) === String(review.user) || user.role === 'admin');
            return (
              <div key={review._id} className="review-card">
                <div className="review-header">
                  <strong>{review.username}</strong>
                  <div className="review-stars">
                    {'★'.repeat(Math.round(review.rating / 2))}
                    <span className="review-score">{review.rating}/10</span>
                  </div>
                  <span className="review-date">{new Date(review.createdAt).toLocaleDateString('ru-RU')}</span>
                  {canDelete && (
                    <button className="btn btn-sm btn-danger review-del" onClick={() => handleDeleteReview(review._id)}>
                      Удалить
                    </button>
                  )}
                </div>
                <p className="review-text">{review.text}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
