import React, { useContext } from 'react';
import { Box, Slider } from '@mui/material';
import { LoopContext, PlaybackContext } from '../../../../contexts';
import { update } from 'firebase/database';
import classes from './precisionSlider.module.css';
import { precisionMarks, sliderLabel, sliderSx } from './constants';
import { convertToFraction, getConvertedValue } from './utils';

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
    <div className={classes.mainContainer}>
      <label>{sliderLabel}</label>
      <Box className={classes.sliderBox} width={200}>
        <Slider
          marks={precisionMarks}
          step={null}
          min={0}
          max={2}
          value={getConvertedValue(loop.precision)}
          onChange={handlePrecisionChange}
          track={false}
          sx={sliderSx}
        />
      </Box>
      <output>
        {convertToFraction(loop.precision)}
      </output>
    </div>
  );
};

export default PrecisionSlider;