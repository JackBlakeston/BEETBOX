import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import Pads from './components/Pads';
import Controls from './components/Controls';


function App () {

  const [playing, setPlaying] = useState(false);
  const [pos, setPos] = useState(0);
  const [bpm, setBpm] = useState(220);
  // const [timerId, setTimerId] = useState();

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
    if (playing) clearInterval(newTimerId);

    setPlaying(!playing);
  }

  // function setTimer () {
  //   const newTimerId = setInterval(() => tick(), calculateTempo(bpm));
  //   setTimerId(newTimerId);
  // }

  const newTimerId = useInterval(tick, playing ? calculateTempo(bpm) : null)

  function tick () {
    let currentPos = pos;
    currentPos++;

    if (currentPos > 7) currentPos = 0;
    setPos(currentPos);
    console.log('CURRENT POSITION', pos);
  }
  // ?? Any way to do this without useInterval hook?

  function calculateTempo (bpm) {
    return 60000 / bpm;
  }

  return (
    <div className='App'>
      <Controls playing={playing} togglePlaying={togglePlaying} />
      <Pads />
    </div>
  );
}

export default App;