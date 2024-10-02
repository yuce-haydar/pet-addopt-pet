import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { collection, getDoc, getDocs, doc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import PetListItem from "./../../components/Home/PetListItem";
import { useNavigation } from "@react-navigation/native"; // Geri tuşu için
import LottieView from "lottie-react-native"; // Custom loading ikonu için

export default function Favorite() {
  const [favoritePets, setFavoritePets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation(); // Geri tuşu ve başlık için

  // Kullanıcı e-postası (bu, giriş yapan kullanıcıya göre dinamik olmalıdır)
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

        if (favoriteIds.length > 0) {
          const petsCollectionRef = collection(db, "Pets");
          const petsSnapshot = await getDocs(petsCollectionRef);

          const petsArray = [];
          petsSnapshot.forEach((petDoc) => {
            if (favoriteIds.includes(petDoc.id)) {
              petsArray.push({ id: petDoc.id, ...petDoc.data() });
            }
          });

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
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: "Favorite Pets",
    });
  }, []);

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingContainer}>
          <LottieView
            source={require("../../assets/loading.json")} // Lottie animasyon dosyanızın yolu
            autoPlay
            loop
            style={styles.loadingAnimation}
          />
        </View>
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}

      {!loading && favoritePets.length === 0 && (
        <Text style={styles.emptyText}>Henüz favorilere eklenmiş pet yok.</Text>
      )}

      <FlatList
        data={favoritePets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <PetListItem pet={item} />
          </View>
        )}
        numColumns={2} // İki sütunlu düzen
        contentContainerStyle={styles.flatListContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  backButton: {
    marginLeft: 10,
  },
  backButtonText: {
    fontSize: 24,
    color: "#000",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingAnimation: {
    width: 100,
    height: 100,
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
