// firebaseConfig.js

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage'ı import edin

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


// Firebase uygulamasını başlat
const app = initializeApp(firebaseConfig);

// Firebase Auth'u AsyncStorage ile başlatın
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Firestore ve Storage'ı başlatın
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage, auth };