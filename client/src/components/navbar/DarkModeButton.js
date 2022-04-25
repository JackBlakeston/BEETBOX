import { IconButton } from '@mui/material';
import React, { useContext } from 'react';
import DarkModeIcon from '@mui/icons-material/DarkMode';

import { DarkModeContext } from '../../contexts';


export default function DarkModeButton () {

  const { useDarkMode, setUseDarkMode } = useContext(DarkModeContext);

  const DarkModeButtonStyle = {
    position: 'absolute',
    top: 10,
    right: 37,
  };

  return (
    <IconButton
      onClick={() => setUseDarkMode(!useDarkMode) }
      sx={DarkModeButtonStyle}
    >
      <DarkModeIcon />
    </IconButton>
  );
}