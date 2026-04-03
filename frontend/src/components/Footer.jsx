import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="footer-logo">♪ SoundVault</span>
          <p className="footer-tagline">Музыка. Рецензии. Культура.</p>
        </div>
        <div className="footer-links">
          <Link to="/">Главная</Link>
          <Link to="/albums">Альбомы</Link>
          <Link to="/artists">Исполнители</Link>
        </div>
        <p className="footer-copy">© {year} SoundVault. Все права защищены.</p>
      </div>
    </footer>
  );
}
