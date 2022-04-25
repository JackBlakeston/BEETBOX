import { createContext } from 'react';

export const DarkModeContext = createContext({
  useDarkMode: true,
  setUseDarkMode: () => {}
});

export const UserContext = createContext({
  user: null,
  setUser: () => {}
});

export const LoopContext = createContext({
  loop: null,
  setLoop: () => {}
});

export const DbRefsContext = createContext({
  dbRefs: null,
  setDbRefs: () => {}
});

export const PlaybackContext = createContext({
  pos: null,
  setPos: () => {},
  isPlaying: null,
  togglePlaying: () => {}
});