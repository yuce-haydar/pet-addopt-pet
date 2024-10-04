import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { auth } from './../../config/firebaseConfig'; // Firebase auth'ı import ediyoruz

export default function Header() {
  const user = auth.currentUser; // Giriş yapan kullanıcıyı al
  
  // Kullanıcının adının ilk harfini almak için
  const userInitial = user?.displayName ? user.displayName.charAt(0).toUpperCase() : '';

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.txtWlc}>Welcome,</Text>
        <Text style={styles.txtUsr}>{user?.displayName || "User"}</Text>
      </View>
      
      {/* Profil Resmi veya Kullanıcı Adının İlk Harfi */}
      <View style={styles.imgContainer}>
        <Text style={styles.imgText}>{userInitial}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  txtWlc: {
    fontSize: 18,
    fontFamily: "outfit",
  },
  txtUsr: {
    fontSize: 25,
    fontFamily: "outfit-medium",
  },
  imgContainer: {
    width: 50,
    height: 50,
    borderRadius: 25, // Daire olması için yarıçapı yarıya düşürdük
    backgroundColor: "#ccc", // Arka plan rengi
    justifyContent: "center",
    alignItems: "center",
  },
  imgText: {
    fontSize: 25,
    color: "#fff",
    fontFamily: "outfit-medium",
  },
});
