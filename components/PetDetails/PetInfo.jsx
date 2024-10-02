import { StyleSheet, Text, View, SafeAreaView, Image } from "react-native";
import React from "react";

export default function PetInfo({ pet }) {
  return (
    <View style={styles.container}>
      <Image source={{ uri: pet.imageUrl }} style={styles.image} />
    <View style={styles.textContainer}>
    <Text style={styles.name}>{pet.name}</Text>
    <Text style={styles.description}>{pet.description}</Text>
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    marginTop: 400,
    height: 500,
    width: "100%",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 16,
  },
  description: {
    fontSize: 16,
    color: "gray",
    marginTop: 8,
    textAlign: "center",
  },
});
