import { Button, Slider } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import Fraction from 'fraction.js'


function Controls (props) {
  let buttonText = props.playing ? 'Stop' : 'Play';
  const sizeMarks = [4, 8, 16, 32].map(mark => {
    return { value: mark };
  });

  const precisionMarks = [0.25, 0.5, 1].map(mark => {
    return { value: mark }
  });

  return (
    <div className="controls">
        <Button
          sx={{ fontSize:'18px' }}
          variant='contained'
          className='play-button'
          onClick={props.togglePlaying}
        >
          {buttonText}
        </Button>

        <div className='slider-container' id='bpm-controls'>
          <label>BPM</label>
          <Box className='slider-box' width={200}>
            <Slider
              min={1}
              max={420}
              step={1}
              value={props.bpm}
              onChange={props.handleTempoChange}
            />
          </Box>
          <output>
            {props.bpm}
          </output>
        </div>

        <div className='slider-container' id='grid-size-controls'>
          <label><p>Grid Size</p><p>(Beats)</p></label>
          <Box className='slider-box' width={200}>
            <Slider
              marks={sizeMarks}
              step={null}
              min={4}
              max={32}
              value={props.gridSize}
              onChange={props.handleGridSizeChange}
              // TODO make scale linear
              // TODO remove markers that appeared for no reason
            />
          </Box>
          <output>
            {props.gridSize}
          </output>
        </div>

        <div className='slider-container' id='precision-controls'>
          <label>Grid Precision</label>
          <Box className='slider-box' width={200}>
            <Slider
              marks={precisionMarks}
              step={null}
              min={1/4}
              max={1}
              value={props.precision}
              onChange={props.handlePrecisionChange}
              track={false}
            />
          </Box>
          <output>
            {new Fraction(props.precision).toFraction()}
          </output>
        </div>

    </div>
  );
}

export default Controls;