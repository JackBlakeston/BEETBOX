import { Button } from '@mui/material';
import React from 'react';

function Controls (props) {
  let buttonText = props.playing ? 'Stop' : 'Play';

  return (
    <div className="controls">
        <Button variant='contained' className='play-button' onClick={props.togglePlaying}>{buttonText}</Button>

        <div className='bpm'>
          <label>BPM</label>
          <input
            type='range'
            id='bpm'
            min='1'
            max='420'
            step='1'
            defaultValue={props.bpm}
            onChange={props.handleChange} />
          <output>
            {props.bpm}
          </output>
        </div>

    </div>
  );
}

export default Controls;