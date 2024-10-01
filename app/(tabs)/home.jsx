import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Header from "../../components/Home/Header";
import Slider from "../../components/Home/Slider";
import PetListByCategory from "../../components/Home/PetListByCategory";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

export default function Home() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Header />
      {/* Slider */}
      <Slider />
      {/* List Of Pets */}
      <View style={styles.contentContainer}>
        <PetListByCategory />
      </View>
      {/* Add New Pet Option */}
      <TouchableOpacity style={styles.addNewPetButton}>
        <MaterialIcons name="pets" size={24} color="black" />
        <Text>Add New Pet</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ekranın tamamını kaplamak için
  },
  contentContainer: {
    flex: 1, // `PetListByCategory` bileşeninin kalan alanı kaplaması için
  },
  addNewPetButton: {
    backgroundColor: "#f5dc93",
    padding: 20,
    borderRadius: 10,
    borderStyle: "dashed",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 10,
  },
});
