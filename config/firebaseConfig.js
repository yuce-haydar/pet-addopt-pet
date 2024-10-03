// firebaseConfig.js

// Firebase SDK'sını uyumluluk katmanıyla birlikte içe aktarın
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

// Firebase projenizin yapılandırma ayarları
const firebaseConfig = {
  apiKey: "AIzaSyCQFdJm67qIWsX2x-g4CUW193hOuWxUa0s",
  authDomain: "pet-opt.firebaseapp.com",
  projectId: "pet-opt",
  storageBucket: "pet-opt.appspot.com",
  messagingSenderId: "641953943830",
  appId: "1:641953943830:web:a7ad07bba5073ff0bbc037",
  measurementId: "G-574V769P1R"
};

// Firebase'i başlatın
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Firestore ve Storage referanslarını alın
const db = firebase.firestore();
const storage = firebase.storage();

// firebase, db ve storage'ı dışa aktarın
export { firebase, db, storage };
