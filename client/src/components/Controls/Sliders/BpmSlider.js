import React from 'react';
import { Box, Input, Slider } from '@mui/material';


export function BpmSlider ({ bpm, handleTempoChange }) {

  return (

    <div className='slider-container' id='bpm-controls'>
      <label>BPM</label>
      <Box className='slider-box' width={200}>
        <Slider
          min={1}
          max={420}
          step={1}
          value={bpm}
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
        value={bpm}
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
}