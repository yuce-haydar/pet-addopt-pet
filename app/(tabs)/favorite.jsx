import { StyleSheet, Text, View, FlatList, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { collection, getDoc, doc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import PetListItem from "../../components/Home/PetListItem";
import { useNavigation } from "@react-navigation/native";

export default function Favorite() {
  const [favoritePets, setFavoritePets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  // Kullanıcı e-postası (Bu, giriş yapan kullanıcıya göre dinamik olmalıdır)
  const userEmail = "haydar8w@gmail.com";

  // Favori petleri Firestore'dan çek
  const fetchFavoritePets = async () => {
    try {
      setLoading(true);
      setError(null);

      const userRef = doc(db, "UserFavPet", userEmail);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const favoriteIds = userData.favorites || [];

        console.log("Kullanıcı Belgesi:", userData);
        console.log("Favori Pet ID'leri:", favoriteIds);

        if (favoriteIds.length > 0) {
          const petsArray = [];

          // Favori pet ID'leri üzerinde döngü yaparak her birini Firestore'dan al
          for (let petId of favoriteIds) {
            try {
              const petRef = doc(db, "Pets", petId);
              const petDoc = await getDoc(petRef);

              if (petDoc.exists()) {
                petsArray.push({ id: petDoc.id, ...petDoc.data() });
              }
            } catch (error) {
              console.error(`Pet ID'si ${petId} alınırken hata oluştu:`, error);
            }
          }

          setFavoritePets(petsArray);
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
  }, []);

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}

      {!loading && favoritePets.length === 0 && (
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(255,255,255,0.7)', // Optional: to dim the background
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
