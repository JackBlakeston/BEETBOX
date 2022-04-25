import React, { useContext } from 'react';
import { Box, Input, Slider } from '@mui/material';
import { update } from 'firebase/database';
import { LoopContext } from '../../../contexts';

const BpmSlider = () => {

  const { loop, setLoop } = useContext(LoopContext);

  function handleTempoChange (event) {
    const newBpm = Number(event.target.value);

    setLoop({...loop, bpm: newBpm});
    update(loop.ref, { bpm: newBpm });
  }

  return (
    <div className='slider-container' id='bpm-controls'>
      <label>BPM</label>
      <Box className='slider-box' width={200}>
        <Slider
          min={1}
          max={420}
          step={1}
          value={loop.bpm}
          onChange={handleTempoChange}
          sx={{
            '& .MuiSlider-thumb': {
              height: 20,
              width: 4,
              borderRadius: 0,
            }
          }}
        />
      </Box>
      <Input
        value={loop.bpm}
        size="small"
        onChange={handleTempoChange}
        inputProps={{
          min: 1,
          max: 420,
          style: {
            width: 29,
            textAlign: 'center',
          }
        }}
      />
    </div>
  );
};

export default BpmSlider;