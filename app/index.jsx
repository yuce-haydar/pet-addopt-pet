import { Text, View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native"; // Navigation için hook
import { Link, Redirect, useRootNavigationState } from "expo-router"; // Eğer Link kullanıyorsanız
import { Colors } from "@/constants/Colors";
import { useEffect } from "react";
import { useUser } from "@clerk/clerk-expo"; // clerk-expo için güncel kullanım

export default function Index() {
  const navigation = useNavigation(); // Yönlendirme fonksiyonunu kullan
  const { user } = useUser(); // Kullanıcı bilgilerini al
  const rootNavigationState = useRootNavigationState(); // Navigation state'i al

  useEffect(() => {
    CheckNavLoaded();
  }, [rootNavigationState]); // rootNavigationState'e bağımlı olmalı

  const CheckNavLoaded = () => {
    if (!rootNavigationState?.key) {
      return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* {user && <Text>{user.fullName}</Text>}

      {user ? <Redirect href="/(tabs)/home" /> : <Redirect href="/login" />} */}
      <Redirect href="/(tabs)/home" />
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
