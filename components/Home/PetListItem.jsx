import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";

export default function PetListItem({ pet }) {
  return (
    <View style={styles.petContainer}>
      {pet.imageUrl && (
        <Image style={styles.image} source={{ uri: pet.imageUrl }} />
      )}
      <View style={styles.txtContainer}>
        {/* Name ve Age aynı satırda, köşelerde */}
          <Text style={styles.petName}>{pet.name}</Text>
        <View style={styles.row}>
        <Text style={styles.petBreed}>{pet.breed}</Text>
          <Text style={styles.petAge}>{pet.age} YRS</Text>
        </View>
        {/* Breed, Name'in altında */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  petContainer: {
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  txtContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    marginTop: 10,
    width: '100%', // Metinlerin tam genişlikte hizalanması için
  },
  row: {
    flexDirection: "row", // Name ve Age'in aynı satırda olması için
    width: "100%", // Name ve Age'in tam genişlikte olması için
    justifyContent: "space-between", // Köşelerde konumlandırmak için
    alignItems: "center",
  },
  petName: {
    fontSize: 18,
    fontFamily: "outfit-bold",
    color: "#333",
  },
  petBreed: {
    fontSize: 14,

    color: "#555",
    marginTop: 5, // Name ile Breed arasına biraz boşluk ekleyin
  },
  petAge: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fabb00",
    backgroundColor: "#f5d77f", // Sarı arka plan rengi
    paddingHorizontal: 2,
    paddingVertical: 2,
    borderRadius: 5,
  },
});
