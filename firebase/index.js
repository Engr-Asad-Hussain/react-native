import Constants from 'expo-constants';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, addDoc, getDocs, updateDoc, deleteDoc } from "firebase/firestore";

const appSec = Constants.expoConfig.extra;

const firebaseConfig = {
  apiKey: appSec.apiKey,
  authDomain: appSec.authDomain,
  projectId: appSec.projectId,
  storageBucket: appSec.storageBucket,
  messagingSenderId: appSec.messagingSenderId,
  appId: appSec.appId,
  measurementId: appSec.measurementId
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db, collection, doc, addDoc, getDocs, updateDoc, deleteDoc }