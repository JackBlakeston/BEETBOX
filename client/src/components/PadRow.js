import { useEffect, useState } from 'react';
import useSound from 'use-sound';
import { getSampleName, getRefByPath, getSampleUrl, getRefByName } from '../audio-service';

import Pad from './Pad';

function PadRow ({pads, pos, toggleActive, isTriggering, rowIndex, isLooped, sampleList, handleClickDelete, trackId}) {

  const placeholderUrl = 'https://firebasestorage.googleapis.com/v0/b/jb-drum-sequencer.appspot.com/o/Samples%2FPlaceholder.wav?alt=media&token=07570a97-669a-4968-96e5-53f37a6210db';

  const previousConfig = JSON.parse(localStorage.getItem(`${trackId}`));

  const [url, setUrl] = useState(previousConfig ? previousConfig.url : placeholderUrl);
  const [sampleRef, setSampleRef] = useState(previousConfig ? previousConfig.ref : '')
  const [sampleName, setSampleName] = useState(previousConfig ? previousConfig.name : 'No sample loaded');

  // TODO change this for howlerjs lib
  const [playSound] = useSound(url);

  useEffect(() => {
    if (isTriggering) {
      playSound();
    }
  }, [pos, isTriggering, playSound]);

  async function handleClickList (event) {
    const newName = event.target.value;

    const newRef = getRefByName(newName + '.wav');
    const newUrl = await getSampleUrl(newRef);

    setSampleName(newName);
    setUrl(newUrl);
    setSampleRef(newRef);

    localStorage.setItem(`${trackId}`, JSON.stringify({
      name: newName,
      url: newUrl,
      ref: newRef
    }));
  }

  return (
    <div className='row-container'>
      <button onClick={() => handleClickDelete(rowIndex) }>Del</button>
      {sampleList &&
        <select value={sampleName} onChange={handleClickList}>
           <option hidden value="">{sampleName}</option>
          {sampleList.map(ref => {
            return <option key={ref.name} label={getSampleName(ref)} value={getSampleName(ref)} >{ getSampleName(ref) }</option>
          })}
        </select>}
      <div className='row'>
        {sampleRef && pads.map((pad, index) => {
          return <Pad
            key={index}
            rowIndex={rowIndex}
            id={index}
            state={pad}
            pos={ pos === 0 && isLooped ? 15 : pos - 1 } // Fixes visual delay
            toggleActive={() => toggleActive(rowIndex, index)} />
        })}
      </div>
    </div>

  )
}

export default PadRow;