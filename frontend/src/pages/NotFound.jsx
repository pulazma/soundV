import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="page" style={{ textAlign: 'center', paddingTop: '5rem' }}>
      <div style={{ fontSize: '5rem' }}>🎵</div>
      <h1 style={{ fontSize: '2rem', margin: '1rem 0' }}>404 — Страница не найдена</h1>
      <p style={{ color: 'var(--text2)', marginBottom: '2rem' }}>
        Кажется, эта страница улетела вместе с плейлистом
      </p>
      <Link to="/" className="btn btn-primary btn-lg">На главную</Link>
    </div>
  );
}
