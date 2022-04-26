import React from 'react';

import BpmSlider from './Sliders/BpmSlider';
import PlayButton from './PlayButton';
import SizeSlider from './Sliders/SizeSlider';
import PrecisionSlider from './Sliders/PrecisionSlider';

const MasterControls = () => {

  return (
    <div className="controls">
      <PlayButton/>
      <BpmSlider/>
      <SizeSlider/>
      <PrecisionSlider/>
    </div>
  );
};

export default MasterControls;