import React, { useRef, useEffect } from 'react';
import { Song } from '../utils/dataLoader';
import { GraphCanvasProps } from '../utils/type';

const GraphCanvas: React.FC<GraphCanvasProps> = ({
  similarityMatrix,
  songs,
  hoveredSong,
  activeSong,
  onMouseMove,
  onClick,
  canvasRef,
  positionsRef,
}) => {
  const animationFrameIdRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const updateCanvasSize = () => {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
        };

        updateCanvasSize();
        window.addEventListener('resize', updateCanvasSize);

        const initPositions = () => {
          if (!positionsRef.current || positionsRef.current.length === 0) {
            const newPositions = songs.map(() => ({
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
            }));

            if (positionsRef.current) {
              positionsRef.current.length = 0;
              positionsRef.current.push(...newPositions);
            }
          }
        };

        initPositions();

        const render = () => {
          if (!ctx || !positionsRef.current) return;
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          similarityMatrix.forEach((row, i) => {
            row.forEach((similarity, j) => {
              if (i !== j && similarity > 0.3) {
                const posI = positionsRef.current
                  ? positionsRef.current[i]
                  : null;
                const posJ = positionsRef.current
                  ? positionsRef.current[j]
                  : null;
                if (posI && posJ) {
                  ctx.beginPath();
                  ctx.moveTo(posI.x, posI.y);
                  ctx.lineTo(posJ.x, posJ.y);
                  ctx.strokeStyle =
                    activeSong &&
                    (activeSong.id === songs[i].id ||
                      activeSong.id === songs[j].id)
                      ? `rgba(255, 0, 0, ${Math.min(similarity * 1.5, 1)})`
                      : `rgba(0, 0, 0, ${Math.min(similarity * 1.5, 1)})`;
                  ctx.lineWidth = 1;
                  ctx.stroke();
                }
              }
            });
          });

          songs.forEach((song, i) => {
            const size = Math.log1p(song.streams) / 5;
            const pos = positionsRef.current ? positionsRef.current[i] : null;
            if (pos) {
              const x = pos.x;
              const y = pos.y;

              ctx.beginPath();
              ctx.arc(x, y, size, 0, 2 * Math.PI);
              ctx.fillStyle =
                hoveredSong?.id === song.id
                  ? 'rgba(255, 0, 0, 0.7)'
                  : 'rgba(0, 0, 255, 0.7)';
              ctx.fill();
              ctx.strokeStyle = 'black';
              ctx.lineWidth = 1;
              ctx.stroke();

              if (hoveredSong?.id === song.id) {
                ctx.fillStyle = 'black';
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 0.5;
                const textX = x;
                const textY = y - size - 15;
                ctx.strokeText(song.track_name, textX, textY);
                ctx.fillText(song.track_name, textX, textY);
              }
            }
          });

          animationFrameIdRef.current = requestAnimationFrame(render);
        };

        render();

        return () => {
          cancelAnimationFrame(animationFrameIdRef.current);
          window.removeEventListener('resize', updateCanvasSize);
        };
      }
    }
  }, [
    similarityMatrix,
    songs,
    hoveredSong,
    activeSong,
    canvasRef,
    positionsRef,
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const handleMouseMove = (e: MouseEvent) => {
        if (onMouseMove) {
          onMouseMove(e);
        }
      };

      const handleClick = (e: MouseEvent) => {
        if (canvas && onClick) {
          const rect = canvas.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;

          let clickedSong: Song | null = null;
          for (let i = 0; i < songs.length; i++) {
            const size = Math.log1p(songs[i].streams) / 5;
            const pos = positionsRef.current ? positionsRef.current[i] : null;

            if (
              pos &&
              Math.sqrt((mouseX - pos.x) ** 2 + (mouseY - pos.y) ** 2) < size
            ) {
              clickedSong = songs[i];
              break;
            }
          }

          onClick(clickedSong);
        }
      };

      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('click', handleClick);

      return () => {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('click', handleClick);
      };
    }
  }, [onMouseMove, onClick, songs, canvasRef, positionsRef]);

  return <canvas ref={canvasRef}></canvas>;
};

export default GraphCanvas;
