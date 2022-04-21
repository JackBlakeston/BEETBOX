import React, { useEffect, useState } from 'react';
import { Box, Button, CssBaseline} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { purple } from '@mui/material/colors';
import * as Tone from 'tone';
import { IconButton } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';


import '../App.css'; // TODO change name or refactor all styles
import PadRow from './PadRow';
import Controls from './Controls';
import { auth, getBankRefList, getSampleList } from '../FirebaseService';



function Sequencer () {

  const navigate = useNavigate(); // ? Should this be out of the function?

  // Loading local storage
  const savedPads = JSON.parse(localStorage.getItem('pads'));
  const savedTrackList = JSON.parse(localStorage.getItem('trackList'));
  const savedGridSize = JSON.parse(localStorage.getItem('gridSize'));
  const savedPrecision = JSON.parse(localStorage.getItem('precision'));
  const savedBpm = JSON.parse(localStorage.getItem('bpm'));

  // Categories from DB
  const [sampleList, setSampleList] = useState([]);
  const [bankList, setBanklist] = useState([]);

  // State of tracks and pads
  const [gridSize, setGridSize] = useState(savedGridSize ? savedGridSize : 16); // Grid size in number of beats
  const [precision, setPrecision] = useState(savedPrecision ? savedPrecision : 1);
  const [trackList, setTrackList] = useState(savedTrackList ? savedTrackList.trackList : []);
  const [pads, setPads] = useState(savedPads ? savedPads : []);
  const [trackCounter, setTrackCounter] = useState(savedTrackList ? savedTrackList.trackCounter : trackList.length);

  // Audio control
  const [isPlaying, setIsPlaying] = useState(false);
  const [pos, setPos] = useState(0);
  const [bpm, setBpm] = useState(savedBpm ? savedBpm : 220);

  const [activeRows, setActiveRows] = useState(Array(trackList.length).fill(false)); // Tells all tracks if they should play or not
  const [isLooped, setIsLooped] = useState(false); // Necessary for fixing visual delay

  // Dark mode
  const [useDarkMode, setUseDarkMode] = useState(true);

  // ! Everything stops working when i uncomment this, why??
  // const [user, setUser] = useState(null);
  // onAuthStateChanged(auth, (user) => {
  //   if (user) {
  //     setUser(user);
  //   } else {
  //     setUser(null);
  //   }
  // });

  const loopName = 'A really cool loop yo' // TODO change when implementing real loop saving
  const user = 'TEST USER' // TODO change when implementing real loop saving

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
    Tone.start();
    if (isPlaying) {
      clearInterval(timerId);
      setPos(0);
      setActiveRows(Array(trackList.length).fill(false));
      setIsLooped(false);
    }
    setIsPlaying(!isPlaying);
  }

  const timerId = useInterval(tick, isPlaying ? calculateTempo(bpm) * precision : null)

  function tick () {
    let currentPos = pos;
    currentPos++;

    if (currentPos > (gridSize / precision) - 1) {
      currentPos = 0;
      setIsLooped(true);
    }
    setPos(currentPos);

    checkPad();
  }
  // ?? Any way to do this without useInterval hook?
  // If we use tone js we don't need intervals

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
    localStorage.setItem('bpm', JSON.stringify(newBpm));
  }

  function changeGridSize (event) {
    const newSize = Number(event.target.value);
    if (isPlaying && newSize < gridSize && pos > newSize) togglePlaying();
    setGridSize(newSize);
    localStorage.setItem('gridSize', JSON.stringify(newSize));
  }

  function changePrecision (event) {
    const newPrecision = Number(event.target.value);
    if (isPlaying) togglePlaying();
    const padsCopy = [...pads];
    const factor = precision / newPrecision;
    let newPads;

    if (factor > 1) {
      newPads = padsCopy.map(padRow => padRow.map(pad => {
        const splitPadArr = Array(factor - 1).fill(0);
        splitPadArr.unshift(pad);
        return splitPadArr;
      }).flat());

    } else if (factor < 1) {
      newPads = padsCopy.map(padRow => {
        const joinedPadArr = [];
        for( let i = 0; i < padRow.length; i += (1 / factor) ) {
          joinedPadArr.push(padRow[i]);
        }
        return joinedPadArr;
      });
    } else {
      return;
    }
    setPads(newPads);
    setPrecision(newPrecision);

    localStorage.setItem('pads', JSON.stringify(newPads));
    localStorage.setItem('precision', JSON.stringify(newPrecision));
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
    console.log('PADCLICK at row ', rowIndex, 'position ', id);
  }

  function handleClickNewTrack () {
    const trackListCopy = [...trackList];
    trackListCopy.push(`Track ${ trackCounter + 1 }`);
    setTrackCounter(trackCounter + 1);

    const padsCopy = [...pads];
    padsCopy.push(Array(32 / precision).fill(0));

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



  // TODO Move this up
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
    // TODO MOVE THEME PROVIDER UP
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <div
        style={{
          backgroundColor: useDarkMode ? 'rgb(35, 35, 35)' : 'rgb(220 220 220)',
        }}
      >
        <div className='loop-name-container'>
          <h4
            style={{
              color: useDarkMode ? 'rgb(180 180 180)' : 'rgb(70, 70, 70)',
              backgroundColor: useDarkMode ? 'rgb(57 57 57)' : 'rgb(190 190 190)'
            }}
          >
            {loopName}
          </h4>
        </div>

        <Button
          onClick={() => user ? navigate('/dashboard') : navigate('/')} // TODO check if user is logged in, take them
          variant='contained'
          size='small'
          sx={{
            backgroundColor: useDarkMode ? 'rgb(60 60 60)' : 'rgb(101 101 101)',
            position: 'absolute',
            top: 15,
            right: 10
          }}
        >
          {user ? 'DASHBOARD' : 'LOG IN'}
        </Button>

        <IconButton
        aria-label="dark-mode"
        size="small"
        onClick={() => setUseDarkMode(!useDarkMode) }
        sx={{
          position: 'absolute',
          top: 15,
          right: 150
        }}
        >
          <DarkModeIcon/>
        </IconButton>

      </div>

      <div className='Sequencer'>
        <div
          style={{
            backgroundColor: useDarkMode ? 'rgb(40, 40, 40)' : 'rgb(230 230 230)'
          }}
        >
          <Controls
            playing={isPlaying}
            togglePlaying={togglePlaying}
            handleTempoChange={changeBpm}
            bpm={bpm}
            useDarkMode={useDarkMode}
            setUseDarkMode={setUseDarkMode}
            gridSize={gridSize}
            handleGridSizeChange={changeGridSize}
            precision={precision}
            handlePrecisionChange={changePrecision}
          />
        </div>

          <div className='pads-container'>
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
              precision={precision}
              useDarkMode={useDarkMode}
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

export default Sequencer;