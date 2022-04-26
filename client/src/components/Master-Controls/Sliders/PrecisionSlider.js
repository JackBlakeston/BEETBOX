import React, { useContext } from 'react';
import { Box, Slider } from '@mui/material';
import Fraction from 'fraction.js';
import { LoopContext, PlaybackContext } from '../../../contexts';
import { update } from 'firebase/database';


const precisionMarks = [0, 1, 2].map(mark => {
  return { value: mark };
});

const PrecisionSlider = () => {

  const { loop, setLoop } = useContext(LoopContext);
  const { isPlaying, togglePlaying } = useContext(PlaybackContext);

  function handlePrecisionChange (event) {
    const newPrecision = Number(1 / 2 ** event.target.value);
    if (isPlaying) togglePlaying();
    const padsCopy = [...loop.pads];
    const factor = loop.precision / newPrecision;
    let newPads;

    if (factor > 1) {
      newPads = padsCopy.map(padRow => padRow.map(pad => {
        const splitPadArr = Array(factor - 1).fill(0);
        splitPadArr.unshift(pad);
        return splitPadArr;
      }).flat());

    } else if (factor < 1) {
      newPads = padsCopy.map(padRow => {
        const joinedPadArr = [];
        for ( let i = 0; i < padRow.length; i += (1 / factor) ) {
          joinedPadArr.push(padRow[i]);
        }
        return joinedPadArr;
      });
    } else {
      return;
    }

    setLoop({...loop, pads: newPads, precision: newPrecision});
    update(loop.ref, { pads: newPads, precision: newPrecision });
  }

  return (
    <div className='slider-container' id='precision-controls'>
      <label>Grid Precision</label>
      <Box className='slider-box' width={200}>
        <Slider
          marks={precisionMarks}
          step={null}
          min={0}
          max={2}
          value={Math.log2(1 / loop.precision)}
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
        {new Fraction(loop.precision).toFraction()}
      </output>
    </div>
  );
};

export default PrecisionSlider;