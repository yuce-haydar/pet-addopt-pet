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

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Hata', 'Şifreler eşleşmiyor!');
      return;
    }

    try {
      // Firebase Authentication ile kullanıcı oluşturma
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const currentUser = userCredential.user;

      // Kullanıcı profilini güncelleme
      await updateProfile(currentUser, {
        displayName: displayName,
      });

      // Kullanıcı bilgilerini Firestore'da saklama
      await setDoc(doc(db, 'Users', currentUser.uid), { // 'uid' ile kullanıcı dokümanı oluşturuluyor
        displayName: displayName,
        email: email,
        phoneNumber: phoneNumber,
        birthDate: birthDate,
        createdAt: new Date(),
      });

      // Kullanıcı oturum bilgisini AsyncStorage'da sakla
      await AsyncStorage.setItem('user', JSON.stringify(currentUser));
      setUser(currentUser); // Kullanıcı bilgisini state'de sakla
      Alert.alert('Başarılı', 'Kayıt başarılı!');
    } catch (error) {
      Alert.alert('Hata', `Kayıt sırasında hata oluştu: ${error.message}`);
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
        placeholder="Doğum Tarihi"
        value={birthDate}
        onChangeText={setBirthDate}
        style={styles.input}
      />
      <Button title="Kayıt Ol" onPress={handleRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    padding: 10,
    marginBottom: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
});
