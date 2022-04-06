import React from 'react';

function Pad (props) {
  return (
    <div
      className={'pad ' + (props.state ? 'active' : '')}
      onClick={() => props.toggleActive(props.rowIndex, props.id)}>
    </div>
  );
}

export default Pad;