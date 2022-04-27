import React, { useContext, useEffect, useRef, useState } from 'react';
import * as Tone from 'tone';
import { useParams } from 'react-router-dom';
import { child, remove, update } from 'firebase/database';

import Track from './Track/Track';
import MasterControls from './MasterControls/MasterControls';
import { dbRef, getBankRefList, getLoop } from '../../firebase/firebaseService';
import { LoopContext, PlaybackContext } from '../../contexts';
import { useInterval, calculateTempo } from './utils';
import Navbar from '../Navbar/Navbar';
import NewTrackButton from './NewTrackButton/NewTrackButton';
import classes from './sequencer.module.css';

const Sequencer = () => {

  let params = useParams();

  const userRef = useRef(child(dbRef, params.uid));
  const loopRef = useRef(child(userRef.current, params.loopid));

  const { loop, setLoop } = useContext(LoopContext);

  // TODO CHECK Do we need this here? Probably better in App and passed as context
  // TODO or maybe each track gets its own banklist, dunno
  const [bankList, setBanklist] = useState([]);

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

  // TODO refactor useInterval for Tone js Transport
  const timerId = useInterval(tick, isPlaying ? calculateTempo(loop.bpm) * loop.precision : null);

  function tick () {
    let currentPos = pos;
    currentPos++;

    if (currentPos > (loop.gridSize / loop.precision) - 1) {
      currentPos = 0;
    }
    setPos(currentPos);
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
        <Navbar isInSequencer={true}/>
        <div>
          { loop && <MasterControls/>}

          <div className={classes.padsContainer} >
            { loop?.trackList && Object.keys(loop.trackList)?.map((trackId, index) => {
              return <Track
                trackRef={child(loopRef.current, `trackList/${trackId}`)}
                trackId={trackId}
                key={trackId}
                pos={pos}
                pads={loop?.pads[index]}
                handleClickDelete={ handleClickDelete }
                rowIndex={index}
                bankList={bankList}
                gridSize={loop?.gridSize}
                precision={loop?.precision}
              />;
            }) }
          </div>

          <NewTrackButton/>
        </div>
      </PlaybackContext.Provider>
    </>
  );
};

export default Sequencer;