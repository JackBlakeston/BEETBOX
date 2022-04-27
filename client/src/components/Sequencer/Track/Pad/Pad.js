import { update } from 'firebase/database';
import React, { useContext } from 'react';
import { DarkModeContext, LoopContext } from '../../../../contexts';

const Pad = ({state, isDisabled, pos, id, rowIndex, precision}) => {

  const { useDarkMode } = useContext(DarkModeContext);

  const { loop, setLoop } = useContext(LoopContext);

  function toggleActive () {
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


  return (
    <div
      className={'pad-container'}
    >
      <div
        className={'pad ' +
          (state && !isDisabled ? 'active ' : '') +
          (pos === id && !isDisabled ? 'playing ' : '') +
          (isDisabled ? 'disabled ' : '')
        }
        style={{
          width: `${60 * precision}px`,
          backgroundColor: isDisabled && (useDarkMode ? 'rgb(37 37 37)' : 'rgb(104 92 96)'),
        }}
        onClick={() => !isDisabled && toggleActive()}>
      </div>
    </div>
  );
};

export default Pad;