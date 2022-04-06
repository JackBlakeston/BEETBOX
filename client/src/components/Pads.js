import React, { useState } from 'react';

import Pad from './Pad'

function Pads () {

  const initialPads =  [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
  ];

  const [pads, setPads] = useState(initialPads)

  function toggleActive (rowIndex, id) {
    let padsCopy = [...pads];
    let padState = padsCopy[rowIndex][id];
    if (padState === 1) {
      pads[rowIndex][id] = 0;
    } else {
      pads[rowIndex][id] = 1;
    }
    setPads(padsCopy);
  }

  return (
    <div className='pads'>
      {pads.map((row, rowIndex) => {
        return (
          <div className='row' key={rowIndex}>
            {row.map((pad, index) => {
              return <Pad
                key={index}
                rowIndex={rowIndex}
                id={index}
                state={pad}
                toggleActive={toggleActive} />
            })}
          </div>
        )
      })}
    </div>
  )
}

export default Pads;