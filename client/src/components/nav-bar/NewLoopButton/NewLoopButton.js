import React, { useContext } from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { push } from 'firebase/database';
import { LoopContext } from '../../../contexts';
import classes from './newLoopButton.module.css';
import { newLoop, buttonText, newLoopButtonSx } from './constants';

const NewLoopButton = ({ userRef }) => {

  const navigate = useNavigate();

  const { setLoop } = useContext(LoopContext);

  function handleNewLoopClick () {
    const newLoopRef = push(userRef, newLoop);

    setLoop({...newLoop, ref: newLoopRef});
    navigate(`sequencer/${newLoopRef.key}`);
  }


  return (
    <div className={classes.mainContainer}>
      <Button
        variant='contained'
        onClick={handleNewLoopClick}
        sx={newLoopButtonSx}
        className={classes.newLoopButton}
      >
        { buttonText }
      </Button>
    </div>
  );
};

export default NewLoopButton;