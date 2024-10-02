import { Image, StyleSheet, Text, View, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native";
import { FontAwesome, MaterialCommunityIcons, Fontisto, MaterialIcons } from "@expo/vector-icons"; // İkonları içe aktarıyoruz
import { TouchableOpacity } from "react-native";

export default function PetDetails() {
  let pet = useLocalSearchParams();
  const navigation = useNavigation();
  const [showFullDescription, setShowFullDescription] = useState(false); 

  // `user` verisinin işlenmesi
  try {
    if (typeof pet.user === 'string') {
      pet.user = JSON.parse(pet.user);
    }
  } catch (error) {
    console.error('User verisi JSON.parse ile işlenemedi:', error);
  }

  useEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: "",
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Pet Image */}
        <Image source={{ uri: pet?.imageUrl }} style={styles.image} />

        {/* Pet Info */}
        <View style={styles.infoContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.name}>{pet?.name}</Text>
            {/* Adres kısmına kalp ikonu ekliyoruz */}
            <FontAwesome name="heart-o" size={24} color="#333" />
          </View>
          <Text style={styles.address}>{pet?.address}</Text>

          {/* Pet Properties */}
          <View style={styles.propertiesContainer}>
            <View style={styles.propertyBox}>
              <FontAwesome name="calendar" size={24} color="#FABB00" />
              <Text style={styles.propertyTitle}>Age</Text>
              <Text style={styles.propertyText}>{pet?.age} Years</Text>
            </View>

            <View style={styles.propertyBox}>
              <MaterialCommunityIcons name="dog" size={24} color="#FABB00" />
              <Text style={styles.propertyTitle}>Breed</Text>
              <Text style={styles.propertyText}>{pet?.breed}</Text>
            </View>

            <View style={styles.propertyBox}>
              <Fontisto name="male" size={24} color="#FABB00" />
              <Text style={styles.propertyTitle}>Sex</Text>
              <Text style={styles.propertyText}>{pet?.sex}</Text>
            </View>

            <View style={styles.propertyBox}>
              <MaterialCommunityIcons name="weight-kilogram" size={24} color="#FABB00" />
              <Text style={styles.propertyTitle}>Weight</Text>
              <Text style={styles.propertyText}>{pet?.weight} Kg</Text>
            </View>
          </View>

          {/* About Section */}
          <Text style={styles.sectionTitle}>About {pet?.name}</Text>
          <Text style={styles.description}>
            {showFullDescription ? pet?.about : `${pet?.about?.substring(0, 100)}...`}
          </Text>
          <TouchableOpacity onPress={() => setShowFullDescription(!showFullDescription)}>
            <Text style={styles.readMoreText}>{showFullDescription ? "Read Less" : "Read More"}</Text>
          </TouchableOpacity>

          {/* Owner Info */}
          <View style={styles.ownerContainer}>
          <Image source={{ uri: pet?.user?.userImage }} style={styles.ownerImage} />
          <View style={styles.ownerInfo}>
            <Text style={styles.ownerName}>{pet?.user?.userName}</Text>
            <Text style={styles.ownerLabel}>Pet Owner</Text>
          </View>
          
          {/* Send Message Icon */}
          <TouchableOpacity style={styles.messageIconContainer}>
            <MaterialIcons name="send" size={24} color="#FABB00" />
          </TouchableOpacity>
        </View>


          {/* Adopt Button */}
          <TouchableOpacity style={styles.adoptButton}>
            <Text style={styles.adoptButtonText}>Adopt Me</Text>
          </TouchableOpacity>
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
    height: 250,
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
    flexWrap: "wrap", // İki sütun yapmak için
    justifyContent: "space-between",
    marginVertical: 16,
  },
  propertyBox: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 10,
    width: "48%", // İki sütun için yarı genişlik
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 8,
  },
  description: {
    fontSize: 16,
    color: "gray",
    marginBottom: 8,
  },
  readMoreText: {
    color: "#FF6347",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
  },
  ownerContainer: {
    borderWidth:1,
    borderColor:'#FABB00',
    padding:10,
    borderRadius:10,
    flexDirection: "row", // İçerikleri yatayda hizalamak için
    alignItems: "center",
    justifyContent: "space-between", // İçerikleri en sağa ve sola dağıtmak için
    marginVertical: 16,
    paddingHorizontal: 10,
  },
  ownerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  ownerInfo: {
    flex: 1, // İçerik arasında boşluk bırakmak için
    marginLeft: 12, // Resim ile metin arasında boşluk
  },
  ownerName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  ownerLabel: {
    fontSize: 14,
    color: "gray",
  },
  ownerEmail: {
    fontSize: 14,
    color: "gray",
  },
  adoptButton: {
    backgroundColor: "#FABB00",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  adoptButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
