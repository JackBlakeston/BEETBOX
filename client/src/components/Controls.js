import styled from '@emotion/styled';
import { Button, Slider } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';

// ! Example for custom styles
// const RedSlider = styled(Slider)({
//   color: 'red'
// });

function Controls (props) {
  let buttonText = props.playing ? 'Stop' : 'Play';

  return (
    <div className="controls">
        <Button variant='contained' className='play-button' onClick={props.togglePlaying}>{buttonText}</Button>

        <div className='bpm'>
          <label>BPM</label>
          <Box className='bpm-slider-box' width={200}>
          <Slider
          valueLabelDisplay="auto"
          min={1}
          max={420}
          step={1}
          value={props.bpm}
          onChange={props.handleChange} />
          </Box>
          <output>
            {props.bpm}
          </output>
        </div>

    </div>
  );
}

export default Controls;