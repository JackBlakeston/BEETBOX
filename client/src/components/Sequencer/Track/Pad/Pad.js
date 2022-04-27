import { update } from 'firebase/database';
import React, { useContext } from 'react';
import classNames from 'classnames';

import { DarkModeContext, LoopContext } from '../../../../contexts';
import classes from './pad.module.css';
import { calculatePadWidth } from './utils';

const Pad = ({state, isDisabled, pos, id, rowIndex, precision}) => {

  const { useDarkMode } = useContext(DarkModeContext);

  const { loop, setLoop } = useContext(LoopContext);

  function toggleActive () {
    if (isDisabled) return;
    let padsCopy = [...loop.pads];
    let padState = padsCopy[rowIndex][id];

    if (padState === 1) {
      padsCopy[rowIndex][id] = 0;
    } else {
      padsCopy[rowIndex][id] = 1;
    }

    setLoop({...loop, pads: padsCopy});
    update(loop.ref, { pads: padsCopy });
  }

  const mainContainerClassNames = classNames({
    [classes.mainContainer]: true,
    [classes.active]: state && !isDisabled,
    [classes.playing]: pos === id && !isDisabled,
    [classes.disabled]: isDisabled,
    [classes.disabledDark]: isDisabled && useDarkMode
  });

  return (
    <div >
      <div
        className={mainContainerClassNames}
        style={{
          width: calculatePadWidth(precision),
        }}
        onClick={toggleActive}>
      </div>
    </div>
  );
};

export default Pad;