import { useState, useEffect } from 'react';
import { calculateSimilarityMatrix } from '../utils/similarity';
import { Song } from '../utils/dataLoader';

export function useSimilarityMatrix(songs: Song[]) {
  const [similarityMatrix, setSimilarityMatrix] = useState<number[][]>([]);

  useEffect(() => {
    if (songs.length > 0) {
      const matrix = calculateSimilarityMatrix(songs);
      setSimilarityMatrix(matrix);
    }
  }, [songs]);

  return similarityMatrix;
}
