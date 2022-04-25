import { IconButton } from '@mui/material';
import React, { useContext } from 'react';
import DarkModeIcon from '@mui/icons-material/DarkMode';

import { DarkModeContext } from '../../contexts';
import { DarkModeButtonSx } from './constants';

const DarkModeButton = () => {

  const { useDarkMode, setUseDarkMode } = useContext(DarkModeContext);

  return (
    <IconButton
      onClick={() => setUseDarkMode(!useDarkMode) }
      sx={DarkModeButtonSx}
    >
      <DarkModeIcon />
    </IconButton>
  );
};

export default DarkModeButton;