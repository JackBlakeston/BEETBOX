import { useEffect } from 'react';
import useSound from 'use-sound';

import Pad from './Pad';

function PadRow ({soundFileUrl, pads, pos, toggleActive, isPlaying, rowIndex, sampleName}) {

  // TODO change this for howlerjs lib
  const [playSound] = useSound(soundFileUrl);

  useEffect(() => {
    if (isPlaying) {
      playSound();
    }
  }, [pos, isPlaying, playSound]);

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
              pos={pos}
              toggleActive={() => toggleActive(rowIndex, index)} />
          })}
        </div>
    </div>

  )
}

export default PadRow;