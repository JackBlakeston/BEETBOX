import React, { useContext } from 'react';
import { IconButton } from '@mui/material';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';

import { DarkModeContext } from '../../../../contexts';
import { getRenameButtonStyle } from './utils';
import { renameIconStyle } from './constants';

const RenameButton = ({ handleModalOpen }) => {

  const { useDarkMode } = useContext(DarkModeContext);

  const renameButtonStyle = getRenameButtonStyle(useDarkMode);

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