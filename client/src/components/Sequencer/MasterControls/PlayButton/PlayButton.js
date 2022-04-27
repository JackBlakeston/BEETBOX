import React, { useContext } from 'react';
import { Button } from '@mui/material';
import StopIcon from '@mui/icons-material/Stop';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { PlaybackContext } from '../../../../contexts';
import { buttonSx } from './constants';
import classes from './playButton.module.css';

const PlayButton = () => {

  const { isPlaying, togglePlaying } = useContext(PlaybackContext);

  let buttonText = isPlaying ? 'Stop' : 'Play';

  return (
    <Button
      sx={buttonSx}
      variant='contained'
      onClick={togglePlaying}
    >
      <div className={classes.playButtonInnerContainer}>
        {buttonText}
        {isPlaying ? <StopIcon /> : <PlayArrowIcon />}
      </div>
    </Button>
  );
};

export default PlayButton;