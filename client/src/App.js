import React, { useState } from "react";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { purple } from '@mui/material/colors';
import { CssBaseline } from '@mui/material'

import AuthScreen from "./components/AuthScreen";
import Dashboard from "./components/Dashboard";
import Sequencer from "./components/Sequencer";
import { DarkModeContext, LoopContext, UserContext } from "./contexts";
import { onValue } from "firebase/database";

export function App () {

  const params = useParams();

  const [useDarkMode, setUseDarkMode] = useState(true);
  const darkModeValues = { useDarkMode, setUseDarkMode };

  const [user, setUser] = useState(null);
  const userValues = { user, setUser };

  const [loop, setLoop] = useState(null);
  const loopValues = { loop, setLoop };

  // ?? Is possible to move to other file - don't know how
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
    },
  });

  return (
    <>
      <UserContext.Provider value={userValues}>
      <DarkModeContext.Provider value={darkModeValues}>
      <LoopContext.Provider value={loopValues}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<AuthScreen/>} />
              <Route path="/dashboard" element={<Dashboard/>} />
              <Route path="/sequencer" element={<Sequencer/>} />
              <Route path="/sequencer/:loopid" element={<Sequencer/>} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </LoopContext.Provider>
      </DarkModeContext.Provider>
      </UserContext.Provider>
    </>
  )
}