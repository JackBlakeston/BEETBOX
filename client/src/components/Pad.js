import React from 'react';

function Pad (props) {
  return (
    <div
      className={'pad ' + (props.state ? 'active' : '') + (props.pos === props.id ? ' playing' : '')}
      onClick={() => props.toggleActive(props.rowIndex, props.id)}>
    </div>
  );
}

export default Pad;