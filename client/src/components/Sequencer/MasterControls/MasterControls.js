import React, { useContext } from 'react';
import classNames from 'classnames';

import BpmSlider from './BpmSlider/BpmSlider';
import PlayButton from './PlayButton/PlayButton';
import SizeSlider from './SizeSlider/SizeSlider';
import PrecisionSlider from './PrecisionSlider/PrecisionSlider';
import { DarkModeContext } from '../../../contexts';
import classes from './masterControls.module.css';

const MasterControls = () => {

  const { useDarkMode } = useContext(DarkModeContext);

  const controlsClassNames = classNames({
    [classes.controls]: true,
    [classes.controlsDark]: useDarkMode
  });

  return (
    <div className={controlsClassNames}>
      <PlayButton/>
      <BpmSlider/>
      <SizeSlider/>
      <PrecisionSlider/>
    </div>
  );
};

export default MasterControls;