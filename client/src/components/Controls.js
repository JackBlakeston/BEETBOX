import React from 'react';

function Controls (props) {
  let buttonText = props.playing ? 'Stop' : 'Play';

  return (
    <div className="controls">
        <button onClick={props.togglePlaying}>{buttonText}</button>
    </div>
  );
}

export default Controls;