import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { purple } from '@mui/material/colors';
import { CssBaseline } from '@mui/material';

import AuthScreen from './components/AuthScreen';
import Dashboard from './components/Dashboard';
import Sequencer from './components/Sequencer';
import { DarkModeContext, LoopContext, UserContext } from './contexts';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/firebaseService';

export function App () {

  const [useDarkMode, setUseDarkMode] = useState(true);
  const darkModeValues = { useDarkMode, setUseDarkMode };

  const [user, setUser] = useState(null);
  const userValues = { user, setUser };

  const [loop, setLoop] = useState(null);
  const loopValues = { loop, setLoop };

  useEffect(() => {
    onAuthStateChanged(auth, (observedUser) => {
      if (observedUser) {
        setUser(observedUser);
      } else {
        setUser(null);
      }
    });
  }, [setUser]);

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
    components: {
      MuiOutlinedInput: {
        styleOverrides: {
          input: {
            '&:-webkit-autofill': {
              WebkitBoxShadow: useDarkMode ? '0 0 0 100px #261c28 inset' : '0 0 0 100px rgb(252 238 255) inset',
              WebkitTextFillColor: useDarkMode && '#fff',
            },
          },
        },
      },
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
                  <Route path='/:uid' element={<Dashboard/>}/>
                  {/* <Route path="/sequencer" element={<Sequencer/>} /> */ }
                  <Route path="/:uid/sequencer/:loopid" element={<Sequencer/>} />
                </Routes>
              </BrowserRouter>
            </ThemeProvider>
          </LoopContext.Provider>
        </DarkModeContext.Provider>
      </UserContext.Provider>
    </>
  );
}