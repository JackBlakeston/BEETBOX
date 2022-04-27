import { initializeApp } from 'firebase/app';
import { getStorage, ref as storageRef, getDownloadURL, listAll } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';
import { firebaseConfig } from './config';




const firebaseApp = initializeApp(firebaseConfig);

// TODO separate into 3 files, one for each service

// AUDIO SERVICE //TODO move some of the stuff here into contexts
const storage = getStorage(firebaseApp, 'gs://jb-drum-sequencer.appspot.com/');

const samplesPath = 'Samples/';
const samplesRef = storageRef(storage, samplesPath);

export async function getBankRefList () {
  return (await listAll(samplesRef)).prefixes;
}

export async function getSamplesInBank (bankPath) {
  const bankRef = storageRef(storage, bankPath);
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
export const dbRef = ref(db);

export async function getLoop (ref) {
  const snapshot = await get(ref);
  return snapshot.val();
}