import React, { useRef, useEffect, useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import styles from './CanvasGraph.module.css';
import { Song } from '../utils/dataLoader';

interface CanvasGraphProps {
  similarityMatrix: number[][];
  songs: Song[];
}

const CanvasGraph: React.FC<CanvasGraphProps> = ({ similarityMatrix, songs }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredSong, setHoveredSong] = useState<Song | null>(null);
  let animationFrameId: number;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const positions = songs.map((_, i) => ({
          x: canvas.width / 2 + Math.cos((2 * Math.PI * i) / songs.length) * 200,
          y: canvas.height / 2 + Math.sin((2 * Math.PI * i) / songs.length) * 200,
        }));

        const render = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          similarityMatrix.forEach((row, i) => {
            row.forEach((similarity, j) => {
              if (i !== j && similarity > 0.3) {
                ctx.beginPath();
                ctx.moveTo(positions[i].x, positions[i].y);
                ctx.lineTo(positions[j].x, positions[j].y);
                ctx.strokeStyle = `rgba(0, 0, 0, ${similarity})`;
                ctx.lineWidth = 1;
                ctx.stroke();
              }
            });
          });

          songs.forEach((song, i) => {
            const size = Math.log1p(song.streams) / 5;
            const x = positions[i].x;
            const y = positions[i].y;

            ctx.beginPath();
            ctx.arc(x, y, size, 0, 2 * Math.PI);
            ctx.fillStyle = hoveredSong?.id === song.id ? 'red' : 'blue';
            ctx.fill();
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 1;
            ctx.stroke();

            ctx.fillStyle = 'white'; 
            ctx.font = '14px Arial';
            ctx.textAlign = 'center'; 
            ctx.textBaseline = 'middle'; 
            ctx.strokeStyle = 'black'; 
            ctx.lineWidth = 2; 
            ctx.strokeText(song.track_name, x, y - size - 15); 
            ctx.fillText(song.track_name, x, y - size - 15);
          });

          // eslint-disable-next-line react-hooks/exhaustive-deps
          animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => cancelAnimationFrame(animationFrameId);
      }
    }
  }, [similarityMatrix, songs, hoveredSong]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const handleMouseMove = (e: MouseEvent) => {
        if (canvas) {
          const rect = canvas.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;

          let found = false;
          for (let i = 0; i < songs.length; i++) {
            const size = Math.log1p(songs[i].streams) / 5;
            const pos = { x: canvas.width / 2 + Math.cos((2 * Math.PI * i) / songs.length) * 200, y: canvas.height / 2 + Math.sin((2 * Math.PI * i) / songs.length) * 200 };

            if (Math.sqrt((mouseX - pos.x) ** 2 + (mouseY - pos.y) ** 2) < size) {
              setHoveredSong(songs[i]);
              found = true;
              break;
            }
          }

          if (!found) setHoveredSong(null);
        }
      };

      canvas.addEventListener('mousemove', handleMouseMove);
      return () => canvas.removeEventListener('mousemove', handleMouseMove);
    }
  }, [songs]);

  return (
    <div className={styles.container}>
      <TransformWrapper>
        <TransformComponent>
          <canvas className={styles.canvas} ref={canvasRef} width={1500} height={800}></canvas>
        </TransformComponent>
      </TransformWrapper>
      {hoveredSong && (
        <div className={styles.tooltip}>
          <strong>{hoveredSong.track_name}</strong>
          <div>Artist: {hoveredSong.artist}</div>
          <div>Streams: {hoveredSong.streams.toLocaleString()}</div>
          <div>BPM: {hoveredSong.bpm}</div>
          <div>Energy: {hoveredSong.energy}</div>
        </div>
      )}
    </div>
  );
};

export default CanvasGraph;
