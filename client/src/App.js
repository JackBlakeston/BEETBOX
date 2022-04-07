import React, { useState } from 'react';
import useSound from 'use-sound';

import './App.css';
import Pads from './components/Pads';
import Controls from './components/Controls';

// Audio file imports
import kick1 from './assets/sounds/kick_1.wav';
import kick2 from './assets/sounds/kick_2.wav';
import snare from './assets/sounds/snare.wav';
import hhClosed from './assets/sounds/hh_closed.wav';
import hhOpen from './assets/sounds/hh_open.wav';
import shaker from './assets/sounds/shaker.wav';
import clap from './assets/sounds/clap.wav';
import scratch from './assets/sounds/scratch.wav';


function App () {

  const initialPads =  [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ];

  const savedPads = JSON.parse(localStorage.getItem('pads'));

  // TODO change this for howlerjs lib
  const [playKick1] = useSound(kick1);
  const [playKick2] = useSound(kick2);
  const [playSnare] = useSound(snare);
  const [playHhClosed] = useSound(hhClosed);
  const [playHhOpen] = useSound(hhOpen);
  const [playShaker] = useSound(shaker);
  const [playClap] = useSound(clap);
  const [playScratch] = useSound(scratch);


  const [pads, setPads] = useState(savedPads ? savedPads : initialPads)
  const [playing, setPlaying] = useState(false);
  const [pos, setPos] = useState(0);
  const [bpm, setBpm] = useState(220);


  function useInterval(callback, delay) {
    const intervalRef = React.useRef();
    const callbackRef = React.useRef(callback);

    // Remember the latest callback:
    //
    // Without this, if you change the callback, when setInterval ticks again, it
    // will still call your old callback.
    //
    // If you add `callback` to useEffect's deps, it will work fine but the
    // interval will be reset.

    React.useEffect(() => {
      callbackRef.current = callback;
    }, [callback]);

    // Set up the interval:

    React.useEffect(() => {
      if (typeof delay === 'number') {
        intervalRef.current = window.setInterval(() => callbackRef.current(), delay);

        // Clear interval if the components is unmounted or the delay changes:
        return () => window.clearInterval(intervalRef.current);
      }
    }, [delay]);

    // Returns a ref to the interval ID in case you want to clear it manually:
    return intervalRef;
  }

  function togglePlaying () {
    if (playing) {
      clearInterval(timerId);
      setPos(0);
    }

    setPlaying(!playing);
  }

  const timerId = useInterval(tick, playing ? calculateTempo(bpm) : null)

  function tick () {
    let currentPos = pos;
    currentPos++;

    if (currentPos > 15) currentPos = 0;
    setPos(currentPos);

    checkPad();
  }
  // ?? Any way to do this without useInterval hook?

  function checkPad () {
    pads.forEach((row, rowIndex) => {
      row.forEach((pad, index) => {
        if (index === pos && pad === 1) {
          playSound(rowIndex);
        }
      })
    })
  }

  function playSound(rowIndex) {
    if (rowIndex === 0) playKick1();
    if (rowIndex === 1) playKick2();
    if (rowIndex === 2) playSnare();
    if (rowIndex === 3) playHhClosed();
    if (rowIndex === 4) playHhOpen();
    if (rowIndex === 5) playShaker();
    if (rowIndex === 6) playClap();
    if (rowIndex === 7) playScratch();
  }


  function calculateTempo (bpm) {
    return 60000 / bpm;
  }

  function changeBpm (event) {
    const newBpm = Number(event.target.value);
    setBpm(newBpm);
    if (playing) {
      clearInterval(timerId)
      setPlaying(false);
    }
  }

  function toggleActive (rowIndex, id) {
    let padsCopy = [...pads];
    let padState = padsCopy[rowIndex][id];
    if (padState === 1) {
      pads[rowIndex][id] = 0;
    } else {
      pads[rowIndex][id] = 1;
    }
    setPads(padsCopy);
    localStorage.setItem('pads', JSON.stringify(padsCopy));
  }

  return (
    <div className='App'>
      <Controls
        playing={playing}
        togglePlaying={togglePlaying}
        handleChange={changeBpm}
        bpm={bpm} />
      <div className='pad-and-names-container'>
        <div className='names-container'>
          <p>Kick 1</p>
          <p>Kick 2</p>
          <p>Snare</p>
          <p>HH - Closed</p>
          <p>HH - Open</p>
          <p>Shaker</p>
          <p>Clap</p>
          <p>Scratch</p>
        </div>
        <Pads pos={pos} pads={pads} toggleActive={toggleActive} />
      </div>
    </div>
  );
}

export default App;