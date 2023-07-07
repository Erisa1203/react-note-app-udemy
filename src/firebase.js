import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth" 
import { getFirestore } from "firebase/firestore" 


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCm0QNG95TRI3oZTJXKDazP2bEgVthKwCA",
  authDomain: "react-note-app-udemy.firebaseapp.com",
  projectId: "react-note-app-udemy",
  storageBucket: "react-note-app-udemy.appspot.com",
  messagingSenderId: "742054082662",
  appId: "1:742054082662:web:0d8f7293902d60749355a7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider()
const db = getFirestore(app)

export { auth, provider, db }
