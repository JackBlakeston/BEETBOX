import { newTrackTemplate } from './constants';

export function getButtonVariant (useDarkMode) {
  return useDarkMode ? 'contained' : 'outlined';
}

export function getNewTrack (trackCounter) {

  const newTrack = Object.assign({}, newTrackTemplate);
  const newTrackId = `Track${ (trackCounter + 1).toString().padStart(4, '0') }`;
  newTrack.id = newTrackId;

  return newTrack;
}