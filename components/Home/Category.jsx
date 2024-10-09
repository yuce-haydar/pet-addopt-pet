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
      const categoriesArray = [];

      snapshot.forEach((doc) => {
        categoriesArray.push(doc.data());
      });

      setCategory(categoriesArray);
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
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.containerImgAndText,
              selectedCategory === item.name && styles.selectedCategory,
            ]}
            onPress={() => {
              setSelectedCategory(item.name);
              onCategorySelect(item.name);
            }}
          >
            {item?.imageUrl ? (
              <Image style={styles.image} source={{ uri: item.imageUrl }} />
            ) : (
              <Text>No Image</Text>
            )}
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
    backgroundColor: '#f5dc93',
    borderWidth: 1,
    borderColor: '#0fa0fa',
    padding: 20,
  },
  selectedCategory: {
    backgroundColor: '#0fa0fa',
  },
  image: {
    width: 40,
    borderRadius: 15,
    height: 20,
  },
});
