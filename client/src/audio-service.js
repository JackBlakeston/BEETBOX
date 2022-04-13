import { initializeApp } from 'firebase/app';
import { getStorage, ref, getDownloadURL, listAll } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyAUTPulZ7brvcaL_VrU2BZ9B9zC4WihYvg",
  authDomain: "jb-drum-sequencer.firebaseapp.com",
  projectId: "jb-drum-sequencer",
  storageBucket: "jb-drum-sequencer.appspot.com",
  messagingSenderId: "1061179749725",
  appId: "1:1061179749725:web:944192655c039a90a7e4b4"
};

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp, "gs://jb-drum-sequencer.appspot.com/");

const samplesPath = 'Samples/';

const SamplesRef = ref(storage, samplesPath);


export async function getAllUrls () {
  const list = (await listAll(SamplesRef)).items;

  const urlList = list.map(async (element, index) => {
    const elementPath = element._location.path;
    const elementRef = ref(storage, elementPath);

    return {
      url: await getDownloadURL(elementRef),
      rowPosition: index,
      name: elementRef.name.replace('.wav', ''),
    }
  });
  return (await Promise.all(urlList));
}

export async function getSampleList () {
  const refList = (await listAll(SamplesRef)).items;

  // const refList = list.map(element => {
  //   const elementPath = element._location.path;
  //   return ref(storage, elementPath);
  // });


  const filteredList = refList.filter(ref => ref.name !== 'Placeholder.wav');

  return filteredList;
}

export function getRefByPath (samplePath) {
  return ref(storage, samplePath);
}

export function getRefByName (sampleName) {
  return ref(SamplesRef, sampleName);
}

export async function getSampleUrl (sampleRef) {
  return await getDownloadURL(sampleRef);
}

export function getSampleName (sampleRef) {
  return sampleRef.name.replace('.wav', '');
}