// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDXJarPccaQLNpm711Jss1o2938KlSD_5k",
  authDomain: "capstoneg10-31f40.firebaseapp.com",
  projectId: "capstoneg10-31f40",
  storageBucket: "capstoneg10-31f40.appspot.com",
  messagingSenderId: "365702827260",
  appId: "1:365702827260:web:c8adcc4672212889c5db79",
  measurementId: "G-5L1WV7BZCD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


export { auth };