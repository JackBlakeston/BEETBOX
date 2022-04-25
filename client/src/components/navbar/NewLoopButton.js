import React, { useContext } from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { push } from 'firebase/database';
import { LoopContext } from '../../contexts';

const newLoop = { // ?? Maybe take this out to another file??
  name: 'Untitled Beet',
  bpm: 220,
  gridSize: 16,
  precision: 1,
  pads: [],
  trackList: {},
  trackCounter: 0,
};

export default function ({ userRef }) {

  const navigate = useNavigate();

  const { setLoop } = useContext(LoopContext);

  function handleNewLoopClick () {
    const newLoopRef = push(userRef, newLoop);

    setLoop({...newLoop, ref: newLoopRef});
    navigate(`sequencer/${newLoopRef.key}`);
  }


  const buttonContainerStyle = {
    display: 'flex',
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  };

  const buttonStyle = {
    height: 40,
    width: 700,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  };


  return (
    <div style={buttonContainerStyle}>
      <Button
        variant='contained'
        onClick={handleNewLoopClick}
        sx={buttonStyle}
      >
        FRESH BEET
      </Button>
    </div>
  );
}