import styled from '@emotion/styled';
import React from 'react';

function Pad (props) {

  const ResizePad = styled('div')({
    width: `${60 * props.precision}px`,
  });

  return (
    <ResizePad
      className={'pad ' +
        (props.state && !props.isDisabled ? 'active' : '') +
        (props.pos === props.id && !props.isDisabled ? ' playing' : '') +
        (props.isDisabled ? 'disabled' : '')
      }
      onClick={() => !props.isDisabled && props.toggleActive(props.rowIndex, props.id)}>
    </ResizePad>
  );
}

export default Pad;