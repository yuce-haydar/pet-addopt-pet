import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { register } from './../../config/firebaseAuthConfig'; // Kayıt fonksiyonunu import ediyoruz

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert('Şifreler eşleşmiyor!');
      return;
    }

    try {
      await register(email, password, fullName, birthDate);
      alert('Kayıt başarılı!');
    } catch (error) {
      alert('Kayıt sırasında hata oluştu: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="E-posta" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Şifre" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <TextInput placeholder="Şifreyi Onayla" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry style={styles.input} />
      <TextInput placeholder="Ad Soyad" value={fullName} onChangeText={setFullName} style={styles.input} />
      <TextInput placeholder="Doğum Tarihi (YYYY-MM-DD)" value={birthDate} onChangeText={setBirthDate} style={styles.input} />

      <Button title="Kayıt Ol" onPress={handleRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});
