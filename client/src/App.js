import React, { useEffect, useState } from 'react';

import './App.css';
import PadRow from './components/PadRow';
import Controls from './components/Controls';
import { getAllUrls } from './audio-service';



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

  const [pads, setPads] = useState(savedPads ? savedPads : initialPads);

  const [isPlaying, setIsPlaying] = useState(false);
  const [pos, setPos] = useState(0);
  const [bpm, setBpm] = useState(220);
  const [activeRows, setActiveRows] = useState(Array(8).fill(false));
  const [isLooped, setIsLooped] = useState(false); // Necessary for fixing visual delay

  const [urlList, setUrlList] = useState([]);

  useEffect(() => {
    getAllUrls().then(response => {
      setUrlList(response);
    });

  }, []);

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
    if (isPlaying) {
      clearInterval(timerId);
      setPos(0);
      setActiveRows(Array(8).fill(false));
      setIsLooped(false);
    }
    setIsPlaying(!isPlaying);
  }

  const timerId = useInterval(tick, isPlaying ? calculateTempo(bpm) : null)

  function tick () {
    let currentPos = pos;
    currentPos++;

    if (currentPos > 15) {
      currentPos = 0;
      setIsLooped(true);
    }
    setPos(currentPos);

    checkPad();
  }
  // ?? Any way to do this without useInterval hook?

  function checkPad () {
    const activeRowsAux = Array(8).fill(false);

    pads.forEach((row, rowIndex) => {
      row.forEach((pad, index) => {
        if (index === pos && pad === 1) {
          activeRowsAux[rowIndex] = true;
        }
      })
    });

    setActiveRows(activeRowsAux);
  }

  function calculateTempo (bpm) {
    return 60000 / bpm;
  }

  function changeBpm (event) {
    const newBpm = Number(event.target.value);
    setBpm(newBpm);
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
        playing={isPlaying}
        togglePlaying={togglePlaying}
        handleChange={changeBpm}
        bpm={bpm} />

        <div className='pads'>
          {
          urlList.map((sampleObj) => {
            return <PadRow key={sampleObj.name}
              sampleName={sampleObj.name}
              pos={pos}
              pads={pads[sampleObj.rowPosition]}
              toggleActive={toggleActive}
              soundFileUrl={sampleObj.url}
              rowIndex={sampleObj.rowPosition}
              isTriggering={activeRows[sampleObj.rowPosition]}
              isLooped={isLooped}/>
          })}
        </div>
    </div>
  );
}

export default App;