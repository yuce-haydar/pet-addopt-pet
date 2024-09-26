// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCQFdJm67qIWsX2x-g4CUW193hOuWxUa0s",
  authDomain: "pet-opt.firebaseapp.com",
  projectId: "pet-opt",
  storageBucket: "pet-opt.appspot.com",
  messagingSenderId: "641953943830",
  appId: "1:641953943830:web:a7ad07bba5073ff0bbc037",
  measurementId: "G-574V769P1R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);