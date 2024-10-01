import { ActivityIndicator, StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import Category from './Category';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import PetListItem from './PetListItem';

const PetListByCategory = () => {
  const [petList, setPetList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPetList = async (category) => {
    try {
      setLoading(true);
      setError(null);

      const q = query(collection(db, 'Pets'), where('category', '==', category));
      const querySnapshot = await getDocs(q);

      const petsArray = [];
      querySnapshot.forEach((doc) => {
        petsArray.push({ id: doc.id, ...doc.data() });
      });

      setPetList(petsArray);
    } catch (error) {
      console.error('Pet listesi alınamadı:', error);
      setError('Pet listesi alınamadı, lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Category bileşeni */}
      <View style={styles.categoryContainer}>
        <Category onCategorySelect={(value) => fetchPetList(value)} />
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

      {/* Add New Pet Button */}
    
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
  addNewPetButton: {
    backgroundColor: '#f5dc93',
    padding: 20,
    borderRadius: 10,
    borderStyle: 'dashed',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addNewPetText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
