import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { React, useContext, useEffect, useState } from 'react';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { Button, IconButton, Paper, Tab, Tabs, TextField } from '@mui/material';
import { Box } from '@mui/system';

import { auth } from '../firebase/firebaseService';
import { DarkModeContext, UserContext } from '../contexts';
import { useNavigate } from 'react-router-dom';

function AuthScreen () {

  const navigate = useNavigate();

  const [tabIndex, setTabIndex] = useState(0);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPass, setRegisterPass] = useState('');

  const { setUser } = useContext(UserContext);
  const {useDarkMode, setUseDarkMode} = useContext(DarkModeContext);

  useEffect(() => {
    onAuthStateChanged(auth, (observedUser) => {
      if (observedUser) {
        navigate(`/${observedUser.uid}`);
      }
    });
  }, [setUser, navigate]);


  function handleTabChange (event, newTabIndex) {
    setTabIndex(newTabIndex);
  }

  function handleLoginSubmit (event) {
    event.preventDefault();
    // TODO Check validity ?? Does firebase do this maybe¿?¿

    // LOGIN with firebase
    signInWithEmailAndPassword(auth, loginEmail, loginPass)
      .catch((error) => {
        console.error('LOGIN FAILED: ' + error);
      });
  }

  function handleRegisterSubmit (event) {
    event.preventDefault();
    // TODO Check validity ?? Does firebase do this maybe¿?¿

    // REGISTER with firebase
    createUserWithEmailAndPassword(auth, registerEmail, registerPass)
      .catch((error) => {
        console.error('REGISTRATION FAILED: ' + error);
      });
  }

  function handleInputChange (event) {
    const inputName = event.target.name;
    const value = event.target.value;

    if (inputName === 'loginEmail') {
      setLoginEmail(value);
    }
    if (inputName === 'loginPass') {
      setLoginPass(value);
    }
    if (inputName === 'registerEmail') {
      setRegisterEmail(value);
    }
    // if (inputName === 'registerUsername') {
    //   setRegisterUsername(value);
    // }
    if (inputName === 'registerPass') {
      setRegisterPass(value);
    }
  }

  return (
    <>
      <IconButton
        aria-label="dark-mode"
        size="small"
        onClick={() => setUseDarkMode(!useDarkMode) }
        sx={{
          position: 'absolute',
          top: 13,
          right: 40
        }}
      >
        <DarkModeIcon/>
      </IconButton>

      <div className='auth-container'>
        <h1>BEETBOX</h1>
        <Paper
          sx={{
            height: 400,
            width: 500
          }}
        >
          <Box sx={{ borderBottom: 0.5, borderColor: 'divider' }}>
            <Tabs
              value={tabIndex}
              onChange={handleTabChange}
            >
              <Tab sx={{ width: 250 }} label="Login" />
              <Tab sx={{ width: 250 }} label="Register" />
            </Tabs>
          </Box>

          { tabIndex === 0 &&
            <div className='auth-form-container'>
              <form autoComplete='off' onSubmit={handleLoginSubmit} className='auth-form'>
                <TextField onChange={handleInputChange} value={loginEmail} name='loginEmail' label='Email' variant='outlined' />
                <TextField onChange={handleInputChange} value={loginPass} name='loginPass' label='Password' variant='outlined' type='password'/>

                <Button
                  variant='contained'
                  type='submit'
                  disabled={loginEmail.length < 3 || loginPass.length < 1} // TODO Add more conditions
                >
                  LOG IN
                </Button>
              </form>
            </div>
          }

          { tabIndex === 1 &&
            <div className='auth-form-container'>
              <form autoComplete='off' onSubmit={handleRegisterSubmit} className='auth-form'>
                <TextField onChange={handleInputChange} value={registerEmail} name='registerEmail' label='Email' variant='outlined' />
                {/* <TextField onChange={handleInputChange} value={registerUsername} name='registerUsername' label='Username' variant='outlined' /> */}
                <TextField onChange={handleInputChange} value={registerPass} name='registerPass' label='Password' variant='outlined' type='password'/>

                <Button
                  variant='contained'
                  type='submit'
                  disabled={registerEmail.length < 3 || registerPass.length < 1} // TODO Add more conditions OR check if firebase does
                >
                REGISTER
                </Button>
              </form>
            </div>
          }

        </Paper>
      </div>
    </>
  );
}


export default AuthScreen;