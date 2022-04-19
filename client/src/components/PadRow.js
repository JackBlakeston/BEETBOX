import { useEffect, useRef, useState } from 'react';
import CircularSlider from 'react-circular-slider-svg';
import * as Tone from 'tone';

// Material UI Imports
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

import { getSampleName, getSampleUrl, getRefByPath, getSamplesInBank } from '../audio-service';
import Pad from './Pad';
import { Slider } from '@mui/material';


function PadRow ({pads, pos, toggleActive, isTriggering, rowIndex, isLooped, handleClickDelete, trackId, bankList, gridSize}) {

  const placeholderUrl = 'https://firebasestorage.googleapis.com/v0/b/jb-drum-sequencer.appspot.com/o/Samples%2FPlaceholder.wav?alt=media&token=07570a97-669a-4968-96e5-53f37a6210db';

  const previousConfig = JSON.parse(localStorage.getItem(`${trackId}`));

  const [bankName, setBankName] = useState(previousConfig ? previousConfig.bankName : 'No bank');
  const [bankPath, setBankPath] = useState(previousConfig ? previousConfig.bankPath : '');

  const [sampleList, setSampleList] = useState([]);

  const [url, setUrl] = useState(previousConfig ? previousConfig.sampleUrl : placeholderUrl);
  const [samplePath, setSamplePath] = useState(previousConfig ? previousConfig.samplePath : '')
  const [sampleName, setSampleName] = useState(previousConfig ? previousConfig.sampleName : 'No sample');

  const [trackPanning, setTrackPanning] = useState(previousConfig ? previousConfig.trackPanning : 0);
  const [trackVolume, setTrackVolume] = useState(previousConfig ? previousConfig.trackVolume : 100);

  const player = useRef(null);
  const panner = useRef(new Tone.Panner(trackPanning / 100).toDestination());

  useEffect(() => {
    if (!player.current) {
      player.current = new Tone.Player(url, () => {
        player.current.connect(panner.current);
      }); // No need to do .toDestination() on player when we are using a panner
    } else {
      player.current.load(url);
    }
  }, [url]);

  useEffect(() => {
    if (panner.current) {
      panner.current.pan.rampTo( trackPanning / 100);
    }
  }, [trackPanning]);

  useEffect(() => {
    if (player.current) player.current.volume.value = 25 * Math.log10(trackVolume / 100);
  }, [trackVolume]);

  useEffect(() => {
    if (bankPath) {
      getSamplesInBank(bankPath).then(list => {
        setSampleList(list);
      });
    }
  }, [bankPath]);

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

    setSampleName(newName);
    setUrl(newUrl);
    setSamplePath(newRef.fullPath);

    localStorage.setItem(`${trackId}`, JSON.stringify({
      sampleName: newName,
      sampleUrl: newUrl,
      samplePath: newRef.fullPath,
      bankPath: bankPath,
      bankName: bankName,
      trackVolume: trackVolume,
      trackPanning: trackPanning
    }));
  }

  async function handleBankChange (event) {
    const newBankPath = event.target.value;
    const newBankRef = getRefByPath(newBankPath);
    const newBankName = newBankRef.name;

    setSampleName('No sample');
    setUrl(placeholderUrl);
    setSamplePath('');

    setBankPath(newBankPath);
    setBankName(newBankName);

    localStorage.setItem(`${trackId}`, JSON.stringify({
      sampleName: 'No sample',
      sampleUrl: placeholderUrl,
      samplePath: '',
      bankPath: newBankPath,
      bankName: newBankName,
      trackVolume: trackVolume,
      trackPanning: trackPanning
    }));
  }

  function handleVolumeChange (newVolume) {
    setTrackVolume(newVolume);

    localStorage.setItem(`${trackId}`, JSON.stringify({
      sampleName: sampleName,
      sampleUrl: url,
      samplePath: samplePath,
      bankPath: bankPath,
      bankName: bankName,
      trackVolume: trackVolume,
      trackPanning: trackPanning
    }));
  }

  function handlePanningChange (event) {
    const newPanning = event.target.value;
    setTrackPanning(newPanning);

    localStorage.setItem(`${trackId}`, JSON.stringify({
      sampleName: sampleName,
      sampleUrl: url,
      samplePath: samplePath,
      bankPath: bankPath,
      bankName: bankName,
      trackVolume: trackVolume,
      trackPanning: newPanning,
    }));
  }

  return (
    <div className='row-container'>

      <IconButton aria-label="delete" size="small" onClick={() => handleClickDelete(rowIndex) }>
        <DeleteIcon fontSize="inherit" />
      </IconButton>

      <div className='sound-selector-container'>
      {bankList &&
        <Box sx={{ minWidth: 120 }} className='select-container'>
          <FormControl fullWidth >
          <InputLabel shrink id="demo-simple-select-label">Bank</InputLabel>
          <Select notched className='select' displayEmpty value={bankPath} onChange={handleBankChange} labelId="demo-simple-select-label" id="demo-simple-select" label='Bank'>
            <MenuItem style={{ display: "none" }} disabled value={bankPath}>{bankName || 'No bank'}</MenuItem>
            { bankList.map(ref => {
              return <MenuItem key={ref.name} value={ref.fullPath} >{ getSampleName(ref) }</MenuItem>
            })}
          </Select>
          </FormControl>
        </Box>
      }

      {bankName !== 'No bank' &&
        <Box sx={{ minWidth: 120 }} className='select-container'>
          <FormControl fullWidth >
          <InputLabel shrink id="demo-simple-select-label">Sample</InputLabel>
          <Select notched className='select' displayEmpty value={samplePath} onChange={handleSampleChange} labelId="demo-simple-select-label" id="demo-simple-select" label='Sample'>
            <MenuItem style={{ display: "none" }} disabled value={samplePath}>{sampleName}</MenuItem>
            { sampleList.map(ref => {
              return <MenuItem key={ref.name} value={ref.fullPath} >{ getSampleName(ref) }</MenuItem>
            })}
          </Select>
          </FormControl>
        </Box>
      }
      </div>

      <div className='track-control-container'>
        {sampleName !== 'No sample' &&
          <CircularSlider
          handle1={{
            value: trackVolume,
            onChange: value => handleVolumeChange(value)
          }}
          handleSize={0}
          size={70}
          arcColor="#8e24aa"
          startAngle={40}
          endAngle={320}
          />
        }


        {sampleName !== 'No sample' &&
          <Box className='pan-slider-box' width={50}>
            <Slider
              valueLabelDisplay="auto"
              size='small'
              min={-100}
              max={100}
              step={1}
              value={trackPanning}
              onChange={handlePanningChange}
            />
          </Box>
        }
      </div>

      <div className='row'>
        {pads.slice(0, gridSize).map((pad, index) => {
          return <Pad
            key={index}
            rowIndex={rowIndex}
            id={index}
            state={pad}
            pos={ pos === 0 && isLooped ? gridSize - 1 : pos - 1 } // Fixes visual delay
            toggleActive={() => toggleActive(rowIndex, index)}
            isDisabled={!samplePath}
          />
        })}
      </div>
    </div>

  )
}

export default PadRow;