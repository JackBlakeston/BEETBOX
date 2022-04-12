import { useEffect, useState } from 'react';
import useSound from 'use-sound';
import { getSampleName, getSampleRef, getSampleUrl } from '../audio-service';

import Pad from './Pad';

function PadRow ({defaultUrl, pads, pos, toggleActive, isTriggering, rowIndex, defaultSampleName, isLooped, sampleList}) {

  // TODO change this for howlerjs lib

  const [url, setUrl] = useState(defaultUrl);
  const [sampleName, setSampleName] = useState(defaultSampleName);

  const [playSound, exposedData] = useSound(url);

  useEffect(() => {
    if (isTriggering) {
      playSound();
    }
  }, [pos, isTriggering, playSound]);

  async function handleClickList (event) {
    const samplePath = event.target.value;
    console.log('exposed data: ', exposedData);

    const newRef = getSampleRef(samplePath);
    const newName = getSampleName(newRef);
    const newUrl = await getSampleUrl(newRef);

    setSampleName(newName);
    setUrl(newUrl);
  }

  return (
    <div className='row-container'>
      {sampleList &&
        <select onChange={handleClickList}>
          {sampleList.map(sampleRef => {
            return <option key={sampleRef.name} value={sampleRef} >{ getSampleName(sampleRef) }</option>
          })}
        </select>}
      <p>{sampleName}</p>
      <div className='row'>
        {pads.map((pad, index) => {
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