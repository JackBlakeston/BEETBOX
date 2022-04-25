import React, { useContext } from 'react';
import { Button } from '@mui/material';
import StopIcon from '@mui/icons-material/Stop';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { PlaybackContext } from '../../contexts';

const PlayButton = () => {

  const { isPlaying, togglePlaying } = useContext(PlaybackContext);

  let buttonText = isPlaying ? 'Stop' : 'Play';

  return (
    <Button
      sx={{
        fontSize:'18px',
        paddingLeft: 3,
      }}
      variant='contained'
      className='play-button'
      onClick={togglePlaying}
    >
      <div className='play-button-inner-container'>
        {buttonText}
        {isPlaying ? <StopIcon className='play-button-icon'/> : <PlayArrowIcon className='play-button-icon'/>}
      </div>
    </Button>
  );
};

export default PlayButton;