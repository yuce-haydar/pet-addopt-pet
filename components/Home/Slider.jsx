import { Dimensions, FlatList, Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { db } from "./../../config/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export default function Slider() {
  const [slider, setSlider] = useState([]);

  useEffect(() => {
    getSliderData();
  }, []);

  const getSliderData = async () => {
    try {
      const snapshot = await getDocs(collection(db, "Slider"));
      const sliderArray = []; // Dizi oluşturulması
      snapshot.forEach((doc) => {
        sliderArray.push(doc.data());
      });
      setSlider(sliderArray);
    } catch (error) {
      console.error("Slider verileri alınamadı:", error);
    }
  };

  return (
    <View style={styles.sliderContainer}>
      <FlatList
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        data={slider}
        renderItem={({ item }) => (
          <View>
            <Image source={{ uri: item?.imageUrl }} style={styles.sliderImg} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sliderContainer: {
    height: 200, // Sabit yükseklik verildi
    marginBottom: 10,
  },
  sliderImg: {
    width: Dimensions.get("screen").width * 0.9,
    height: 200,
    borderRadius: 15,
    marginRight: 10,
    marginLeft: 5,
  },
});
