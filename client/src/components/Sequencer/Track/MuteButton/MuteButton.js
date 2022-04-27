import React from 'react';
import { ToggleButton } from '@mui/material';

import classes from './muteButton.module.css';
import { update } from 'firebase/database';

const MuteButton = ({ track, setTrack }) => {

  function handleMuteClick () {
    const trackCopy = Object.assign({}, track);
    const newIsMuted = trackCopy.isMuted;
    setTrack({ ...track, isMuted: !newIsMuted });
    update(track.ref, { isMuted: !newIsMuted });
  }

  return (
    <ToggleButton
      value="check"
      selected={track.isMuted}
      onChange={handleMuteClick}
      className={classes.muteButton}
      color="primary"
    >
      M
    </ToggleButton>
  );
};

export default MuteButton;