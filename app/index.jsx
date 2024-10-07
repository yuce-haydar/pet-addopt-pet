import { Text, View, StyleSheet } from "react-native";
import { Redirect, useRootNavigationState } from "expo-router";
import { useEffect, useState } from "react";
import { auth } from './../config/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const rootNavigationState = useRootNavigationState();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // AsyncStorage ile oturum bilgisini kontrol etme
    const checkUserSession = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Oturum kontrolü sırasında hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUserSession();

    // Firebase ile oturum durumunu dinleme
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await AsyncStorage.setItem('user', JSON.stringify(currentUser)); // Oturum bilgisini sakla
      } else {
        setUser(null);
        await AsyncStorage.removeItem('user'); // Oturum kapandığında bilgiyi sil
      }
    });

    // Oturum durumunu dinlemeyi durdurmak için cleanup fonksiyonu
    return () => unsubscribe();
  }, [rootNavigationState]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {user && <Text>{user.displayName}</Text>}

      {/* Kullanıcı giriş yaptıysa ana sayfaya, yapmadıysa login sayfasına yönlendir */}
      {user ? <Redirect href="/(tabs)/home" /> : <Redirect href="/login" />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
