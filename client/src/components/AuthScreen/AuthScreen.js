import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { React, useContext, useEffect, useState } from 'react';
import { Button, Paper, Tab, Tabs, TextField } from '@mui/material';
import { Box } from '@mui/system';

import { auth } from '../../firebase/firebaseService';
import { UserContext } from '../../contexts';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/images/BEETBOX_LOGO.png';
import DarkModeButton from '../DarkModeButton/DarkModeButton';
import classes from './authScreen.module.css';

const AuthScreen = () => {

  const navigate = useNavigate();

  const [tabIndex, setTabIndex] = useState(0);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPass, setRegisterPass] = useState('');

  const { setUser } = useContext(UserContext);

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
    signInWithEmailAndPassword(auth, loginEmail, loginPass)
      .catch((error) => {
        console.error('LOGIN FAILED: ' + error);
      });
    // TODO Actually display an error to user
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
      <DarkModeButton/>

      <div className={classes.authContainer}>
        <img
          src={logo}
          alt=''
          height={250}
          style={{
            marginBottom: 20,
          }}
        />
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
            <div className={classes.authFormContainer}>
              <form autoComplete='off' onSubmit={handleLoginSubmit} className={classes.authForm}>
                <TextField
                  onChange={handleInputChange}
                  value={loginEmail}
                  name='loginEmail'
                  label='Email'
                  variant='outlined'
                />
                <TextField
                  onChange={handleInputChange}
                  value={loginPass}
                  name='loginPass'
                  label='Password'
                  variant='outlined'
                  type='password'
                />

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
            <div className={classes.authFormContainer}>
              <form autoComplete='off'
                onSubmit={handleRegisterSubmit}
                className={classes.authForm}
              >
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
};

export default AuthScreen;