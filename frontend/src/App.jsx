import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PlayerProvider } from './context/PlayerContext';
import MainLayout from './layouts/MainLayout';
import PrivateRoute from './components/PrivateRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Albums from './pages/Albums';
import AlbumDetail from './pages/AlbumDetail';
import Artists from './pages/Artists';
import AdminPanel from './pages/AdminPanel';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <AuthProvider>
      <PlayerProvider>
        <Router>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="albums" element={<Albums />} />
              <Route path="albums/:id" element={<AlbumDetail />} />
              <Route path="artists" element={<Artists />} />
              <Route
                path="profile"
                element={<PrivateRoute><Profile /></PrivateRoute>}
              />
              <Route
                path="admin"
                element={<PrivateRoute><AdminPanel /></PrivateRoute>}
              />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Router>
      </PlayerProvider>
    </AuthProvider>
  );
}
