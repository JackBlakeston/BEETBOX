import { Button } from '@mui/material';
import React, { useContext } from 'react';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';

import { DarkModeContext, UserContext } from '../../../contexts';
import { auth } from '../../../firebase/firebaseService';
import classes from './returnButton.module.css';
import { returnButtonSx, root } from './constants';

const ReturnButton = ({ isInSequencer }) => {

  const navigate = useNavigate();

  const { useDarkMode } = useContext(DarkModeContext);
  const { user } = useContext(UserContext);

  function handleLogoutClick () {
    signOut(auth).then(() => {
      navigate(root);
    });
  }

  function handleDashboardClick () {
    navigate(user ? `/${user.uid}` : root);
  }

  const returnButtonClassNames = classNames({
    [classes.returnButton]: true,
    [classes.returnButtonDark]: useDarkMode,
  });

  const buttonText = isInSequencer ? (user ? 'DASHBOARD' : 'LOG IN') : 'LOG OUT';

  return (
    <Button
      onClick={ isInSequencer ? handleDashboardClick : handleLogoutClick }
      variant='contained'
      size='small'
      sx={returnButtonSx}
      className={returnButtonClassNames}
    >
      { buttonText }
    </Button>
  );
};

export default ReturnButton;