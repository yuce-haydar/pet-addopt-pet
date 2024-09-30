import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";

const Category = ({ onCategorySelect }) => {
  const [category, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Dogs');

  useEffect(() => {
    GetCategories();
  }, []);

  const GetCategories = async () => {
    try {
      const snapshot = await getDocs(collection(db, "Category"));
      const categoriesArray = []; // Tüm kategorileri saklamak için geçici bir dizi
  
      snapshot.forEach((doc) => {
        categoriesArray.push(doc.data()); // Kategorileri diziye ekliyoruz
      });
  
      setCategory(categoriesArray); // Tüm kategorileri tek seferde duruma ekliyoruz
    } catch (error) {
      console.error("Kategori verileri alınamadı:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Categories</Text>
      <FlatList
        style={styles.flatList}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        data={category}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.containerImgAndText,
              selectedCategory === item.name && styles.selectedCategory,
            ]}
            onPress={() => {
              setSelectedCategory(item.name);
              onCategorySelect(item.name); // Prop olarak gelen fonksiyon çağrısı
            }}
          >
            <Image style={styles.image} source={{ uri: item?.imageUrl }} />
            <Text style={{ textAlign: "center", fontSize: 15 }}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Category;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
    marginBottom: 10,
  },
  containerImgAndText: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    textAlign: "center",
    margin: 10,
    backgroundColor: '#f5dc93', // Varsayılan arka plan rengi
    borderWidth: 1,
    borderColor: '#0fa0fa', // Kenarlık rengi
    padding: 20,
  },
  selectedCategory: {
    backgroundColor: '#0fa0fa', // Seçili kategorinin arka plan rengi
  },
  image: {
    width: 60,
    borderRadius: 15,
    height: 40,
  },
});
