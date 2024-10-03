import { ActivityIndicator, StyleSheet, View, Text, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import Category from './Category';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import PetListItem from './PetListItem';

const PetListByCategory = () => {
  const [petList, setPetList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Dogs'); // Varsayılan kategori 'Dogs'

  const fetchPetList = async (category) => {
    try {
      setLoading(true);
      setError(null);

      // Seçilen kategori yoksa varsayılan olarak 'Dogs' kategorisini kullan
      const categoryToFetch = category || 'Dogs';

      const q = query(collection(db, 'Pets'), where('category', '==', categoryToFetch));
      const querySnapshot = await getDocs(q);

      const petsArray = [];
      querySnapshot.forEach((doc) => {
        const documentData = doc.data();

        // `user` alanını kontrol et ve gerekirse `JSON.parse()` ile nesneye dönüştür
        if (typeof documentData.user === 'string') {
          try {
            documentData.user = JSON.parse(documentData.user);
          } catch (error) {
            console.error('User verisi JSON.parse ile işlenemedi:', error);
          }
        }

        petsArray.push({ id: doc.id, ...documentData });
      });

      setPetList(petsArray);
    } catch (error) {
      console.error('Pet listesi alınamadı:', error);
      setError('Pet listesi alınamadı, lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  // Component ilk yüklendiğinde varsayılan kategori için pet listesini al
  useEffect(() => {
    fetchPetList(selectedCategory);
  }, []);

  return (
    <View style={styles.container}>
      {/* Category bileşeni */}
      <View style={styles.categoryContainer}>
        <Category onCategorySelect={(value) => {
          setSelectedCategory(value);
          fetchPetList(value);
        }} />
      </View>

      {/* Pet List Section */}
      <View style={styles.listContainer}>
        {loading && <ActivityIndicator size="large" color="#0000ff" />}
        
        {error && <Text style={styles.errorText}>{error}</Text>}
        
        {!loading && petList.length === 0 && (
          <Text style={styles.emptyText}>Kategoriye ait pet bulunamadı.</Text>
        )}

        <FlatList
          data={petList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <PetListItem pet={item} />
            </View>
          )}
          numColumns={2} // İki sütunlu düzen
          contentContainerStyle={styles.flatListContainer}
        />
      </View>
    </View>
  );
};

export default PetListByCategory;

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ekranın tamamını kapla
    padding: 10,
    backgroundColor: '#fff',
  },
  categoryContainer: {
    marginBottom: 10, // Category bileşenine yer açmak için boşluk ekleyin
  },
  listContainer: {
    flex: 1, // Liste alanını kapla
    marginBottom: 10, // Add New Pet butonuna yer açmak için alt boşluk
  },
  flatListContainer: {
    justifyContent: 'space-between',
    paddingBottom: 20, // "Add New Pet" butonu için ekstra boşluk
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    marginHorizontal: '1%', // Kartlar arasında yatay boşluk bırakmak için
    width: '48%', // İki sütun yapmak için kart genişliği
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
    color: 'gray',
  },
});
