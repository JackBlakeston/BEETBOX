import { createContext } from "react";

export const DarkModeContext = createContext({
  useDarkMode: true,
  setUseDarkMode: () => {}
});