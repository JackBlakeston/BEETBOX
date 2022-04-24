import { Button, Input, Slider } from '@mui/material';
import { Box } from '@mui/system';
import StopIcon from '@mui/icons-material/Stop';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import React from 'react';
import Fraction from 'fraction.js';

function Controls (props) {

  let buttonText = props.playing ? 'Stop' : 'Play';

  const sizeMarks = [2, 3, 4, 5].map(mark => {
    return { value: mark };
  });

  const precisionMarks = [0, 1, 2].map(mark => {
    return { value: mark };
  });

  return (
    <div className="controls">
      <Button
        sx={{
          fontSize:'18px',
          paddingLeft: 3,
        }}
        variant='contained'
        className='play-button'
        onClick={props.togglePlaying}
      >
        <div className='play-button-inner-container'>
          {buttonText}
          {props.playing ? <StopIcon className='play-button-icon'/> : <PlayArrowIcon className='play-button-icon'/>}
        </div>
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
          value={props.bpm}
          size="small"
          onChange={props.handleTempoChange}
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

      <div className='slider-container' id='grid-size-controls'>
        <label><p>Grid Size</p><p>(Beats)</p></label>
        <Box className='slider-box' width={200}>
          <Slider
            marks={sizeMarks}
            step={null}
            min={2}
            max={5}
            value={Math.log2(props.gridSize)}
            onChange={props.handleGridSizeChange}
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
          {props.gridSize}
        </output>
      </div>

      <div className='slider-container' id='precision-controls'>
        <label>Grid Precision</label>
        <Box className='slider-box' width={200}>
          <Slider
            marks={precisionMarks}
            step={null}
            min={0}
            max={2}
            value={Math.log2(1 / props.precision)}
            onChange={props.handlePrecisionChange}
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
          {new Fraction(props.precision).toFraction()}
        </output>
      </div>

    </div>
  );
}

export default Controls;