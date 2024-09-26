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
      snapshot.forEach((doc) => {
        setSlider(slider=>[...slider,doc.data()]);
        });
    } catch (error) {
      console.error("Slider veri leri alınamadı:", error);
    }
  };

  return (
    <View>
        <FlatList showsHorizontalScrollIndicator={false} horizontal={true} data={slider} renderItem={({item,index})=>(
            <View>
                <Image source={{uri:item?.imageUrl}} style={styles.sliderImg}></Image>
            </View>
        )}>

        </FlatList>
    </View> 


);
}

const styles = StyleSheet.create({
    sliderImg:{
        width: Dimensions.get("screen").width*0.9,
        height:200,
        borderRadius:15,
        marginRight:10        ,
        marginLeft:5
    }
});
