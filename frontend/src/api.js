const BASE = '/api';

const getToken = () => {
  const token = localStorage.getItem('token');
  return token;
};

const request = async (url, options = {}) => {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json' };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  const res = await fetch(BASE + url, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || `Ошибка ${res.status}`);
  }
  return data;
};

export const registerUser = (body) =>
  request('/users/register', { method: 'POST', body: JSON.stringify(body) });

export const loginUser = (body) =>
  request('/users/login', { method: 'POST', body: JSON.stringify(body) });

export const getMe = () => request('/users/me');

export const toggleFavorite = (albumId) =>
  request(`/users/favorites/${albumId}`, { method: 'PUT' });

export const getAlbums = (params = {}) => {
  const q = new URLSearchParams(params).toString();
  return request('/albums' + (q ? '?' + q : ''));
};

export const getAlbumById = (id) => request(`/albums/${id}`);

export const createAlbum = (body) =>
  request('/albums', { method: 'POST', body: JSON.stringify(body) });

export const updateAlbum = (id, body) =>
  request(`/albums/${id}`, { method: 'PUT', body: JSON.stringify(body) });

export const deleteAlbum = (id) =>
  request(`/albums/${id}`, { method: 'DELETE' });

export const addReview = (albumId, body) =>
  request(`/albums/${albumId}/reviews`, { method: 'POST', body: JSON.stringify(body) });

export const deleteReview = (albumId, reviewId) =>
  request(`/albums/${albumId}/reviews/${reviewId}`, { method: 'DELETE' });

export const incrementAlbumPlays = (albumId) =>
  request(`/albums/${albumId}/play`, { method: 'POST' });

export const incrementTrackPlays = (albumId, trackId) =>
  request(`/albums/${albumId}/tracks/${trackId}/play`, { method: 'POST' });

export const getArtists = () => request('/artists');
export const getArtistById = (id) => request(`/artists/${id}`);
export const createArtist = (body) =>
  request('/artists', { method: 'POST', body: JSON.stringify(body) });
export const updateArtist = (id, body) =>
  request(`/artists/${id}`, { method: 'PUT', body: JSON.stringify(body) });
export const deleteArtist = (id) =>
  request(`/artists/${id}`, { method: 'DELETE' });

export const getFeaturedAlbum = () => request('/config/featured');
export const setFeaturedAlbum = (albumId) =>
  request('/config/featured', { method: 'PUT', body: JSON.stringify({ albumId }) });
