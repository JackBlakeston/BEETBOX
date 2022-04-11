import { useEffect } from 'react';
import useSound from 'use-sound';

import Pad from './Pad'

// Audio file imports
// import kick1 from './assets/sounds/kick_1.wav';
// import { useEffect, useState } from 'react';
// import { Test } from '../audio-service';
// import kick2 from './assets/sounds/kick_2.wav';
// import snare from './assets/sounds/snare.wav';
// import hhClosed from './assets/sounds/hh_closed.wav';
// import hhOpen from './assets/sounds/hh_open.wav';
// import shaker from './assets/sounds/shaker.wav';
// import clap from './assets/sounds/clap.wav';
// import scratch from './assets/sounds/scratch.wav';

function PadRow ({soundFileUrl, pads, pos, toggleActive, isPlaying, rowIndex, sampleName}) {

  // TODO change this for howlerjs lib
  const [playSound] = useSound(soundFileUrl);

  useEffect(() => {
    if (isPlaying) {
      playSound();
    }
  }, [pos, isPlaying, playSound]);


  // const [playKick2] = useSound(kick2);
  // const [playSnare] = useSound(snare);
  // const [playHhClosed] = useSound(hhClosed);
  // const [playHhOpen] = useSound(hhOpen);
  // const [playShaker] = useSound(shaker);
  // const [playClap] = useSound(clap);
  // const [playScratch] = useSound(scratch);

  return (
    <>
        <p>{sampleName}</p>
          <div className='row'>
            {pads.map((pad, index) => {
              return <Pad
                key={index}
                rowIndex={rowIndex} // Needs to be index of current row
                id={index}
                state={pad}
                pos={pos}
                toggleActive={() => toggleActive(rowIndex, index)} />
            })}
          </div>

    </>

  )
}

export default PadRow;