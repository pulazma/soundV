import { usePlayer } from '../context/PlayerContext';

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function MusicPlayer() {
  const {
    currentTrack,
    isPlaying,
    progress,
    duration,
    volume,
    togglePlay,
    nextTrack,
    prevTrack,
    seek,
    setVolume,
  } = usePlayer();

  if (!currentTrack) return null;

  const handleSeek = (e) => {
    seek(Number(e.target.value));
  };

  const handleVolume = (e) => {
    setVolume(Number(e.target.value));
  };

  const currentTime = duration ? (progress / 100) * duration : 0;

  return (
    <div className="music-player">
      <div className="player-track">
        <span className="player-note">{isPlaying ? '🎵' : '🎶'}</span>
        <div className="player-info">
          <div className="player-title">{currentTrack.title}</div>
          <div className="player-sub">
            {currentTrack.audioFile ? 'Воспроизводится' : 'Нет файла (добавьте mp3)'}
          </div>
        </div>
      </div>

      <div className="player-center">
        <div className="player-controls">
          <button className="ctrl-btn" onClick={prevTrack} title="Предыдущий">⏮</button>
          <button className="ctrl-btn play-btn" onClick={togglePlay}>
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button className="ctrl-btn" onClick={nextTrack} title="Следующий">⏭</button>
        </div>

        <div className="player-progress-row">
          <span className="player-time">{formatTime(currentTime)}</span>
          <input
            className="progress-slider"
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleSeek}
          />
          <span className="player-time">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="player-volume">
        <span>🔉</span>
        <input
          className="volume-slider"
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={handleVolume}
        />
      </div>
    </div>
  );
}
