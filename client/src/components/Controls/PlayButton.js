import React from 'react';
import { Button } from '@mui/material';
import StopIcon from '@mui/icons-material/Stop';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';


export function PlayButton ({ playing, togglePlaying }) {

  let buttonText = playing ? 'Stop' : 'Play';

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
        {playing ? <StopIcon className='play-button-icon'/> : <PlayArrowIcon className='play-button-icon'/>}
      </div>
    </Button>
  );
}