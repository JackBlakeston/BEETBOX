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
const samplesRef = ref(storage, samplesPath);

export async function getSampleList () {
  const list = (await listAll(samplesRef));
  const rootRefList = list.items;
  const categoryList = list.prefixes;

  const childrenRefList = await Promise.all( categoryList.map(async categoryRef => {
    const list = await listAll(categoryRef);
    return list.items;
  }));

  const concatenatedRefList = rootRefList.concat(childrenRefList).flat();

  const filteredList = concatenatedRefList.filter(ref => ref.name !== 'Placeholder.wav');

  return filteredList;
}

export async function getBankRefList () {
  return (await listAll(samplesRef)).prefixes;
}

export async function getSamplesInBank (bankPath) {
  const bankRef = ref(storage, bankPath)
  return (await listAll(bankRef)).items;
}

export function getRefByPath (samplePath) {
  return ref(storage, samplePath);
}

export function getRefByName (sampleName) {
  return ref(samplesRef, sampleName);
}

export async function getSampleUrl (sampleRef) {
  return await getDownloadURL(sampleRef);
}

export function getSampleName (sampleRef) {
  return sampleRef.name.replace('.wav', '');
}