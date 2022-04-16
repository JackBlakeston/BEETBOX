import React from 'react';

function Pad (props) {
  return (
    <div
      className={'pad ' +
        (props.state && !props.isDisabled ? 'active' : '') +
        (props.pos === props.id ? ' playing' : '') +
        (props.isDisabled ? 'disabled' : '')
      }
      onClick={() => !props.isDisabled && props.toggleActive(props.rowIndex, props.id)}>
    </div>
  );
}

export default Pad;