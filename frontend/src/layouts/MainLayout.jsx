import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MusicPlayer from '../components/MusicPlayer';

export default function MainLayout() {
  return (
    <div className="app-wrapper">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
      <MusicPlayer />
    </div>
  );
}
