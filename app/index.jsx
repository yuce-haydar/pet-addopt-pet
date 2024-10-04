import { Text, View, StyleSheet } from "react-native";
import { Redirect, useRootNavigationState } from "expo-router";
import { useEffect, useState } from "react";
import { auth } from './../config/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

export default function Index() {
  const rootNavigationState = useRootNavigationState();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Firebase ile oturum durumunu dinleme
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Oturum durumunu dinlemeyi durdurmak için cleanup fonksiyonu
    return () => unsubscribe();
  }, [rootNavigationState]);

  return (
    <View style={styles.container}>
      {user && <Text>{user.displayName}</Text>}

      {/* Kullanıcı giriş yaptıysa ana sayfaya, yapmadıysa login sayfasına yönlendir */}
      {user ? <Redirect href="/(tabs)" /> : <Redirect href="/login" />}
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
