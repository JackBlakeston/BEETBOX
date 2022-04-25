import React, { useContext } from 'react';
import { Slider } from '@mui/material';
import { Box } from '@mui/system';
import { update } from 'firebase/database';
import { LoopContext } from '../../../contexts';

const sizeMarks = [2, 3, 4, 5].map(mark => {
  return { value: mark };
});

export function SizeSlider ({ isPlaying, pos, togglePlaying }) {

  const { loop, setLoop } = useContext(LoopContext);

  function handleGridSizeChange (event) {
    const newSize = Number(2 ** event.target.value);
    if (isPlaying && newSize < loop.gridSize && pos > newSize) togglePlaying();

    setLoop({...loop, gridSize: newSize});
    update(loop.ref, { gridSize: newSize });
  }

  return (
    <div className='slider-container' id='grid-size-controls'>
      <label><p>Grid Size</p><p>(Beats)</p></label>
      <Box className='slider-box' width={200}>
        <Slider
          marks={sizeMarks}
          step={null}
          min={2}
          max={5}
          value={Math.log2(loop.gridSize)}
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
        {loop.gridSize}
      </output>
    </div>
  );
}