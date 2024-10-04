import React from "react";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SecureStore from "expo-secure-store"; // Eğer tokenları saklamak isterseniz kullanabilirsiniz

export default function RootLayout() {
  // Fontları yükleme
  const [fontsLoaded] = useFonts({
    outfit: require("./../assets/fonts/Outfit-Regular.ttf"),
    "outfit-medium": require("./../assets/fonts/Outfit-Medium.ttf"),
    "outfit-bold": require("./../assets/fonts/Outfit-Bold.ttf"),
  });

  // Eğer fontlar yüklenmediyse yükleme ekranı döndürüyoruz
  if (!fontsLoaded) {
    return null; // Ya da bir yükleme göstergesi döndürebilirsiniz
  }

  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="add-new-pet/index" />
      <Stack.Screen name="login/index" options={{ headerShown: false }} />
      <Stack.Screen name="register/index" options={{ headerShown: false }} /> {/* Register ekranı */}
    </Stack>
  );
}
