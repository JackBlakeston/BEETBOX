import { initializeApp } from 'firebase/app';
import { getStorage, ref as storageRef, getDownloadURL, listAll } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getDatabase, ref as databaseRef } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAUTPulZ7brvcaL_VrU2BZ9B9zC4WihYvg",
  authDomain: "jb-drum-sequencer.firebaseapp.com",
  projectId: "jb-drum-sequencer",
  storageBucket: "jb-drum-sequencer.appspot.com",
  messagingSenderId: "1061179749725",
  appId: "1:1061179749725:web:944192655c039a90a7e4b4",
  databaseURL: "https://jb-drum-sequencer-default-rtdb.europe-west1.firebasedatabase.app",
};

const firebaseApp = initializeApp(firebaseConfig);


// AUDIO SERVICE //TODO move some of the stuff here into contexts
const storage = getStorage(firebaseApp, "gs://jb-drum-sequencer.appspot.com/");

const samplesPath = 'Samples/';
const samplesRef = storageRef(storage, samplesPath);

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
  const bankRef = storageRef(storage, bankPath)
  return (await listAll(bankRef)).items;
}

export function getRefByPath (samplePath) {
  return storageRef(storage, samplePath);
}

export function getRefByName (sampleName) {
  return storageRef(samplesRef, sampleName);
}

export async function getSampleUrl (sampleRef) {
  return await getDownloadURL(sampleRef);
}

export function getSampleName (sampleRef) {
  return sampleRef.name.replace('.wav', '');
}


// AUTH SERVICE
export const auth = getAuth(firebaseApp);


// DATABASE SERVICE
export const db = getDatabase(firebaseApp);
export const dbRef = databaseRef(db);