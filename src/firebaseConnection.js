import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import {getAuth} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyA4RrN8DMHgjB2ZaTdWZhT1O-9hF0OgNJk",
  authDomain: "curso-78166.firebaseapp.com",
  projectId: "curso-78166",
  storageBucket: "curso-78166.firebasestorage.app",
  messagingSenderId: "850719955074",
  appId: "1:850719955074:web:2b5afbe8ae8d0473d57c9b",
  measurementId: "G-9060TJGN36"
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);


export{ db, auth };