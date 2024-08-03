import React from 'react';
import { useData } from './hooks/useData';
import { useSimilarityMatrix } from './hooks/useSimilarityMatrix';
import CanvasGraph from './components/CanvasGraph';
import styles from './App.module.css';

const App: React.FC = () => {
  const { songs, loading, error } = useData('/data/spotify_2023_2.csv');
  const similarityMatrix = useSimilarityMatrix(songs);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

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
