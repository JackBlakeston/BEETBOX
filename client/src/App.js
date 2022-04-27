import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { pink, yellow } from '@mui/material/colors';
import { CssBaseline } from '@mui/material';

import AuthScreen from './components/AuthScreen/AuthScreen';
import Dashboard from './components/Dashboard/Dashboard';
import Sequencer from './components/Sequencer/Sequencer';
import { DarkModeContext, DbRefsContext, LoopContext, UserContext } from './contexts';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/firebaseService';
import './App.css';

export function App () {

  const [useDarkMode, setUseDarkMode] = useState(true);
  const darkModeValues = { useDarkMode, setUseDarkMode };

  const [user, setUser] = useState(null);
  const userValues = { user, setUser };

  const [loop, setLoop] = useState(null);
  const loopValues = { loop, setLoop };

  const [dbRefs, setDbRefs] = useState(null);
  const dbRefsValues = { dbRefs, setDbRefs };

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
    root: {
      '&::-webkit-scrollbar': {
        width: 7,
      },
      '&::-webkit-scrollbar-track': {
        boxShadow: 'inset 0 0 6px rgba(0, 0, 0, 0.3)',
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'black',
        outline: '1px solid slategrey',
      },
    },
    palette: {
      mode: useDarkMode ? 'dark' : 'light',
      primary: {
        main: pink[600]
      },
      secondary: {
        main: yellow[500]
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
              WebkitBoxShadow: useDarkMode ? '0 0 0 100px rgb(76 5 38) inset;' : '0 0 0 100px rgb(250 220 233) inset',
              WebkitTextFillColor: useDarkMode && '#fff',
            },
          },
        },
      },
    },
  });

  return (
    <>
      <DbRefsContext.Provider value={dbRefsValues}>
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
      </DbRefsContext.Provider>
    </>
  );
}