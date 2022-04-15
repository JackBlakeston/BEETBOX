import React, { useEffect, useState } from 'react';
import { Box, Button, CssBaseline} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { purple } from '@mui/material/colors';

import './App.css';
import PadRow from './components/PadRow';
import Controls from './components/Controls';
import { getBankRefList, getSampleList } from './audio-service';


function App () {

  const savedPads = JSON.parse(localStorage.getItem('pads'));
  const savedTrackList = JSON.parse(localStorage.getItem('trackList'));
  const savedGridSize = JSON.parse(localStorage.getItem('gridSize'));

  // Categories from DB
  const [sampleList, setSampleList] = useState([]);
  const [bankList, setBanklist] = useState([]);

  // State of tracks and pads
  const [gridSize, setGridSize] = useState(savedGridSize ? savedGridSize : 16);
  const [trackList, setTrackList] = useState(savedTrackList ? savedTrackList.trackList : []);
  const [pads, setPads] = useState(savedPads ? savedPads : []);
  const [trackCounter, setTrackCounter] = useState(savedTrackList ? savedTrackList.trackCounter : trackList.length);

  // Audio control
  const [isPlaying, setIsPlaying] = useState(false);
  const [pos, setPos] = useState(0);
  const [bpm, setBpm] = useState(220);

  const [activeRows, setActiveRows] = useState(Array(trackList.length).fill(false)); // Tells all tracks if they should play or not
  const [isLooped, setIsLooped] = useState(false); // Necessary for fixing visual delay

  // Dark mode
  const [useDarkMode, setUseDarkMode] = useState(true);

  useEffect(() => {
    getSampleList().then(list => {
      setSampleList(list);
    });

    getBankRefList().then(list => {
      setBanklist(list);
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

    if (currentPos > gridSize - 1) {
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

  function changeGridSize (event) {
    if (isPlaying) togglePlaying();
    const newSize = Number(event.target.value);
    setGridSize(newSize);
    localStorage.setItem('gridSize', JSON.stringify(newSize));
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
    padsCopy.push(Array(32).fill(0));

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





  // MUI Theming
  const theme = createTheme({
    palette: {
      mode: useDarkMode ? 'dark' : 'light',
      primary: {
        main: purple[600]
      },
      secondary: {
        main: purple[600]
      },
      background: {
        default: useDarkMode ? '#2D2D2D' : '#F1F1F1'
      }
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <div className='App'>
        <Controls
          playing={isPlaying}
          togglePlaying={togglePlaying}
          handleTempoChange={changeBpm}
          bpm={bpm}
          useDarkMode={useDarkMode}
          setUseDarkMode={setUseDarkMode}
          gridSize={gridSize}
          handleGridSizeChange={changeGridSize}
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
              bankList={bankList}
              gridSize={gridSize}
              />
            }) }
          </div>

        <Box ml={7.2} mt={2} className='new-track-container'>
          <Button
            sx={{
              border:'1.7px solid #8e25aa',
              fontSize: '20px',
              fontWeight: 'bold',
              backgroundColor: useDarkMode && 'rgb(99 25 118 / 14%)',
              color: useDarkMode && 'white',
              ':hover': {
                border:'1.7px solid #8e25aa',
                backgroundColor: useDarkMode ? 'rgb(99 25 118 / 40%)' : 'rgb(142 36 170 / 7%)'
              }
            }}
            variant={useDarkMode ? 'contained' : 'outlined'}
            className='new-track-button'
            onClick={handleClickNewTrack}
            >NEW TRACK
          </Button>
        </Box>

      </div>
    </ThemeProvider>
  );
}

export default App;