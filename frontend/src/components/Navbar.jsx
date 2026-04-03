import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const close = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-logo" onClick={close}>
        <span className="logo-icon">♪</span>
        <span className="logo-text">SoundVault</span>
      </NavLink>

      <button className="burger" onClick={() => setMenuOpen((p) => !p)}>
        <span /><span /><span />
      </button>

      <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <NavLink to="/" end onClick={close}>Главная</NavLink>
        <NavLink to="/albums" onClick={close}>Альбомы</NavLink>
        <NavLink to="/artists" onClick={close}>Исполнители</NavLink>

        {user ? (
          <>
            {user.role === 'admin' && (
              <NavLink to="/admin" className="nav-admin-link" onClick={close}>
                👑 Админ
              </NavLink>
            )}
            <NavLink to="/profile" className="user-badge" onClick={close}>
              👤 {user.username}
            </NavLink>
            <button className="btn-logout" onClick={handleLogout}>Выйти</button>
          </>
        ) : (
          <>
            <NavLink to="/login" onClick={close}>Войти</NavLink>
            <NavLink to="/register" className="btn-register" onClick={close}>
              Регистрация
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}
