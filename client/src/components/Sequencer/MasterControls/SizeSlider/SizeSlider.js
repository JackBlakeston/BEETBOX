import React, { useContext } from 'react';
import { Slider } from '@mui/material';
import { Box } from '@mui/system';
import { update } from 'firebase/database';

import { LoopContext, PlaybackContext } from '../../../../contexts';
import { sliderLabelHeader, sliderLabelText, sizeMarks, sliderSx } from './constants';
import classes from './sizeSlider.module.css';

const SizeSlider = () => {

  const { loop, setLoop } = useContext(LoopContext);
  const { isPlaying, togglePlaying, pos } = useContext(PlaybackContext);

  function handleGridSizeChange (event) {
    const newSize = Number(2 ** event.target.value);
    if (isPlaying && newSize < loop.gridSize && pos > newSize) togglePlaying();

    setLoop({...loop, gridSize: newSize});
    update(loop.ref, { gridSize: newSize });
  }

  return (
    <div className={classes.mainContainer}>
      <label><p>{sliderLabelHeader}</p><p>{sliderLabelText}</p></label>
      <Box className={classes.sliderBox} width={200}>
        <Slider
          marks={sizeMarks}
          step={null}
          min={2}
          max={5}
          value={Math.log2(loop.gridSize)}
          onChange={handleGridSizeChange}
          sx={sliderSx}
        />
      </Box>
      <output>
        {loop.gridSize}
      </output>
    </div>
  );
};

export default SizeSlider;