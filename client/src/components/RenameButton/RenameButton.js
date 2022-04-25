import React, { useContext } from 'react';
import { IconButton } from '@mui/material';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';

import { DarkModeContext } from '../../contexts';

const RenameButton = ({ handleModalOpen }) => {

  const { useDarkMode } = useContext(DarkModeContext);

  const renameButtonStyle = {
    '&:hover': {
      backgroundColor: useDarkMode ? '#d81a609c' : '#d81a6073',
    },
    '&:hover > svg': {
      fill: useDarkMode ? '#b1a9a9' : '#393939'
    }
  };

  const renameIconStyle = {
    fill: 'rgb(129 128 128)',
  };

  return (
    <IconButton
      size="small"
      onClick={handleModalOpen}
      sx={renameButtonStyle}
    >
      <DriveFileRenameOutlineIcon
        sx={renameIconStyle}
      />
    </IconButton>
  );
};

export default RenameButton;