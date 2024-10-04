// auth.js
import { auth, firestore } from './firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

// Kullanıcıyı kaydet ve Firestore'a ekle
export const register = async (email, password, fullName, birthDate) => {
    try {
      // Kullanıcıyı Firebase Authentication'a kaydet
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Kullanıcı profilini güncelle (Firebase Authentication içinde)
      await updateProfile(user, { displayName: fullName });
  
      // Kullanıcı bilgilerini Firestore'a kaydet
      await setDoc(doc(db, 'Users', user.uid), {
        email: email,
        name: fullName,
        password: password,
        birthDate: birthDate,
        createdAt: new Date(),
      });
  
      console.log('Kullanıcı kaydı başarılı:', user);
      return user;
    } catch (error) {
      console.error('Kayıt hatası:', error);
      throw error;
    }
  };
  
  // Kullanıcıyı giriş yaptır
  export const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Giriş başarılı:', userCredential.user);
      return userCredential.user;
    } catch (error) {
      console.error('Giriş hatası:', error);
      throw error;
    }
  };
