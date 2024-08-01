import Papa from 'papaparse';

export type Song = {
  id: string;
  track_name: string;
  artist: string;
  streams: number;
  bpm: number;
  key: string;
  mode: string;
  danceability: number;
  valence: number;
  energy: number;
  acousticness: number;
  instrumentalness: number;
  liveness: number;
  speechiness: number;
};

export async function loadCSVData(filePath: string): Promise<Song[]> {
  const response = await fetch(filePath);
  const csv = await response.text();
  const { data } = Papa.parse<Song>(csv, { header: true });
  return data;
}
