import React, { useContext, useEffect, useRef, useState } from 'react';
import * as Tone from 'tone';
import { Box, Button } from '@mui/material';
import { useParams } from 'react-router-dom';

import '../App.css'; // TODO change name or refactor all styles
import PadRow from './PadRow';
import MasterControls from './MasterControls/MasterControls';
import { dbRef, getBankRefList } from '../firebase/firebaseService';
import { DarkModeContext, LoopContext, PlaybackContext } from '../contexts';
import { child, get, remove, update } from 'firebase/database';
import calculateTempo from '../utils/calculateTempo';
import useInterval from '../utils/useInterval';
import Navbar from './Navbar/Navbar';


async function getLoop (ref) {
  const snapshot = await get(ref);
  return snapshot.val();
}

const Sequencer = () => {

  let params = useParams();

  const userRef = useRef(child(dbRef, params.uid));
  const loopRef = useRef(child(userRef.current, params.loopid));


  // Loop status
  const { loop, setLoop } = useContext(LoopContext);

  // Dark mode
  const { useDarkMode } = useContext(DarkModeContext);

  // User info

  // Categories from DB
  const [bankList, setBanklist] = useState([]); // TODO CHECK Do we need this here? Probably better in App and passed as context

  // Audio playback
  const [pos, setPos] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const playbackValues = { pos, setPos, isPlaying, togglePlaying };

  useEffect(() => {
    getLoop(loopRef.current).then(data => {
      setLoop({...data, ref: loopRef.current});
    });
  }, [setLoop]);

  useEffect(() => {
    getBankRefList().then(list => {
      setBanklist(list);
    });
  }, []);

  function togglePlaying () {
    Tone.start();
    if (loop?.trackList) {
      if (isPlaying) {
        clearInterval(timerId);
        setPos(-1);
      }
      setIsPlaying(!isPlaying);
    }
  }

  const timerId = useInterval(tick, isPlaying ? calculateTempo(loop.bpm) * loop.precision : null);
  // ?? Any way to do this without useInterval hook?
  // If we use tone js we don't need intervals

  function tick () {
    let currentPos = pos;
    currentPos++;

    if (currentPos > (loop.gridSize / loop.precision) - 1) {
      currentPos = 0;
    }

    setPos(currentPos);
  }

  function toggleActive (rowIndex, id) {
    let padsCopy = [...loop.pads];
    let padState = padsCopy[rowIndex][id];
    if (padState === 1) {
      padsCopy[rowIndex][id] = 0;
    } else {
      padsCopy[rowIndex][id] = 1;
    }

    setLoop({...loop, pads: padsCopy});
    update(loopRef.current, { pads: padsCopy });
  }

  async function handleClickNewTrack () {

    const updatedLoop = await getLoop(loopRef.current);

    setLoop(updatedLoop);

    let updatedTrackList;
    if (updatedLoop.trackList) {
      updatedTrackList = updatedLoop.trackList;
    } else {
      updatedTrackList = {};
    }

    const newTrackId = `Track${(loop.trackCounter + 1).toString().padStart(4, '0')}`;

    const newTrack = {
      id: newTrackId,
      sampleName: 'No sample',
      sampleUrl: '',
      samplePath: '',
      bankPath: '',
      bankName: '',
      trackVolume: -6,
      trackPanning: 0,
      isMuted: false,
      // isSoloed: false,
    };
    updatedTrackList[newTrackId] = newTrack;

    let padsCopy;
    if (loop.pads) {
      padsCopy = [...loop.pads];
    } else {
      padsCopy = [];
    }
    padsCopy.push(Array(32 / loop.precision).fill(0));

    setLoop({...loop, trackList: updatedTrackList, trackCounter: loop.trackCounter + 1, pads: padsCopy});
    update(loopRef.current, { trackList: updatedTrackList, trackCounter: loop.trackCounter + 1, pads: padsCopy });
  }

  function handleClickDelete (trackId, rowIndex) {
    const trackListCopy = {...loop.trackList};

    delete trackListCopy[trackId];

    const padsCopy = [...loop.pads];
    padsCopy.splice(rowIndex, 1);

    setLoop({...loop, trackList: trackListCopy, pads: padsCopy});

    update(loopRef.current, { pads: padsCopy });

    const trackRef = child(loopRef.current, `trackList/${trackId}`);
    remove(trackRef);
  }

  return (
    <>
      <PlaybackContext.Provider value={playbackValues} >
        <div className='sequencer' >
          <Navbar isInSequencer={true}/>
          <div>
            <div
              style={{
                backgroundColor: useDarkMode ? 'rgb(40, 40, 40)' : 'rgb(230 230 230)'
              }}
            >
              { loop && <MasterControls/>}
            </div>

            <div className='pads-container' >
              { loop?.trackList && Object.keys(loop.trackList)?.map((trackId, index) => {
                return <PadRow
                  trackRef={child(loopRef.current, `trackList/${trackId}`)}
                  trackId={trackId}
                  key={trackId}
                  pos={pos}
                  pads={loop?.pads[index]}
                  toggleActive={ toggleActive }
                  handleClickDelete={ handleClickDelete }
                  rowIndex={index}
                  bankList={bankList}
                  gridSize={loop?.gridSize}
                  precision={loop?.precision}
                />;
              }) }
            </div>

            <Box ml={7.2} mt={2} className='new-track-container'>
              <Button
                sx={{
                  border:'1.7px solid #d81a60',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  backgroundColor: useDarkMode && 'rgb(179 20 78 / 14%)',
                  color: useDarkMode && 'white',
                  ':hover': {
                    border:'1.7px solid #d81a60',
                    backgroundColor: useDarkMode ? 'rgb(179 20 78 / 40%)' : 'rgb(231 60 123 / 20%)'
                  }
                }}
                variant={useDarkMode ? 'contained' : 'outlined'}
                className='new-track-button'
                onClick={handleClickNewTrack}
              >
              NEW TRACK
              </Button>
            </Box>

          </div>
        </div>
      </PlaybackContext.Provider>
    </>
  );
};

export default Sequencer;