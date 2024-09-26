import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Header from "../../components/Home/Header";
import Slider from "../../components/Home/Slider";
import PetListByCategory from "../../components/Home/PetListByCategory";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Header />
      {/* Slider */}
      <Slider />
      {/* List Of Pets */}
      <PetListByCategory />
      {/* Add New Pet Option */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
