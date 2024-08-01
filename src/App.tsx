import React, { useEffect, useState } from 'react';
import { loadCSVData, Song } from './utils/dataLoader';
import { calculateSimilarityMatrix } from './utils/similarity';
import CanvasGraph from './components/CanvasGraph';
import styles from './App.module.css';

const App: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [similarityMatrix, setSimilarityMatrix] = useState<number[][]>([]);

  useEffect(() => {
    async function fetchData() {
      const data = await loadCSVData('/data/spotify_2023_2.csv');
      setSongs(data);
      const matrix = calculateSimilarityMatrix(data);
      setSimilarityMatrix(matrix);
    }

    fetchData();
  }, []);

  return (
    <div className={styles.app}>
      <h1 className={styles.title}>Spotify</h1>
      {similarityMatrix.length > 0 && songs.length > 0 && (
        <CanvasGraph similarityMatrix={similarityMatrix} songs={songs} />
      )}
    </div>
  );
};

export default App;
