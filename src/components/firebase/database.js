
import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore"
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBhzeqTaX4qAomLg-SdYIkW2FsXjSXmrIM",
    authDomain: "thunderapp-3d0fa.firebaseapp.com",
    projectId: "thunderapp-3d0fa",
    storageBucket: "thunderapp-3d0fa.appspot.com",
    messagingSenderId: "371922960931",
    appId: "1:371922960931:web:8ab9da342e0fa25aae6796"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);

