import { Button } from '@mui/material';
import { Box } from '@mui/system';
import React, { useContext } from 'react';

import classes from './newTrackButton.module.css';
import { DarkModeContext, LoopContext } from '../../../contexts';
import { buttonStyle, buttonText, darkBg, lightBg, rowMaxLength } from './constants';
import { getButtonVariant, getNewTrack } from './utils';


const NewTrackButton = () => {

  const { useDarkMode } = useContext(DarkModeContext);
  const { loop, loopRef } = useContext(LoopContext);

  const buttonSx = {
    ...buttonStyle,
    color: useDarkMode && 'white',
    backgroundColor: useDarkMode && 'rgb(179 20 78 / 14%)',
    ':hover': {
      border:'1.7px solid #d81a60',
      backgroundColor: useDarkMode ? darkBg : lightBg,
    }
  };

  async function handleClickNewTrack () {

    const newLoop = await getLoop(loop.ref);

    let newTrackList;
    if (newLoop.trackList) {
      newTrackList = newLoop.trackList;
    } else {
      newTrackList = {};
    }

    const newTrack = getNewTrack(loop.trackCounter);

    newTrackList[newTrack.id] = newTrack;

    let padsCopy;
    if (loop.pads) {
      padsCopy = [...loop.pads];
    } else {
      padsCopy = [];
    }
    padsCopy.push(Array(rowMaxLength / loop.precision).fill(0));
    setLoop({...loop, trackList: newTrackList, trackCounter: loop.trackCounter + 1, pads: padsCopy});
    update(loopRef.current, { trackList: newTrackList, trackCounter: loop.trackCounter + 1, pads: padsCopy });
  }

  return (
    <Box ml={7.2} mt={2} className={classes.mainContainer}>
      <Button
        sx={buttonSx}
        variant={getButtonVariant(useDarkMode)}
        className={classes.NewTrackButton}
        onClick={handleClickNewTrack}
      >
        { buttonText }
      </Button>
    </Box>
  );
};

export default NewTrackButton;