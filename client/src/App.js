import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { purple } from '@mui/material/colors';
import { CssBaseline } from '@mui/material'

import AuthScreen from "./components/AuthScreen";
import Dashboard from "./components/Dashboard";
import Sequencer from "./components/Sequencer";
import { DarkModeContext } from "./contexts";

export function App () {

  const [useDarkMode, setUseDarkMode] = useState(true);
  const darkMode = { useDarkMode, setUseDarkMode };

  // ?? Is possible to move to other file
  const theme = createTheme({
    palette: {
      mode: useDarkMode ? 'dark' : 'light',
      primary: {
        main: purple[600]
      },
      secondary: {
        main: purple[600]
      },
      background: {
        default: useDarkMode ? '#2D2D2D' : '#F1F1F1'
      }
    }
  });

  return (
    <>
      <DarkModeContext.Provider value={darkMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<AuthScreen/>} />
              <Route path="/dashboard" element={<Dashboard/>} />
              <Route path="/sequencer" element={<Sequencer/>} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </DarkModeContext.Provider>
    </>
  )
}