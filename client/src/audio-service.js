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
      name: elementPath.replace(samplesPath, '').replace('.wav', ''),
    }
  });
  return (await Promise.all(urlList));
}