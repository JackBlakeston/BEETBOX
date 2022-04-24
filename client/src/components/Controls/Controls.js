import React from 'react';

import { BpmSlider } from './Sliders/BpmSlider';
import { PlayButton } from './PlayButton';
import { SizeSlider } from './Sliders/SizeSlider';
import { PrecisionSlider } from './Sliders/PrecisionSlider';

function Controls ({
  playing, togglePlaying,
  bpm, handleTempoChange,
  gridSize, handleGridSizeChange,
  precision, handlePrecisionChange
}) {

  return (
    <div className="controls">
      <PlayButton
        playing={playing}
        togglePlaying={togglePlaying}
      />

      <BpmSlider
        bpm={bpm}
        handleTempoChange={handleTempoChange}
      />

      <SizeSlider
        gridSize={gridSize}
        handleGridSizeChange={handleGridSizeChange}
      />

      <PrecisionSlider
        precision={precision}
        handlePrecisionChange={handlePrecisionChange}
      />

    </div>
  );
}

export default Controls;