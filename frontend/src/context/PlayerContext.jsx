import { createContext, useContext, useState, useRef, useEffect } from 'react';
import { incrementTrackPlays, incrementAlbumPlays } from '../api';

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [queue, setQueue] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);

  const audioRef = useRef(new Audio());
  const countedRef = useRef(null);

  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;

    const onTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => {
      setIsPlaying(false);
      nextTrack();
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
    };
  }, [queue]);

  const play = (track, albumId) => {
    const audio = audioRef.current;

    if (track.audioFile) {
      audio.src = track.audioFile;
      audio.play().catch(() => {});
      setIsPlaying(true);
    } else {
      // Нет mp3 — симулируем воспроизведение
      audio.src = '';
      setIsPlaying(true);
    }

    setCurrentTrack(track);

    // Увеличиваем счётчик прослушиваний трека
    if (track._id && track._id !== countedRef.current && albumId) {
      countedRef.current = track._id;
      incrementTrackPlays(albumId, track._id).catch(() => {});
    }
  };

  const playAlbum = (tracks, albumId) => {
    if (!tracks || tracks.length === 0) return;
    setQueue(tracks.map((t) => ({ ...t, albumId })));
    play(tracks[0], albumId);

    // Считаем прослушивание альбома
    if (albumId) {
      incrementAlbumPlays(albumId).catch(() => {});
    }
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!currentTrack) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      if (audio.src) {
        audio.play().catch(() => {});
      }
      setIsPlaying(true);
    }
  };

  const nextTrack = () => {
    if (queue.length === 0) return;
    const idx = queue.findIndex((t) => t._id === currentTrack?._id);
    const next = queue[idx + 1];
    if (next) play(next, next.albumId);
  };

  const prevTrack = () => {
    if (queue.length === 0) return;
    const idx = queue.findIndex((t) => t._id === currentTrack?._id);
    const prev = queue[idx - 1];
    if (prev) play(prev, prev.albumId);
  };

  const seek = (percent) => {
    const audio = audioRef.current;
    if (audio.duration) {
      audio.currentTime = (percent / 100) * audio.duration;
    }
    setProgress(percent);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        progress,
        duration,
        volume,
        queue,
        play,
        playAlbum,
        togglePlay,
        nextTrack,
        prevTrack,
        seek,
        setVolume,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  return useContext(PlayerContext);
}
