import React from 'react';

function Pad (props) {

  return (
    <div
      className={
        'pad-container' +
        (props.isAlternativeColor ? ' alternative-color' : '') +
        (props.rowIndex === 0 ? ' top-row-element' : '')
      }
    >
      <div
        className={'pad ' +
          (props.state && !props.isDisabled ? 'active ' : '') +
          (props.pos === props.id && !props.isDisabled ? 'playing ' : '') +
          (props.isDisabled ? 'disabled ' : '')
        }
        style={{ width: `${60 * props.precision}px` }}
        onClick={() => !props.isDisabled && props.toggleActive(props.rowIndex, props.id)}>
      </div>
    </div>
  );
}

export default Pad;