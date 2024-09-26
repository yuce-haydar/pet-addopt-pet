import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useUser } from "@clerk/clerk-expo";
export default function Header() {
  const { user } = useUser();
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.txtWlc}>Welcome,</Text>
        <Text style={styles.txtUsr}>{user?.fullName}</Text>
      </View>
      <Image source={{ uri: user?.imageUrl }} style={styles.imgUsr} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  txtWlc: {
    fontSize: 18,

    fontFamily: "outfit",
  },
  txtUsr: {
    fontSize: 25,
    fontFamily: "outfit-medium",
  },
  imgUsr: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
});
