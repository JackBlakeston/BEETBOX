import React, { useContext } from 'react';
import { DarkModeContext } from '../contexts';

const Pad = (props) => {

  const { useDarkMode } = useContext(DarkModeContext);

  return (
    <div
      className={'pad-container'}
    >
      <div
        className={'pad ' +
          (props.state && !props.isDisabled ? 'active ' : '') +
          (props.pos === props.id && !props.isDisabled ? 'playing ' : '') +
          (props.isDisabled ? 'disabled ' : '')
        }
        style={{
          width: `${60 * props.precision}px`,
          backgroundColor: props.isDisabled && (useDarkMode ? 'rgb(37 37 37)' : 'rgb(104 92 96)'),
        }}
        onClick={() => !props.isDisabled && props.toggleActive(props.rowIndex, props.id)}>
      </div>
    </div>
  );
};

export default Pad;