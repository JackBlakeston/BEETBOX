import { useEffect, useState } from 'react';
import useSound from 'use-sound';

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



function PadRow ({pads, pos, toggleActive, isTriggering, rowIndex, isLooped, handleClickDelete, trackId, bankList, gridSize}) {

  const placeholderUrl = 'https://firebasestorage.googleapis.com/v0/b/jb-drum-sequencer.appspot.com/o/Samples%2FPlaceholder.wav?alt=media&token=07570a97-669a-4968-96e5-53f37a6210db';

  const previousConfig = JSON.parse(localStorage.getItem(`${trackId}`));

  const [url, setUrl] = useState(previousConfig ? previousConfig.sampleUrl : placeholderUrl);
  const [samplePath, setSamplePath] = useState(previousConfig ? previousConfig.samplePath : '')
  const [sampleName, setSampleName] = useState(previousConfig ? previousConfig.sampleName : 'No sample');

  const [bankName, setBankName] = useState(previousConfig ? previousConfig.bankName : 'No bank');
  const [bankPath, setBankPath] = useState(previousConfig ? previousConfig.bankPath : '');

  const [sampleList, setSampleList] = useState([]);

  // TODO change this for howlerjs lib
  const [playSound] = useSound(url);

  useEffect(() => {
    if (bankPath) {
      getSamplesInBank(bankPath).then(list => {
        setSampleList(list);
      });
    }
  }, [bankPath]);

  useEffect(() => {
    if (isTriggering) {
      playSound();
    }
  }, [pos, isTriggering, playSound]);

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
      bankName: bankName
    }));
  }

  async function handleBankChange (event) {
    console.log(event.target.value)
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
      bankName: newBankName
    }));
  }

  return (
    <div className='row-container'>

      <IconButton aria-label="delete" size="small" onClick={() => handleClickDelete(rowIndex) }>
        <DeleteIcon fontSize="inherit" />
      </IconButton>

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

      <div className='row'>
        {samplePath && pads.slice(0, gridSize).map((pad, index) => {
          return <Pad
            key={index}
            rowIndex={rowIndex}
            id={index}
            state={pad}
            pos={ pos === 0 && isLooped ? gridSize - 1 : pos - 1 } // Fixes visual delay
            toggleActive={() => toggleActive(rowIndex, index)}
          />
        })}
      </div>
    </div>

  )
}

export default PadRow;