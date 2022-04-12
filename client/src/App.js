import React, { useEffect, useState } from 'react';

import './App.css';
import PadRow from './components/PadRow';
import Controls from './components/Controls';
import { getSampleList } from './audio-service';



function App () {

  const initialTrackList = [];

  // const initialPads =  [
  //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  // ];

  const initialPads = initialTrackList.map(track => Array(16).fill(0)); // TODO Change 16 for variable length

  const savedPads = JSON.parse(localStorage.getItem('pads'));
  const savedTrackList = JSON.parse(localStorage.getItem('trackList'));


  const [sampleList, setSampleList] = useState([]);
  // State of tracks and pads
  const [trackList, setTrackList] = useState(savedTrackList ? savedTrackList.trackList : initialTrackList);
  const [pads, setPads] = useState(savedPads ? savedPads : initialPads);
  const [trackCounter, setTrackCounter] = useState(savedTrackList ? savedTrackList.trackCounter : trackList.length);

  const [isPlaying, setIsPlaying] = useState(false);
  const [pos, setPos] = useState(0);
  const [bpm, setBpm] = useState(220);
  const [activeRows, setActiveRows] = useState(Array(trackList.length).fill(false));
  const [isLooped, setIsLooped] = useState(false); // Necessary for fixing visual delay
  console.log(trackList, pads)

  useEffect(() => {
    getSampleList().then(list => {
      setSampleList(list);
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
      setActiveRows(Array(trackList.length).fill(false));
      setIsLooped(false);
    }
    setIsPlaying(!isPlaying);
  }

  const timerId = useInterval(tick, isPlaying ? calculateTempo(bpm) : null)

  function tick () {
    let currentPos = pos;
    currentPos++;

    if (currentPos > 15) { // TODO Make length a changeable state
      currentPos = 0;
      setIsLooped(true);
    }
    setPos(currentPos);

    checkPad();
  }
  // ?? Any way to do this without useInterval hook?

  function checkPad () {
    const activeRowsAux = Array(trackList.length).fill(false);

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

  function handleClickNewTrack () {
    const trackListCopy = [...trackList];
    trackListCopy.push(`Track ${ trackCounter + 1 }`); // TODO change for categories
    setTrackCounter(trackCounter + 1);

    const padsCopy = [...pads];
    padsCopy.push(Array(16).fill(0));

    setTrackList(trackListCopy);
    setPads(padsCopy);

    localStorage.setItem('trackList', JSON.stringify({trackList: trackListCopy, trackCounter: trackCounter + 1}));
    localStorage.setItem('pads', JSON.stringify(padsCopy));
  }

  function handleClickDelete (rowIndex) {
    const trackListCopy = [...trackList]
    const removedTrackId = trackListCopy.splice(rowIndex, 1);

    const padsCopy = [...pads];
    padsCopy.splice(rowIndex, 1);

    setTrackList(trackListCopy);
    setPads(padsCopy);

    localStorage.setItem('trackList', JSON.stringify({trackList: trackListCopy, trackCounter}));
    localStorage.setItem('pads', JSON.stringify(padsCopy));
    localStorage.removeItem(`${removedTrackId}`);
  }

  return (
    <div className='App'>
      <Controls
        playing={isPlaying}
        togglePlaying={togglePlaying}
        handleChange={changeBpm}
        bpm={bpm}
      />

        <div className='pads'>
          { trackList.map((trackId, index) => {
            return <PadRow
            trackId={trackId}
            key={trackId}
            pos={pos}
            pads={pads[index]}
            toggleActive={ toggleActive }
            handleClickDelete={ handleClickDelete }
            rowIndex={index}
            isTriggering={activeRows[index]}
            isLooped={isLooped}
            sampleList={sampleList}
            />
          }) }
        </div>

      <div className='new-track-container'>
        <button className='new-track-button' onClick={handleClickNewTrack}>NEW TRACK</button>
      </div>

    </div>
  );
}

export default App;