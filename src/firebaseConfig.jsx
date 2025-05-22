// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCnk2H8oWW6RtUT-M0tn0Vz6g5gb2vx0uI",
  authDomain: "todo-app-dedbf.firebaseapp.com",
  projectId: "todo-app-dedbf",
  storageBucket: "todo-app-dedbf.firebasestorage.app",
  messagingSenderId: "253477995765",
  appId: "1:253477995765:web:577ba39957396ba43f71bc",
  measurementId: "G-9BW1HNKK8Q"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
