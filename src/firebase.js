// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDVeVm5wjsKy0BWVbQ8bwXOp8D2x0q8dqo",
  authDomain: "meu-tcc-final.firebaseapp.com",
  projectId: "meu-tcc-final",
  storageBucket: "meu-tcc-final.appspot.com",
  messagingSenderId: "829628288257",
  appId: "1:829628288257:web:0a794139e0b30213dd5f00"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db= getFirestore();