import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { auth } from "./../../config/firebaseConfig";
import { signOut } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect, Link } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons"; // MaterialIcons'u import ediyoruz

export default function Profile() {
  const [loggedOut, setLoggedOut] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // AsyncStorage'dan kullanıcı bilgisini al
    const fetchUserInfo = async () => {
      try {
        const user = await AsyncStorage.getItem("user");
        if (user) {
          setUserInfo(JSON.parse(user));
        }
      } catch (error) {
        console.error("Kullanıcı bilgisi alınırken hata:", error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth); // Firebase Authentication'dan çıkış yap
      await AsyncStorage.removeItem("user"); // AsyncStorage'daki oturum bilgisini temizle
      setLoggedOut(true);
    } catch (error) {
      console.error("Çıkış yaparken hata oluştu:", error);
    }
  };

  if (loggedOut) {
    return <Redirect href="/login" />;
  }

  // Kullanıcının adının ilk harfini döndüren yardımcı fonksiyon
  const getInitials = (name) => {
    if (!name) return "";
    return name.charAt(0).toUpperCase();
  };

  return (
    <View style={styles.container}>
      {userInfo && (
        <>
          {/* Profil Resmi veya İsim Baş Harfi */}
          <View style={styles.profileImageContainer}>
            {userInfo.photoURL ? (
              <MaterialIcons name="account-circle" size={100} color="#ccc" />
            ) : (
              <View style={styles.initialsContainer}>
                <Text style={styles.initialsText}>
                  {getInitials(userInfo.displayName)}
                </Text>
              </View>
            )}
          </View>
          {/* Kullanıcı Bilgileri */}
          <Text style={styles.displayName}>
            {userInfo.displayName || "Kullanıcı Adı"}
          </Text>
          <Text style={styles.email}>{userInfo.email}</Text>

          {/* Profile Actions */}
          <View style={styles.actionsContainer}>
            <Link href="/add-new-pet" style={styles.actionButton}>
              <MaterialIcons name="pets" size={22} color="#fff" />
              <Text style={styles.actionButtonText}>Add New Pet</Text>
            </Link>
            <Link href="/favorites" style={styles.actionButton}>
              <MaterialIcons name="favorite" size={22} color="#fff" />
              <Text style={styles.actionButtonText}>Favorites</Text>
            </Link>
            <Link href="/inbox" style={styles.actionButton}>
              <MaterialIcons name="inbox" size={22} color="#fff" />
              <Text style={styles.actionButtonText}>Inbox</Text>
            </Link>
            <TouchableOpacity
              style={[styles.actionButton, styles.logoutButton]}
              onPress={handleLogout}
            >
              <MaterialIcons name="logout" size={22} color="#fff" />
              <Text style={styles.actionButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  profileImageContainer: {
    marginBottom: 20,
  },
  initialsContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ffcc00",
    justifyContent: "center",
    alignItems: "center",
  },
  initialsText: {
    fontSize: 48,
    color: "#fff",
  },
  displayName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  actionsContainer: {
    width: "100%",
    marginTop: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center", // Dikeyde ortalama
    justifyContent: "center", // Yatayda ortalama
    backgroundColor: "#ffcc00", // Sarı renk
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
    textAlign: "center",
  },
  logoutButton: {
    backgroundColor: "#ff4d4d",
  },
});
