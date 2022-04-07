import React, { useState } from 'react';
import './App.css';
import Pads from './components/Pads';
import Controls from './components/Controls';


function App () {

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

  // TODO change this for howlerjs lib
  const frequencies = [130.81, 146.83, 164.81, 174.61, 196.00, 220.00, 246.94, 261.63];

  const audioCx = new (window.AudioContext || window.webkitAudioContext)();
  const gain = audioCx.createGain();
  gain.connect(audioCx.destination);
  gain.gain.value = 1;


  const [pads, setPads] = useState(initialPads)
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
  ////////

  function togglePlaying () {
    if (playing) clearInterval(timerId);

    setPlaying(!playing);
  }

  // function setTimer () {
  //   const newTimerId = setInterval(() => tick(), calculateTempo(bpm));
  //   setTimerId(newTimerId);
  // }

  const timerId = useInterval(tick, playing ? calculateTempo(bpm) : null)

  function tick () {
    let currentPos = pos;
    currentPos++;

    if (currentPos > 7) currentPos = 0;
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
    let freq = frequencies[rowIndex];
    let node = audioCx.createOscillator();
    let currentTime = audioCx.currentTime;
    node.frequency.value = freq;
    node.detune.value = 0;
    node.type = 'sine';
    node.connect(gain);
    node.start(currentTime);
    node.stop(currentTime + 0.2);
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
  }

  return (
    <div className='App'>
      <Controls
        playing={playing}
        togglePlaying={togglePlaying}
        handleChange={changeBpm}
        bpm={bpm} />
      <Pads pos={pos} pads={pads} toggleActive={toggleActive} />
    </div>
  );
}

export default App;