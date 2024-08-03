import { Song } from './dataLoader';

function getSongFeatures(song: Song): number[] {
  return [
    song.bpm,
    song.danceability,
    song.energy,
    song.valence,
    song.acousticness,
    song.instrumentalness,
    song.liveness,
    song.speechiness,
  ];
}

export function calculateSimilarity(song1: Song, song2: Song): number {
  const features1 = getSongFeatures(song1);
  const features2 = getSongFeatures(song2);

  const dotProduct = features1.reduce((sum, f, i) => sum + f * features2[i], 0);
  const magnitude1 = Math.sqrt(features1.reduce((sum, f) => sum + f ** 2, 0));
  const magnitude2 = Math.sqrt(features2.reduce((sum, f) => sum + f ** 2, 0));

  return dotProduct / (magnitude1 * magnitude2);
}

export function calculateSimilarityMatrix(songs: Song[]): number[][] {
  return songs.map((songA) =>
    songs.map((songB) => calculateSimilarity(songA, songB))
  );
}
