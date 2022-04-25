import { Button } from '@mui/material';
import React, { useContext } from 'react';
import { DarkModeContext, UserContext } from '../contexts';
import { auth } from '../firebase/firebaseService';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const ReturnButton = ({ isInSequencer }) => {

  const navigate = useNavigate();

  const { useDarkMode } = useContext(DarkModeContext);
  const { user } = useContext(UserContext);

  function handleLogoutClick () {
    signOut(auth).then(() => {
      navigate('/');
    });
  }

  function handleDashboardClick () {
    navigate(user ? `/${user.uid}` : '/');
  }

  const buttonStyle = {
    backgroundColor: useDarkMode ? 'rgb(60 60 60)' : 'rgb(101 101 101)',
    position: 'absolute',
    top: 15,
    right: 120,
    width: isInSequencer ? 125 : 100,
  };

  return (
    <Button
      onClick={ isInSequencer ? handleDashboardClick : handleLogoutClick }
      variant='contained'
      size='small'
      sx={buttonStyle}
    >
      {isInSequencer ? (user ? 'DASHBOARD' : 'LOG IN') : 'LOG OUT'}
    </Button>
  );
};

export default ReturnButton;