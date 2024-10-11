// firebaseConfig.js

import { getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // Doğru şekilde import edildi
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage'ı import edin

// Firebase projenizin yapılandırma ayarları
const firebaseConfig = {
 //yours api key
  
};


let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}
// Firebase Auth'u AsyncStorage ile başlatın
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Firestore ve Storage'ı başlatın
const db = getFirestore(app);
const storage = getStorage(app); // getStorage ile oluşturuyoruz

export { db, storage, auth };