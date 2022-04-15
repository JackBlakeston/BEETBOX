import { Button, IconButton, Slider } from '@mui/material';
import { Box } from '@mui/system';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import React from 'react';


// ! Example for custom styles
// const RedSlider = styled(Slider)({
//   color: 'red'
// });

function Controls (props) {
  let buttonText = props.playing ? 'Stop' : 'Play';
  const marks = [4, 8, 16, 32].map(mark => {
    return { value: mark, label: mark };
    });

  return (
    <div
      className="controls"
      style={{
        backgroundColor: props.useDarkMode ? 'rgb(40, 40, 40)' : 'rgb(235 235 235)'
      }}
    >
        <Button
        sx={{ fontSize:'18px' }}
        variant='contained'
        className='play-button'
        onClick={props.togglePlaying}
        >{buttonText}
        </Button>

        <div className='slider-container'>
          <label>BPM</label>
          <Box className='bpm-slider-box' width={200}>
            <Slider
              valueLabelDisplay="auto"
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

        <div className='slider-container'>
          <label>Grid Size</label>
          <Box className='size-slider-box' width={200}>
            <Slider
              marks={marks}
              step={null}
              valueLabelDisplay="auto"
              min={4}
              max={32}
              value={props.gridSize}
              onChange={props.handleGridSizeChange}
            />
          </Box>
          <output>
            {props.gridSize}
          </output>
        </div>

        <IconButton
        aria-label="dark-mode"
        size="small"
        onClick={() => props.setUseDarkMode(!props.useDarkMode) }
        >
          <DarkModeIcon/>
        </IconButton>

    </div>
  );
}

export default Controls;