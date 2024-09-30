import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Category from './Category';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig'; // db'yi doğru yoldan import ettiğinizden emin olun

const PetListByCategory = () => {
  // Kategoriyi filtreleyerek pet listesini alan fonksiyon
  const GetPetList = async (category) => {
    try {
      const q = query(collection(db, "Pets"), where("category", "==", category));
      const querySnapshot = await getDocs(q);
      
      // Gelen pet listesini işleme
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
      });
    } catch (error) {
      console.error("Pet listesi alınamadı:", error);
    }
  };

  return (
    <View>
      <Category onCategorySelect={(value) => GetPetList(value)} />
    </View>
  );
};

export default PetListByCategory;

const styles = StyleSheet.create({});
