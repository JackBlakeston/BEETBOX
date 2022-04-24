import React from 'react';
import { Box, Slider } from '@mui/material';
import Fraction from 'fraction.js';


const precisionMarks = [0, 1, 2].map(mark => {
  return { value: mark };
});

export function PrecisionSlider ({ precision, handlePrecisionChange }) {


  return (
    <div className='slider-container' id='precision-controls'>
      <label>Grid Precision</label>
      <Box className='slider-box' width={200}>
        <Slider
          marks={precisionMarks}
          step={null}
          min={0}
          max={2}
          value={Math.log2(1 / precision)}
          onChange={handlePrecisionChange}
          track={false}
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
        {new Fraction(precision).toFraction()}
      </output>
    </div>
  );
}