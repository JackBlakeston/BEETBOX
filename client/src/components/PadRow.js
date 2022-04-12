import { useEffect } from 'react';
import useSound from 'use-sound';

import Pad from './Pad';

function PadRow ({soundFileUrl, pads, pos, toggleActive, isTriggering, rowIndex, sampleName, isLooped}) {

  // TODO change this for howlerjs lib
  const [playSound] = useSound(soundFileUrl);

  useEffect(() => {
    if (isTriggering) {
      playSound();
    }
  }, [pos, isTriggering, playSound]);

  return (
    <div className='row-container'>
      <p>{sampleName}</p>
        <div className='row'>
          {pads.map((pad, index) => {
            return <Pad
              key={index}
              rowIndex={rowIndex}
              id={index}
              state={pad}
              pos={ pos === 0 && isLooped ? 15 : pos - 1 } // Fixes visual delay
              toggleActive={() => toggleActive(rowIndex, index)} />
          })}
        </div>
    </div>

  )
}

export default PadRow;