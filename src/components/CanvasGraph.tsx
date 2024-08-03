import React, { useState, useCallback, useRef } from 'react';
import GraphCanvas from './GraphCanvas';
import Tooltip from './Tooltip';
import { Song } from '../utils/dataLoader';
import styles from './CanvasGraph.module.css';
import { CanvasGraphProps } from '../utils/type';

const CanvasGraph: React.FC<CanvasGraphProps> = ({
  similarityMatrix,
  songs,
}) => {
  const [hoveredSong, setHoveredSong] = useState<Song | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [activeSong, setActiveSong] = useState<Song | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const positionsRef = useRef<{ x: number; y: number }[]>([]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        let found = false;
        for (let i = 0; i < songs.length; i++) {
          const size = Math.log1p(songs[i].streams) / 5;
          const pos = positionsRef.current[i];

          if (
            pos &&
            Math.sqrt((mouseX - pos.x) ** 2 + (mouseY - pos.y) ** 2) < size
          ) {
            setHoveredSong(songs[i]);
            setTooltipPosition({ x: mouseX, y: mouseY });
            found = true;
            break;
          }
        }

        if (!found) {
          setHoveredSong(null);
          setTooltipPosition(null);
        }
      }
    },
    [songs]
  );

  const handleNodeClick = useCallback((song: Song | null) => {
    setActiveSong(song);
  }, []);

  return (
    <div className={styles.container}>
      <GraphCanvas
        similarityMatrix={similarityMatrix}
        songs={songs}
        hoveredSong={hoveredSong}
        activeSong={activeSong}
        onMouseMove={handleMouseMove}
        onClick={handleNodeClick}
        canvasRef={canvasRef}
        positionsRef={positionsRef}
      />
      {hoveredSong && tooltipPosition && (
        <Tooltip song={hoveredSong} position={tooltipPosition} />
      )}
    </div>
  );
};

export default CanvasGraph;
