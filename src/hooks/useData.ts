import { useState, useEffect } from 'react';
import { loadCSVData, Song } from '../utils/dataLoader';

export function useData(url: string) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await loadCSVData(url);
        setSongs(data);
      } catch (err) {
        setError('Error loading data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [url]);

  return { songs, loading, error };
}
