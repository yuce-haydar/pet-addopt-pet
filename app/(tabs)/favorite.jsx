import { StyleSheet, Text, View, FlatList, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { collection, getDoc, doc } from "firebase/firestore";
import { db, auth } from "../../config/firebaseConfig";
import PetListItem from "../../components/Home/PetListItem";
import { useNavigation } from "@react-navigation/native";

export default function Favorite() {
  const [favoritePets, setFavoritePets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    // Kullanıcının oturum açma durumunu dinle
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const fetchFavoritePets = async () => {
    if (!currentUser) {
      setLoading(false);
      setError("Lütfen favori petlerinizi görmek için giriş yapın.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const userRef = doc(db, "UserFavPet", currentUser.email);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const favoriteIds = userData.favorites || [];

        if (favoriteIds.length > 0) {
          // Favori petleri paralel olarak almak için Promise.all kullanıyoruz
          const petsArray = await Promise.all(
            favoriteIds.map(async (petId) => {
              try {
                const petRef = doc(db, "Pets", petId);
                const petDoc = await getDoc(petRef);
                if (petDoc.exists()) {
                  return { id: petDoc.id, ...petDoc.data() };
                }
                return null; // Belirli pet bulunamazsa null dönüyoruz
              } catch (error) {
                console.error(`Pet ID'si ${petId} alınırken hata oluştu:`, error);
                return null; // Hata durumunda null dönüyoruz
              }
            })
          );

          // Null olmayan petleri filtreliyoruz
          setFavoritePets(petsArray.filter((pet) => pet !== null));
        } else {
          setFavoritePets([]);
        }
      } else {
        setFavoritePets([]);
      }
    } catch (error) {
      console.error("Favori petler alınamadı:", error);
      setError("Favori petler alınamadı, lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Sayfa yüklendiğinde favori petleri al
    fetchFavoritePets();

    // Navigation başlığını ayarla
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: "Favorite Pets",
    });
  }, [currentUser]);

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}

      {!loading && favoritePets.length === 0 && !error && (
        <Text style={styles.emptyText}>Henüz favorilere eklenmiş pet yok.</Text>
      )}

      {!loading && favoritePets.length > 0 && (
        <FlatList
          data={favoritePets}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <PetListItem pet={item} />
            </View>
          )}
          numColumns={2}
          contentContainerStyle={styles.flatListContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    marginHorizontal: "1%",
    width: "48%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  flatListContainer: {
    justifyContent: "space-between",
    paddingBottom: 20,
    marginTop: 30,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginVertical: 10,
  },
  emptyText: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 16,
    color: "gray",
  },
});
