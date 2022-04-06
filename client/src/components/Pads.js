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

  return (
    <div className='pads'>
      {pads.map((row, rowIndex) => {
        return (
          <div className='row' key={rowIndex}>a
            {row.map((pad, index) => {
              return <Pad key={index} />
            })}
          </div>
        )
      })}
    </div>
  )
}

export default Pads;