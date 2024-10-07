import React, { useEffect, useState } from "react";
import { View, ScrollView, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { FontAwesome, MaterialCommunityIcons, Fontisto, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation, router } from "expo-router";
import { doc, setDoc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { db, auth } from '../../config/firebaseConfig'; 

export default function PetDetails() {
  let pet = useLocalSearchParams();
  const navigation = useNavigation();
  const [isFavorited, setIsFavorited] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const userEmail = auth.currentUser?.email;
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      try {
        const userRef = doc(db, "UserFavPet", userEmail);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.favorites && userData.favorites.includes(pet.id)) {
            setIsFavorited(true);
          }
        }
      } catch (error) {
        console.error("Favori durumu alınamadı:", error);
      }
    };

    fetchFavoriteStatus();
  }, [pet.id]);

  useEffect(() => {
    if (pet.ownerId === userId) {
      setIsOwner(true);
    }
  }, [pet.ownerId, userId]);

  const toggleFavorite = async () => {
    try {
      const userRef = doc(db, "UserFavPet", userEmail);
      const userDoc = await getDoc(userRef);

      if (isFavorited) {
        await updateDoc(userRef, {
          favorites: arrayRemove(pet.id),
        });
        setIsFavorited(false);
      } else {
        if (userDoc.exists()) {
          await updateDoc(userRef, {
            favorites: arrayUnion(pet.id),
          });
        } else {
          await setDoc(userRef, {
            email: userEmail,
            favorites: [pet.id],
          });
        }
        setIsFavorited(true);
      }
    } catch (error) {
      console.error("Favori ekleme/çıkarma işlemi başarısız:", error);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: "",
    });
    console.log(pet.imageUrl);
  }, []);

  const handleAdoptMePress = () => {
    router.push({
      pathname: "/ChatScreen",
      params: {
        ownerId: pet.ownerId,
        animalId: pet.pet_id,
      },
    });
  };

  const handleEditPetPress = () => {
    router.push({
      pathname: "/EditPet",
      params: {
        animalId: pet.pet_id,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Pet Image */}
        <Image source={{ uri: pet?.imageUrl }} style={styles.image} />

        {/* Pet Info */}
        <View style={styles.infoContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.name}>{pet?.name}</Text>

            {/* Kalp ikonu */}
            <TouchableOpacity onPress={toggleFavorite}>
              <FontAwesome 
                name={isFavorited ? "heart" : "heart-o"} 
                size={24} 
                color={isFavorited ? "red" : "#333"} 
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.address}>{pet?.address}</Text>

          {/* Pet Properties */}
          <View style={styles.propertiesContainer}>
            {/* ... (other properties) */}
          </View>

          {/* About Section */}
          <Text style={styles.sectionTitle}>About {pet.name}</Text>
          <Text style={styles.description}>
            {showFullDescription ? pet.about : `${pet.about.substring(0, 100)}...`}
          </Text>
          <TouchableOpacity onPress={() => setShowFullDescription(!showFullDescription)}>
            <Text style={styles.readMoreText}>{showFullDescription ? 'Read Less' : 'Read More'}</Text>
          </TouchableOpacity>

          {/* Owner Info */}
          <View style={styles.ownerContainer}>
            <Image source={{ uri: pet?.userImage }} style={styles.ownerImage} />
            <View style={styles.ownerInfo}>
              <Text style={styles.ownerName}>{pet?.ownerEmail}</Text>
              <Text style={styles.ownerLabel}>Pet Owner</Text>
            </View>
            
            {/* Send Message Icon */}
            <TouchableOpacity style={styles.messageIconContainer} onPress={handleAdoptMePress}>
              <MaterialIcons name="message" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Koşullu Olarak Düğmeleri Göster */}
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
  image: {
    width: "100%",
    height: 300,
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
  address: {
    fontSize: 16,
    color: "gray",
    marginVertical: 8,
  },
  propertiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap", 
    justifyContent: "space-between",
    marginVertical: 16,
  },
  propertyBox: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 10,
    width: "48%", 
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#FABB00",
  },
  propertyTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginTop: 5,
  },
  propertyText: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
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
