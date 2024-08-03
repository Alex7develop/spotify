import { Song } from './dataLoader';

export interface CanvasGraphProps {
  similarityMatrix: number[][];
  songs: Song[];
}

export interface GraphCanvasProps {
  similarityMatrix: number[][];
  songs: Song[];
  hoveredSong: Song | null;
  activeSong: Song | null;
  onMouseMove: (e: MouseEvent) => void;
  onClick: (song: Song | null) => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  positionsRef: React.RefObject<{ x: number; y: number }[]>;
}
