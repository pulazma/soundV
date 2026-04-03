import { createContext, useContext, useState, useEffect } from 'react';
import { registerUser, loginUser, getMe, toggleFavorite as apiFavorite } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('users');

    const token = localStorage.getItem('token');
    if (token) {
      getMe()
        .then((data) => setUser(data))
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const register = async (username, email, password) => {
    const data = await registerUser({ username, email, password });
    localStorage.setItem('token', data.token);
    setUser(data);
    return data;
  };

  const login = async (email, password) => {
    const data = await loginUser({ email, password });
    localStorage.setItem('token', data.token);
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Переключение избранного
  // Токен берётся из localStorage внутри apiFavorite -> request -> getToken()
  const toggleFav = async (albumId) => {
    if (!user) throw new Error('Не авторизован');

    const token = localStorage.getItem('token');
    if (!token) throw new Error('Токен не найден. Войдите заново.');

    const data = await apiFavorite(albumId);
    setUser((prev) => ({ ...prev, favorites: data.favorites }));
    return data.favorites;
  };

  const refreshUser = async () => {
    try {
      const data = await getMe();
      setUser(data);
    } catch {
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, toggleFav, refreshUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
