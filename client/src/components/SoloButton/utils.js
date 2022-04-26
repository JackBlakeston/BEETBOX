export function checkIfSoloed (loop, track) {
  const isSoloed = !!loop.soloedTracks?.includes(track.id);
  return isSoloed;
}