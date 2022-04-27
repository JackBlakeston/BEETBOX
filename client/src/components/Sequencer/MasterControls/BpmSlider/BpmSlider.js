import React, { useContext } from 'react';
import { Box, Input, Slider } from '@mui/material';
import { update } from 'firebase/database';
import { LoopContext } from '../../../../contexts';
import { inputProps, sliderLabel, sliderSx } from './constants';
import classes from './bpmSlider.module.css';

const BpmSlider = () => {

  const { loop, setLoop } = useContext(LoopContext);

  function handleTempoChange (event) {
    const newBpm = Number(event.target.value);
    setLoop({...loop, bpm: newBpm});
    update(loop.ref, { bpm: newBpm });
  }

  return (
    <div className={classes.mainContainer}>
      <label>{sliderLabel}</label>
      <Box className={classes.sliderBox} width={200}>
        <Slider
          min={1}
          max={420}
          step={1}
          value={loop.bpm}
          onChange={handleTempoChange}
          sx={sliderSx}
        />
      </Box>
      <Input
        value={loop.bpm}
        size="small"
        onChange={handleTempoChange}
        inputProps={inputProps}
      />
    </div>
  );
};

export default BpmSlider;