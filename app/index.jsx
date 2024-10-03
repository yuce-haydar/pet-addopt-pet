import { Text, View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native"; // Navigation için hook
import { Link, Redirect, useRootNavigationState } from "expo-router"; // Eğer Link kullanıyorsanız
import { Colors } from "@/constants/Colors";
import { useEffect, useState } from "react";
import { auth } from "./../config/firebaseConfig"; // Firebase auth'ı import ediyoruz
import { onAuthStateChanged } from 'firebase/auth'; // Oturum değişikliklerini dinlemek için

export default function Index() {
  const navigation = useNavigation(); // Yönlendirme fonksiyonunu kullan
  const rootNavigationState = useRootNavigationState(); // Navigation state'i al
  const [user, setUser] = useState(null); // Kullanıcı durumunu yönetmek için state

  useEffect(() => {
    // Firebase ile oturum durumunu dinleme
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Kullanıcı oturumunu güncelle
    });

    CheckNavLoaded();

    // Oturum durumunu dinlemeyi durdurmak için cleanup fonksiyonu
    return () => unsubscribe();
  }, [rootNavigationState]); // rootNavigationState'e bağımlı olmalı

  const CheckNavLoaded = () => {
    if (!rootNavigationState?.key) {
      return null;
    }
  };

  return (
    <View style={styles.container}>
      {user && <Text>{user.displayName}</Text>}

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
  text: {
    fontSize: 20,
    color: "black",
    padding: 10, // Metin kutusuna padding ekleyelim
  },
});
