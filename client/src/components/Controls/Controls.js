import React from 'react';

import { BpmSlider } from './Sliders/BpmSlider';
import { PlayButton } from './PlayButton';
import { SizeSlider } from './Sliders/SizeSlider';
import { PrecisionSlider } from './Sliders/PrecisionSlider';

function Controls ({ isPlaying, togglePlaying, pos }) {

  return (
    <div className="controls">
      <PlayButton
        playing={isPlaying}
        togglePlaying={togglePlaying}
      />

      <BpmSlider/>

      <SizeSlider
        isPlaying={isPlaying}
        togglePlaying={togglePlaying}
        pos={pos}
      />

      <PrecisionSlider
        isPlaying={isPlaying}
      />

    </div>
  );
}

export default Controls;