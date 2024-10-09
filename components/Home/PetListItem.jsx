import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

export default function PetListItem({ pet }) {
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => {
        // `user` nesnesini `JSON.stringify` ile `string`e çevirerek aktarıyoruz
        router.push({
          pathname: "/pet-details",
          params: {
            ...pet,
            user: JSON.stringify(pet.user),
          },
        });
      }}
      style={styles.petContainer}
    >
      {pet.imageUrl && (
        <Image style={styles.image} source={{ uri: pet.imageUrl }} />
      )}
      <View style={styles.txtContainer}>
        <Text style={styles.petName}>{pet.name}</Text>
        <View style={styles.row}>
          <Text style={styles.petBreed}>{pet.breed}</Text>
          <Text style={styles.petAge}>{pet.age} YRS</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  petContainer: {
    alignItems: "center",
    
    borderRadius: 10,
  },
  image: {
    width: 150,
    height: 100,
    borderRadius: 10,
  },
  txtContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    marginTop: 10,
    width: '100%',
  },
  row: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
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
    marginTop: 5,
  },
  petAge: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fabb00",
    backgroundColor: "#f5d77f",
    paddingHorizontal: 2,
    paddingVertical: 2,
    borderRadius: 5,
  },
});
