import React, { useEffect, useState } from "react";
import { View, ScrollView, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation, router } from "expo-router";
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { db, auth } from '../../config/firebaseConfig';

export default function PetDetails() {
  const pet = useLocalSearchParams();
  const navigation = useNavigation();
  const [isFavorited, setIsFavorited] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const userEmail = auth.currentUser?.email;
  const userId = auth.currentUser?.uid;

  // Favori durumunu kontrol eden fonksiyon
  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      try {
        const userRef = doc(db, "UserFavPet", userEmail);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists() && userDoc.data().favorites?.includes(pet.id)) {
          setIsFavorited(true);
        }
      } catch (error) {
        console.error("Favori durumu alınamadı:", error);
      }
    };
    fetchFavoriteStatus();
  }, [pet.id, userEmail]);

  // Kullanıcının sahibi olup olmadığını kontrol etme
  useEffect(() => {
    setIsOwner(pet.ownerId === userId);
  }, [pet.ownerId, userId]);

  // Favori ekleme/çıkarma
  const toggleFavorite = async () => {
    try {
      const userRef = doc(db, "UserFavPet", userEmail);
      if (isFavorited) {
        await updateDoc(userRef, {
          favorites: arrayRemove(pet.id),
        });
        setIsFavorited(false);
      } else {
        await updateDoc(userRef, {
          favorites: arrayUnion(pet.id),
        });
        setIsFavorited(true);
      }
    } catch (error) {
      console.error("Favori ekleme/çıkarma işlemi başarısız:", error);
    }
  };

  // Yükleme durumunu yönetme
  useEffect(() => {
    navigation.setOptions({ headerTransparent: true, headerTitle: "" });
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  }, []);

  // Mesajlaşma ekranına yönlendirme
  const handleAdoptMePress = () => {
    router.push({
      pathname: "/ChatScreen",
      params: { ownerId: pet.ownerId, animalId: pet.id },
    });
  };

  // Hayvan düzenleme ekranına yönlendirme
  const handleEditPetPress = () => {
    router.push({
      pathname: "/EditPet",
      params: { animalId: pet.id },
    });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6347" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {!imageLoaded && (
          <ActivityIndicator size="large" color="#FF6347" style={styles.imageLoader} />
        )}
        <Image
          source={{ uri: pet?.imageUrl }}
          style={styles.image}
          onLoadEnd={() => setImageLoaded(true)}
        />

        <View style={styles.infoContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.name}>{pet?.name}</Text>
            <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton}>
              <FontAwesome 
                name={isFavorited ? "heart" : "heart-o"} 
                size={24} 
                color={isFavorited ? "red" : "#333"} 
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.address}>{pet?.address}</Text>

          <Text style={styles.sectionTitle}>About {pet.name}</Text>
          <Text style={styles.description}>
            {showFullDescription ? pet.about : `${pet.about?.substring(0, 100)}...`}
          </Text>
          <TouchableOpacity onPress={() => setShowFullDescription(!showFullDescription)}>
            <Text style={styles.readMoreText}>
              {showFullDescription ? 'Read Less' : 'Read More'}
            </Text>
          </TouchableOpacity>

          <View style={styles.ownerContainer}>
            <Image source={{ uri: pet?.userImage }} style={styles.ownerImage} />
            <View style={styles.ownerInfo}>
              <Text style={styles.ownerName}>{pet?.ownerEmail}</Text>
              <Text style={styles.ownerLabel}>Pet Owner</Text>
            </View>
            <TouchableOpacity style={styles.messageIconContainer} onPress={handleAdoptMePress}>
              <MaterialIcons name="message" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {isOwner ? (
            <>
              <TouchableOpacity style={styles.adoptButton} onPress={handleEditPetPress}>
                <Text style={styles.adoptButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.adoptButton}>
                <Text style={styles.adoptButtonText}>Manage Pets</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.adoptButton} onPress={handleAdoptMePress}>
              <Text style={styles.adoptButtonText}>Adopt Me</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageLoader: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  infoContainer: {
    padding: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
  },
  favoriteButton: {
    padding: 8,
  },
  address: {
    fontSize: 16,
    color: "gray",
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  description: {
    fontSize: 14,
    color: "#555",
    marginVertical: 8,
  },
  readMoreText: {
    fontSize: 14,
    color: "#FF6347",
  },
  ownerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", 
    marginVertical: 16,
    paddingHorizontal: 10,
  },
  ownerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  ownerInfo: {
    flex: 1, 
    marginLeft: 12, 
  },
  ownerName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  ownerLabel: {
    fontSize: 14,
    color: "gray",
  },
  messageIconContainer: {
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  adoptButton: {
    backgroundColor: "#FF6347",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  adoptButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
