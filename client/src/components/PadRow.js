import { React, useContext, useEffect, useRef, useState } from 'react';
import Knob from './Knob/src/index';
import * as Tone from 'tone';

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { Slider } from '@mui/material';

import { getSampleName, getSampleUrl, getRefByPath, getSamplesInBank } from '../firebase/firebaseService';
import Pad from './Pad';
import { DarkModeContext, LoopContext, PlaybackContext } from '../contexts';
import { get, update } from 'firebase/database';
import SoloButton from './SoloButton/SoloButton';
import MuteButton from './MuteButton/MuteButton';

const PadRow = ({ toggleActive, rowIndex, handleClickDelete, bankList, trackRef }) => {

  const [sampleList, setSampleList] = useState([]);

  const [track, setTrack] = useState();

  const {useDarkMode} = useContext(DarkModeContext);

  const { loop } = useContext(LoopContext);
  const { pos } = useContext(PlaybackContext);

  const tonePlayer = useRef(null);
  const panner = useRef(new Tone.Panner(track?.trackPanning / 100 || 0).toDestination());

  const { pads, gridSize, precision } = loop;

  useEffect(() => {
    async function getTrack (ref) { // TODO export this one and identical one from parent component
      const snapshot = await get(ref);
      return snapshot.val();
    }
    getTrack(trackRef).then(data => {
      setTrack({...data, ref: trackRef});
    });
  }, [trackRef]);

  useEffect(() => {
    if (!tonePlayer.current && track?.sampleUrl) {
      tonePlayer.current = new Tone.Player(track?.sampleUrl, () => {
        tonePlayer.current.connect(panner.current);
      }); // No need to do .toDestination() on player when we are using a panner
    } else if (track?.sampleUrl) {
      tonePlayer?.current?.load(track.sampleUrl);
    }
  }, [track?.sampleUrl]);

  useEffect(() => {
    if (panner.current && track?.trackPanning) {
      panner.current.pan.rampTo( track?.trackPanning / 100 || 0);
    }
  }, [track?.trackPanning]);

  useEffect(() => {
    if (tonePlayer.current && track?.trackVolume) tonePlayer.current.volume.value = track.trackVolume;
  }, [track?.trackVolume]);

  useEffect(() => {
    if (track?.bankPath) {
      getSamplesInBank(track?.bankPath).then(list => {
        setSampleList(list);
      });
    }
  }, [track?.bankPath]);

  useEffect(() => {
    if ( pads[rowIndex][pos] === 1 && !track.isMuted ) {
      if (!loop.soloedTracks || loop.soloedTracks.length === 0) {
        // Plays the current sample
        tonePlayer.current?.start();
      } else if (loop.soloedTracks?.includes(track.id)) {
        tonePlayer.current?.start();
      }
    }
  }, [pos, tonePlayer]);

  async function handleSampleChange (event) {
    const newPath = event.target.value;

    const newRef = getRefByPath (newPath);
    const newName = getSampleName(newRef);
    const newUrl = await getSampleUrl(newRef);

    const newProps = {
      sampleName: newName,
      sampleUrl: newUrl,
      samplePath: newRef.fullPath
    };

    setTrack({...track, ...newProps});
    update(trackRef, newProps);
  }

  async function handleBankChange (event) {
    const newBankPath = event.target.value;
    const newBankRef = getRefByPath(newBankPath);
    const newBankName = newBankRef.name;

    const newProps = {
      sampleName: 'No sample',
      sampleUrl: '',
      samplePath: '',
      bankPath: newBankPath,
      bankName: newBankName,
    };

    setTrack({...track, ...newProps});
    update(trackRef, newProps);
  }

  function handleVolumeChange (newVolume) {

    setTrack({...track, trackVolume: newVolume});
    update(trackRef, {trackVolume: newVolume});
  }

  function handlePanningChange (event) {
    const newPanning = event.target.value;

    setTrack({...track, trackPanning: newPanning});
    update(trackRef, {trackPanning: newPanning});
  }

  return (
    <div className='row-container '>

      <div
        className={'delete-icon-container '}
      >
        <IconButton
          aria-label="delete"
          size="small"
          onClick={() => handleClickDelete(track.id, rowIndex)}
          sx={{
            '&:hover': {
              backgroundColor: useDarkMode ? '#d81a609c' : '#d81a6073',
            },
          }}
        >
          <DeleteIcon fontSize="inherit" />
        </IconButton>
      </div>

      <div
        className={'sound-selector-container '}
      >
        {track && bankList &&
        <Box sx={{ minWidth: 120 }} className='select-container'>
          <FormControl fullWidth >
            <InputLabel shrink>Bank</InputLabel>
            <Select notched className='select' displayEmpty value={track.bankPath} onChange={handleBankChange} labelId="demo-simple-select-label" id="demo-simple-select" label='Bank'>
              <MenuItem style={{ display: 'none' }} disabled value={track.bankPath}>{track.bankName || 'No bank'}</MenuItem>
              { bankList.map(ref => {
                return <MenuItem key={ref.name} value={ref.fullPath} >{ getSampleName(ref) }</MenuItem>;
              })}
            </Select>
          </FormControl>
        </Box>
        }

        {track && track.bankName !== 'No bank' &&
        <Box sx={{ minWidth: 120 }} className='select-container'>
          <FormControl fullWidth >
            <InputLabel shrink >Sample</InputLabel>
            <Select disabled={!track.bankPath} notched className='select' displayEmpty value={track.samplePath} onChange={handleSampleChange} labelId="demo-simple-select-label" id="demo-simple-select" label='Sample'>
              <MenuItem style={{ display: 'none' }} disabled value={track.samplePath}>{track.sampleName}</MenuItem>
              { sampleList.map(ref => {
                return <MenuItem key={ref.name} value={ref.fullPath} >{ getSampleName(ref) }</MenuItem>;
              })}
            </Select>
          </FormControl>
        </Box>
        }
      </div>

      <div
        className={'track-control-container '}
      >
        {track && track.sampleName !== 'No sample' &&
          <Knob
            unit="dB"
            defaultPercentage={(track.trackVolume + 50) / 50}
            onChange={handleVolumeChange}
            value={track.trackVolume}
            bg={useDarkMode ? 'rgb(67 67 67)' : 'rgb(205 205 205)'}
            fg='#d81a60'
            mouseSpeed={7}
            transform={p => parseInt(p * 50, 10) - 50}
            style={{
              height: '60px',
              color: useDarkMode ? 'rgb(159 159 159)' : 'rgb(129 128 128)',
              fontFamily: 'Roboto',
              cursor: 'grab'
            }}
          />
        }


        {track && track.sampleName !== 'No sample' &&
          <Box
            className='pan-slider-box'
            width={70}
            sx={{
              color: useDarkMode ? 'rgb(159 159 159)' : 'rgb(95 95 95)',
            }}
          >
            <label>L</label>
            <Slider
              valueLabelDisplay="auto"
              track={false}
              size='small'
              min={-100}
              max={100}
              step={5}
              value={track.trackPanning}
              onChange={handlePanningChange}
              sx={{
                '& .MuiSlider-thumb': {
                  height: 10,
                  width: 2,
                  borderRadius: 0,
                  '&:hover': {
                    boxShadow: 'unset',
                  }
                },
              }}
            />
            <label>R</label>
          </Box>
        }

        {track && track.sampleName !== 'No sample' &&
          <div className='mute-solo-container'>
            <SoloButton track={track}/>
            <MuteButton track={track} setTrack={setTrack}/>
          </div>
        }
      </div>

      <div className='row'>
        {track && pads[rowIndex].slice(0, gridSize / precision).map((pad, index) => {
          return <Pad
            key={index}
            rowIndex={rowIndex}
            id={index}
            state={pad}
            pos={ pos }
            toggleActive={() => toggleActive(rowIndex, index)}
            isDisabled={!track.samplePath}
            precision={precision}
          />;
        })}
      </div>
    </div>

  );
};

export default PadRow;