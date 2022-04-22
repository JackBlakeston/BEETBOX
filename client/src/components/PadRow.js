import { useContext, useEffect, useRef, useState } from 'react';
import Knob from "./Knob/src/index";
// import Knob from "react-simple-knob";
import * as Tone from 'tone';

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { Slider } from '@mui/material';

import { getSampleName, getSampleUrl, getRefByPath, getSamplesInBank } from '../FirebaseService';
import Pad from './Pad';
import { DarkModeContext } from '../contexts';
import { get, update } from 'firebase/database';


function PadRow ({pads, pos, toggleActive, isTriggering, rowIndex, isLooped, handleClickDelete, bankList, gridSize, precision, trackRef}) {

  // TODO delete placeholder from storage
  // const placeholderUrl = 'https://firebasestorage.googleapis.com/v0/b/jb-drum-sequencer.appspot.com/o/Samples%2FPlaceholder.wav?alt=media&token=07570a97-669a-4968-96e5-53f37a6210db';

  // const previousConfig = JSON.parse(localStorage.getItem(`${trackId}`));

  // const [bankName, setBankName] = useState(previousConfig ? previousConfig.bankName : 'No bank');
  // const [bankPath, setBankPath] = useState(previousConfig ? previousConfig.bankPath : '');

  const [sampleList, setSampleList] = useState([]);

  // const [url, setUrl] = useState(previousConfig ? previousConfig.sampleUrl : '');
  // const [samplePath, setSamplePath] = useState(previousConfig ? previousConfig.samplePath : '')
  // const [sampleName, setSampleName] = useState(previousConfig ? previousConfig.sampleName : 'No sample');

  // const [trackPanning, setTrackPanning] = useState(previousConfig ? previousConfig.trackPanning : 0);
  // const [trackVolume, setTrackVolume] = useState(previousConfig ? previousConfig.trackVolume : -6);

  const [track, setTrack] = useState();

  const {useDarkMode} = useContext(DarkModeContext);

  const player = useRef(null);
  const panner = useRef(new Tone.Panner(track?.trackPanning / 100 || 0).toDestination());

  useEffect(() => {
    async function getTrack (ref) { // TODO export this one and identical one from parent component
      const snapshot = await get(ref);
      return snapshot.val();
    }
    getTrack(trackRef).then(data => {
      setTrack(data);
    });
  }, [trackRef, setTrack]);


  useEffect(() => {
    if (!player.current) {
      player.current = new Tone.Player(track?.sampleUrl, () => {
        player.current.connect(panner.current);
      }); // No need to do .toDestination() on player when we are using a panner
    } else {
      player.current?.load(track?.sampleUrl);
    }
  }, [track?.sampleUrl]);

  useEffect(() => {
    if (panner.current && track?.trackPanning) {
      panner.current.pan.rampTo( track?.trackPanning / 100 || 0);
    }
  }, [track?.trackPanning]);

  useEffect(() => {
    if (player.current && track?.trackVolume) player.current.volume.value = track.trackVolume;
  }, [track?.trackVolume]);

  useEffect(() => {
    if (track?.bankPath) {
      getSamplesInBank(track?.bankPath).then(list => {
        setSampleList(list);
      });
    }
  }, [track?.bankPath]);

  useEffect(() => {
    if (isTriggering) {
      player.current?.start();
    }
  }, [pos, isTriggering, player]);



  async function handleSampleChange (event) {
    const newPath = event.target.value;

    const newRef = getRefByPath (newPath);
    const newName = getSampleName(newRef);
    const newUrl = await getSampleUrl(newRef);

    const newProps = {
      sampleName: newName,
      sampleUrl: newUrl,
      samplePath: newRef.fullPath
    }

    setTrack({...track, ...newProps});
    update(trackRef, newProps);

    // localStorage.setItem(`${trackId}`, JSON.stringify({
    //   sampleName: newName,
    //   sampleUrl: newUrl,
    //   samplePath: newRef.fullPath,
    //   bankPath: bankPath,
    //   bankName: bankName,
    //   trackVolume: trackVolume,
    //   trackPanning: trackPanning
    // }));
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
    }

    setTrack({...track, ...newProps});
    update(trackRef, newProps);

    // localStorage.setItem(`${trackId}`, JSON.stringify({
    //   sampleName: 'No sample',
    //   sampleUrl: '',
    //   samplePath: '',
    //   bankPath: newBankPath,
    //   bankName: newBankName,
    //   trackVolume: trackVolume,
    //   trackPanning: trackPanning
    // }));
  }

  function handleVolumeChange (newVolume) {

    setTrack({...track, trackVolume: newVolume});
    update(trackRef, {trackVolume: newVolume});

    // localStorage.setItem(`${trackId}`, JSON.stringify({
    //   sampleName: sampleName,
    //   sampleUrl: url,
    //   samplePath: samplePath,
    //   bankPath: bankPath,
    //   bankName: bankName,
    //   trackVolume: trackVolume,
    //   trackPanning: trackPanning
    // }));
  }

  function handlePanningChange (event) {
    const newPanning = event.target.value;

    setTrack({...track, trackPanning: newPanning});
    update(trackRef, {trackPanning: newPanning});

    // localStorage.setItem(`${trackId}`, JSON.stringify({
    //   sampleName: sampleName,
    //   sampleUrl: url,
    //   samplePath: samplePath,
    //   bankPath: bankPath,
    //   bankName: bankName,
    //   trackVolume: trackVolume,
    //   trackPanning: newPanning,
    // }));
  }


  return (
    <div className='row-container '>

      <div
        className={'delete-icon '}
      >
        <IconButton
          aria-label="delete"
          size="small"
          onClick={() => handleClickDelete(rowIndex)}
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
          <InputLabel shrink>Bank</InputLabel> {/* CHECK THIS!! */}
          <Select notched className='select' displayEmpty value={track.bankPath} onChange={handleBankChange} labelId="demo-simple-select-label" id="demo-simple-select" label='Bank'>
            <MenuItem style={{ display: "none" }} disabled value={track.bankPath}>{track.bankName || 'No bank'}</MenuItem>
            { bankList.map(ref => {
              return <MenuItem key={ref.name} value={ref.fullPath} >{ getSampleName(ref) }</MenuItem>
            })}
          </Select>
          </FormControl>
        </Box>
      }

      {track && track.bankName !== 'No bank' &&
        <Box sx={{ minWidth: 120 }} className='select-container'>
          <FormControl fullWidth >
          <InputLabel shrink id="demo-simple-select-label">Sample</InputLabel>
          <Select notched className='select' displayEmpty value={track.samplePath} onChange={handleSampleChange} labelId="demo-simple-select-label" id="demo-simple-select" label='Sample'>
            <MenuItem style={{ display: "none" }} disabled value={track.samplePath}>{track.sampleName}</MenuItem>
            { sampleList.map(ref => {
              return <MenuItem key={ref.name} value={ref.fullPath} >{ getSampleName(ref) }</MenuItem>
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
            fg='rgba(142,37,170, 1)'
            mouseSpeed={7}
            transform={p => parseInt(p * 50, 10) - 50}
            style={{
              height: '60px',
              color: useDarkMode ? 'rgb(159 159 159)' : 'rgb(129 128 128)',
              fontFamily: 'Roboto'
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
      </div>

      <div className='row'>
        {track && pads && pads.slice(0, gridSize / precision).map((pad, index) => {
          return <Pad
            key={index}
            rowIndex={rowIndex}
            id={index}
            state={pad}
            pos={ pos === 0 && isLooped ? (gridSize / precision) - 1 : pos - 1 } // Fixes visual delay
            toggleActive={() => toggleActive(rowIndex, index)}
            isDisabled={!track.samplePath}
            precision={precision}
          />
        })}
      </div>
    </div>

  )
}

export default PadRow;