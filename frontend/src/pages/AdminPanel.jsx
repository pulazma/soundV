import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getAlbums, createAlbum, updateAlbum, deleteAlbum,
  getArtists, createArtist, deleteArtist,
  getFeaturedAlbum, setFeaturedAlbum,
} from '../api';

function Tabs({ active, onChange }) {
  const tabs = [
    { id: 'albums',      label: '💿 Альбомы' },
    { id: 'add_album',   label: '➕ Добавить альбом' },
    { id: 'artists',     label: '🎤 Исполнители' },
    { id: 'add_artist',  label: '➕ Добавить исполнителя' },
    { id: 'featured',    label: '👑 Альбом месяца' },
  ];
  return (
    <div className="admin-tabs">
      {tabs.map((t) => (
        <button key={t.id} className={`admin-tab ${active === t.id ? 'active' : ''}`} onClick={() => onChange(t.id)}>
          {t.label}
        </button>
      ))}
    </div>
  );
}

function Alert({ type, msg }) {
  if (!msg) return null;
  return <div className={`admin-alert admin-alert-${type}`}>{msg}</div>;
}

const EMPTY_ALBUM = { title: '', artistName: '', year: '', genre: '', cover: '', description: '', tracksText: '' };

function AlbumForm({ initial, artists, onSave, onCancel }) {
  const [form, setForm] = useState(() => {
    if (initial) return {
      title: initial.title, artistName: initial.artistName,
      year: String(initial.year), genre: initial.genre,
      cover: initial.cover, description: initial.description,
      tracksText: (initial.tracks || []).map((t) => `${t.title} | ${t.duration}`).join('\n'),
    };
    return EMPTY_ALBUM;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (f, v) => setForm((p) => ({ ...p, [f]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title || !form.artistName || !form.year || !form.genre) { setError('Заполните обязательные поля'); return; }
    setLoading(true);
    try {
      const tracks = form.tracksText.split('\n').map((l) => l.trim()).filter(Boolean).map((l) => {
        const [title, duration] = l.split('|').map((s) => s.trim());
        return { title: title || l, duration: duration || '0:00', audioFile: '' };
      });
      const matchedArtist = artists.find((a) => a.name.toLowerCase() === form.artistName.toLowerCase());
      await onSave({ title: form.title, artistName: form.artistName, artist: matchedArtist?._id, year: Number(form.year), genre: form.genre, cover: form.cover, description: form.description, tracks });
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <Alert type="error" msg={error} />
      <div className="admin-form-grid">
        <div className="form-group"><label>Название *</label><input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Название альбома" /></div>
        <div className="form-group">
          <label>Исполнитель *</label>
          <input list="artists-list" value={form.artistName} onChange={(e) => set('artistName', e.target.value)} placeholder="Имя исполнителя" />
          <datalist id="artists-list">{artists.map((a) => <option key={a._id} value={a.name} />)}</datalist>
        </div>
        <div className="form-group"><label>Год *</label><input type="number" value={form.year} onChange={(e) => set('year', e.target.value)} placeholder="2024" /></div>
        <div className="form-group"><label>Жанр *</label><input value={form.genre} onChange={(e) => set('genre', e.target.value)} placeholder="Trap / Hip-Hop" /></div>
        <div className="form-group span2">
          <label>Обложка (путь или URL)</label>
          <input value={form.cover} onChange={(e) => set('cover', e.target.value)} placeholder="/covers/album.jpg" />
          {form.cover && <img src={form.cover} alt="preview" className="cover-preview" onError={(e) => e.target.style.display='none'} />}
        </div>
        <div className="form-group span2"><label>Описание</label><textarea rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Описание..." /></div>
        <div className="form-group span2">
          <label>Треки (формат: Название | 3:45)</label>
          <textarea rows={8} value={form.tracksText} onChange={(e) => set('tracksText', e.target.value)} placeholder={"Intro | 1:30\nТрек | 3:45"} className="tracks-textarea" />
          <span className="form-hint">Каждый трек с новой строки, разделитель |</span>
        </div>
      </div>
      <div className="admin-form-actions">
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Сохраняем...' : (initial ? '💾 Сохранить' : '✅ Создать альбом')}</button>
        {onCancel && <button type="button" className="btn btn-outline" onClick={onCancel}>Отмена</button>}
      </div>
    </form>
  );
}

// ── Список альбомов ────────────────────────────────────
function AlbumsList({ albums, artists, onRefresh }) {
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState('');

  const handleDelete = async (album) => {
    if (!window.confirm(`Удалить "${album.title}"?`)) return;
    try { await deleteAlbum(album._id); setMsg('Альбом удалён'); onRefresh(); }
    catch (err) { setMsg('Ошибка: ' + err.message); }
  };

  const handleSaveEdit = async (payload) => {
    await updateAlbum(editing._id, payload);
    setEditing(null); setMsg('Альбом обновлён ✓'); onRefresh();
  };

  return (
    <div>
      <Alert type="success" msg={msg} />
      {editing && (
        <div className="admin-edit-block">
          <h3>Редактировать: {editing.title}</h3>
          <AlbumForm initial={editing} artists={artists} onSave={handleSaveEdit} onCancel={() => setEditing(null)} />
        </div>
      )}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Обложка</th><th>Название</th><th>Исполнитель</th><th>Год</th><th>Треков</th><th>▶ Прослушиваний</th><th>Рецензий</th><th>Действия</th></tr></thead>
          <tbody>
            {albums.map((album) => (
              <tr key={album._id}>
                <td><img src={album.cover} alt="" className="admin-cover-thumb" /></td>
                <td className="admin-td-title">{album.title}</td>
                <td>{album.artistName}</td>
                <td>{album.year}</td>
                <td>{album.tracks?.length || 0}</td>
                <td>{album.plays?.toLocaleString() || 0}</td>
                <td>{album.reviews?.length || 0}</td>
                <td>
                  <div className="admin-row-actions">
                    <button className="btn btn-sm btn-outline" onClick={() => { setEditing(album); window.scrollTo(0,0); }}>✏️ Изм.</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(album)}>🗑️ Удал.</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Список исполнителей ────────────────────────────────
function ArtistsList({ artists, onRefresh }) {
  const [msg, setMsg] = useState('');
  const handleDelete = async (artist) => {
    if (!window.confirm(`Удалить "${artist.name}"?`)) return;
    try { await deleteArtist(artist._id); setMsg('Удалён'); onRefresh(); }
    catch (err) { setMsg('Ошибка: ' + err.message); }
  };
  return (
    <div>
      <Alert type="success" msg={msg} />
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Фото</th><th>Имя</th><th>Жанр</th><th>Страна</th><th>С года</th><th>Действия</th></tr></thead>
          <tbody>
            {artists.map((a) => (
              <tr key={a._id}>
                <td><img src={a.image} alt="" className="admin-cover-thumb" /></td>
                <td className="admin-td-title">{a.name}</td>
                <td>{a.genre}</td><td>{a.country}</td><td>{a.formedYear || '—'}</td>
                <td><button className="btn btn-sm btn-danger" onClick={() => handleDelete(a)}>🗑️ Удалить</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Форма исполнителя ──────────────────────────────────
const EMPTY_ARTIST = { name: '', genre: '', country: 'Россия', bio: '', image: '', formedYear: '' };

function ArtistForm({ onSave }) {
  const [form, setForm] = useState(EMPTY_ARTIST);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const set = (f, v) => setForm((p) => ({ ...p, [f]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setMsg('');
    if (!form.name || !form.genre) { setError('Имя и жанр обязательны'); return; }
    setLoading(true);
    try {
      await onSave({ ...form, formedYear: form.formedYear ? Number(form.formedYear) : undefined });
      setMsg('Исполнитель добавлен ✓'); setForm(EMPTY_ARTIST);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <Alert type="error" msg={error} /><Alert type="success" msg={msg} />
      <div className="admin-form-grid">
        <div className="form-group"><label>Имя *</label><input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Имя исполнителя" /></div>
        <div className="form-group"><label>Жанр *</label><input value={form.genre} onChange={(e) => set('genre', e.target.value)} /></div>
        <div className="form-group"><label>Страна</label><input value={form.country} onChange={(e) => set('country', e.target.value)} /></div>
        <div className="form-group"><label>Год основания</label><input type="number" value={form.formedYear} onChange={(e) => set('formedYear', e.target.value)} /></div>
        <div className="form-group span2">
          <label>Фото</label>
          <input value={form.image} onChange={(e) => set('image', e.target.value)} placeholder="/covers/artist.jpg" />
          {form.image && <img src={form.image} alt="preview" className="cover-preview" onError={(e) => e.target.style.display='none'} />}
        </div>
        <div className="form-group span2"><label>Биография</label><textarea rows={3} value={form.bio} onChange={(e) => set('bio', e.target.value)} /></div>
      </div>
      <div className="admin-form-actions"><button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Добавляем...' : '✅ Добавить'}</button></div>
    </form>
  );
}

// ── Альбом месяца ──────────────────────────────────────
function FeaturedTab({ albums }) {
  const [current, setCurrent] = useState(null);
  const [selected, setSelected] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getFeaturedAlbum().then((a) => {
      if (a) { setCurrent(a); setSelected(a._id); }
    });
  }, []);

  const handleSave = async () => {
    if (!selected) return;
    setLoading(true); setMsg('');
    try {
      await setFeaturedAlbum(selected);
      const album = albums.find((a) => a._id === selected);
      setCurrent(album);
      setMsg('Альбом месяца обновлён ✓');
    } catch (err) { setMsg('Ошибка: ' + err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="featured-tab">
      <h2 className="admin-section-title">👑 Альбом месяца</h2>
      <Alert type="success" msg={msg} />

      {current && (
        <div className="featured-current">
          <img src={current.cover} alt={current.title} className="featured-current-img" />
          <div>
            <p className="featured-current-label">Сейчас установлен:</p>
            <p className="featured-current-title">{current.title}</p>
            <p className="featured-current-artist">{current.artistName}</p>
            <Link to={`/albums/${current._id}`} className="btn btn-sm btn-outline" target="_blank">
              Открыть →
            </Link>
          </div>
        </div>
      )}

      <div className="admin-form" style={{ marginTop: '1.5rem', maxWidth: '520px' }}>
        <div className="form-group">
          <label>Выбрать новый альбом месяца</label>
          <select value={selected} onChange={(e) => setSelected(e.target.value)}>
            <option value="">— Выберите альбом —</option>
            {albums.map((a) => (
              <option key={a._id} value={a._id}>
                {a.title} — {a.artistName} ({a.year})
              </option>
            ))}
          </select>
        </div>
        <div className="admin-form-actions">
          <button className="btn btn-primary" onClick={handleSave} disabled={loading || !selected}>
            {loading ? 'Сохраняем...' : '💾 Установить'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Главная AdminPanel ─────────────────────────────────
export default function AdminPanel() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('albums');
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addMsg, setAddMsg] = useState('');

  useEffect(() => { if (user && user.role !== 'admin') navigate('/'); }, [user, navigate]);

  const loadData = () => {
    setLoading(true);
    Promise.all([getAlbums(), getArtists()])
      .then(([a, ar]) => { setAlbums(a); setArtists(ar); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  if (!user || user.role !== 'admin') return null;

  const handleAddAlbum = async (payload) => {
    await createAlbum(payload);
    setAddMsg('Альбом добавлен ✓'); setTab('albums'); loadData();
    setTimeout(() => setAddMsg(''), 4000);
  };

  const handleAddArtist = async (payload) => {
    await createArtist(payload); loadData();
  };

  return (
    <div className="page admin-page">
      <div className="admin-header">
        <div>
          <h1>👑 Панель администратора</h1>
          <p className="admin-sub">Управление контентом SoundVault</p>
        </div>
        <div className="admin-stats">
          <div className="admin-stat-card"><span className="admin-stat-num">{albums.length}</span><span className="admin-stat-label">Альбомов</span></div>
          <div className="admin-stat-card"><span className="admin-stat-num">{artists.length}</span><span className="admin-stat-label">Исполнителей</span></div>
          <div className="admin-stat-card">
            <span className="admin-stat-num">{albums.reduce((s, a) => s + (a.plays || 0), 0).toLocaleString()}</span>
            <span className="admin-stat-label">Прослушиваний</span>
          </div>
        </div>
      </div>

      {addMsg && <div className="admin-alert admin-alert-success">{addMsg}</div>}
      <Tabs active={tab} onChange={setTab} />

      {loading ? <div className="loading-page"><div className="spinner" /></div> : (
        <div className="admin-content">
          {tab === 'albums' && <AlbumsList albums={albums} artists={artists} onRefresh={loadData} />}
          {tab === 'add_album' && <div><h2 className="admin-section-title">Добавить новый альбом</h2><AlbumForm artists={artists} onSave={handleAddAlbum} /></div>}
          {tab === 'artists' && <ArtistsList artists={artists} onRefresh={loadData} />}
          {tab === 'add_artist' && <div><h2 className="admin-section-title">Добавить исполнителя</h2><ArtistForm onSave={handleAddArtist} /></div>}
          {tab === 'featured' && <FeaturedTab albums={albums} />}
        </div>
      )}
    </div>
  );
}
