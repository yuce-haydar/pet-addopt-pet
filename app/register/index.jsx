import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { auth, db } from './../../config/firebaseConfig'; // Firebase Auth ve Firestore
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from 'expo-router'; // Expo-router için

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Şifrelerin eşleşip eşleşmediğini kontrol etme
    if (password !== confirmPassword) {
      Alert.alert('Hata', 'Şifreler eşleşmiyor!');
      return;
    }

    try {
      setLoading(true); // Yüklenme durumunu başlat
      // Firebase Authentication ile kullanıcı oluşturma
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const currentUser = userCredential.user;

      // Kullanıcı profilini güncelleme (displayName)
      await updateProfile(currentUser, {
        displayName: displayName,
      });

      // Kullanıcı bilgilerini Firestore'da saklama
      await setDoc(doc(db, 'Users', currentUser.uid), {
        displayName: displayName,
        email: email,
        phoneNumber: phoneNumber,
        birthDate: birthDate,
        createdAt: new Date(),
      });

      // Kullanıcı oturum bilgisini AsyncStorage'da sakla
      await AsyncStorage.setItem('user', JSON.stringify({
        uid: currentUser.uid,
        displayName: displayName,
        email: email,
      }));

      setUser(currentUser); // Kullanıcı bilgisini state'de sakla
      Alert.alert('Başarılı', 'Kayıt başarılı!');
    } catch (error) {
      Alert.alert('Hata', `Kayıt sırasında hata oluştu: ${error.message}`);
    } finally {
      setLoading(false); // Yüklenme durumunu durdur
    }
  };

  // Kullanıcı giriş yaptıysa ana sayfaya yönlendirme
  if (user) {
    return <Redirect href="/(tabs)/home" />;
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="E-posta"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Şifre"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        placeholder="Şifreyi Onayla"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        placeholder="Ad Soyad"
        value={displayName}
        onChangeText={setDisplayName}
        style={styles.input}
      />
      <TextInput
        placeholder="Telefon Numarası"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        style={styles.input}
        keyboardType="phone-pad"
      />
      <TextInput
        placeholder="Doğum Tarihi (GG/AA/YYYY)"
        value={birthDate}
        onChangeText={setBirthDate}
        style={styles.input}
      />
      <Button title={loading ? 'Kayıt Yapılıyor...' : 'Kayıt Ol'} onPress={handleRegister} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 15,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
});
