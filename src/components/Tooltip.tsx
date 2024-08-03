import styles from './CanvasGraph.module.css';
import { Song } from '../utils/dataLoader';

interface TooltipProps {
  song: Song;
  position: { x: number; y: number };
}

const Tooltip: React.FC<TooltipProps> = ({ song, position }) => {
  return (
    <div
      className={`${styles.tooltip} ${styles.show}`}
      style={{
        left: position.x + 'px',
        top: position.y + 'px',
        position: 'absolute',
      }}
    >
      <strong>{song.track_name}</strong>
      <div>Artist: {song['artist(s)_name']}</div>
      <div>Streams: {song.streams.toLocaleString()}</div>
      <div>BPM: {song.bpm}</div>
    </div>
  );
};

export default Tooltip;
