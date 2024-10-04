import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { login } from './../../config/firebaseAuthConfig'; // Giriş fonksiyonunu import ediyoruz
import { Link, useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native'; // useNavigation'u ekledik

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation(); // Navigation'u kullanmak için hook'u çağırın
  const router=useRouter();
  const handleLogin = async () => {
    try {
      await login(email, password);
      alert('Giriş başarılı!');
      
      // Giriş başarılı olduğunda home sayfasına yönlendir
     router.push('/(tabs)/home');
    } catch (error) {
      alert('Giriş sırasında hata oluştu: ' + error.message);
    }
  };

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

      {/* Kayıt ekranına yönlendiren bağlantı */}
      <View style={styles.registerContainer}>
        <Text>Hesabınız yok mu?</Text>
        <Link href="/register" style={styles.registerLink}>Kayıt Ol</Link>
      </View>
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
  registerContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerLink: {
    color: 'blue',
    marginTop: 5,
  },
});
