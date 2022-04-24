import React from 'react';
import { Slider } from '@mui/material';
import { Box } from '@mui/system';

const sizeMarks = [2, 3, 4, 5].map(mark => {
  return { value: mark };
});

export function SizeSlider ({ gridSize, handleGridSizeChange }) {

  return (
    <div className='slider-container' id='grid-size-controls'>
      <label><p>Grid Size</p><p>(Beats)</p></label>
      <Box className='slider-box' width={200}>
        <Slider
          marks={sizeMarks}
          step={null}
          min={2}
          max={5}
          value={Math.log2(gridSize)}
          onChange={handleGridSizeChange}
          sx={{
            '& .MuiSlider-thumb': {
              height: 20,
              width: 4,
              borderRadius: 0,
            }
          }}
        />
      </Box>
      <output>
        {gridSize}
      </output>
    </div>
  );
}