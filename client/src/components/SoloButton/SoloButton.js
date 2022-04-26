import React, { useContext, useState } from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import {checkIfSoloed} from './utils';
import { LoopContext } from '../../contexts';
import { update } from 'firebase/database';

import classes from './soloButton.module.css';


const SoloButton = ({ track }) => {

  const { loop, setLoop } = useContext(LoopContext);

  const [isSoloed, setIsSoloed] = useState(checkIfSoloed(loop, track));

  function handleSoloClick () {
    const loopCopy = Object.assign({}, loop);
    let newSoloedTracks = loopCopy.soloedTracks;

    if (newSoloedTracks) {
      const trackIndex = loopCopy.soloedTracks?.indexOf(track.id);
      if (trackIndex > -1) {
        newSoloedTracks.splice(trackIndex, 1);
      } else {
        newSoloedTracks.push(track.id);
      }
    } else {
      newSoloedTracks = [track.id];
    }
    setIsSoloed(!isSoloed);
    setLoop({...loop, soloedTracks: newSoloedTracks});
    update(loop.ref, {soloedTracks: newSoloedTracks});
  }

  return (
    <ToggleButton
      value="check"
      selected={isSoloed}
      onChange={handleSoloClick}
      className={classes.soloButton}
      color="secondary"
    >
      S
    </ToggleButton>
  );

};


export default SoloButton;