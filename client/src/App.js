import React, { useEffect, useState } from 'react';
import './App.css';
import Pads from './components/Pads';
import Controls from './components/Controls';


function App () {

  const [playing, setPlaying] = useState(false);
  const [pos, setPos] = useState(0);
  const [bpm, setBpm] = useState(220);
  const [timerId, setTimerId] = useState();

  useEffect(() => {

  }, [pos]);


  function togglePlaying () {
    if (playing) clearInterval(timerId);
    else setTimer();

    setPlaying(!playing);
  }

  function setTimer () {
    const newTimerId = setInterval(() => tick(), calculateTempo(bpm));
    setTimerId(newTimerId);
  }

  function tick () {
    let currentPos = pos;
    currentPos++;

    if (currentPos > 7) currentPos = 0;
    setPos(pos);
    console.log('CURRENT POSITION', pos);
  }
  // TODO setinterval not getting updated state values.
  // TODO how can we fix this? callback in setpos does not work
  // TODO i saw that there are libraries with useInterval functions
  // TODO but i would like to solve it without doing that

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