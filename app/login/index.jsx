import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text } from 'react-native';
import { auth } from './../../config/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect, Link } from 'expo-router'; // Link'i import ediyoruz

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  const handleLogin = async () => {
    try {
      // Firebase ile kullanıcı giriş yapma
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const currentUser = userCredential.user;

      // Kullanıcı oturum bilgisini AsyncStorage'a kaydet
      await AsyncStorage.setItem('user', JSON.stringify(currentUser));
      setUser(currentUser); // Kullanıcı bilgisini state'de sakla
      Alert.alert('Başarılı', 'Giriş başarılı!');
    } catch (error) {
      Alert.alert('Hata', `Giriş sırasında hata oluştu: ${error.message}`);
    }
  };

  // Kullanıcı giriş yaptıysa ana sayfaya yönlendirme
  if (user) {
    return <Redirect href="/" />;
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
      <Button title="Giriş Yap" onPress={handleLogin} />

      {/* Kayıt Ol linki */}
      <Link href="/register" style={styles.registerLink}>
        <Text style={styles.registerText}>Hesabınız yok mu? Kayıt Olun</Text>
      </Link>
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
  registerLink: {
    marginTop: 20,
  },
  registerText: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});
