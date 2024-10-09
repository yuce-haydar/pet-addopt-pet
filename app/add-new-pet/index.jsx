import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { db, storage, auth } from '../../config/firebaseConfig'; // Firebase ayarlarını import ediyoruz
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Gerekli fonksiyonları import ediyoruz
import { doc, setDoc } from 'firebase/firestore'; // Firestore fonksiyonlarını import ediyoruz

export default function AddNewPet() {
  // Form durum değişkenleri
  const [formData, setFormData] = useState({
    petName: '',
    breed: '',
    age: '',
    weight: '',
    address: '',
    about: '',
    category: '',
    sex: '',
  });
  const [imageUri, setImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Kullanıcı verileri
  const user = auth.currentUser;

  // Resim seçme fonksiyonu
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'İzin Gerekli',
          'Bu özelliği kullanmak için galeri erişim iznine ihtiyacımız var!'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setImageUri(asset.uri);
      } else {
      }
    } catch (error) {
      console.error('Resim seçerken hata oluştu:', error);
      Alert.alert('Hata', `Resim seçerken bir hata oluştu: ${error.message}`);
    }
  };

  // Form verilerini güncelleme fonksiyonu
  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Form verilerini ve resmi kaydetme fonksiyonu
  const handleAddPet = async () => {
    // Form verilerinin doluluğunu kontrol edin
    if (
      !formData.petName ||
      !formData.breed ||
      !formData.age ||
      !formData.weight ||
      !formData.address ||
      !formData.about ||
      !formData.category ||
      !formData.sex ||
      !imageUri
    ) {
      Alert.alert('Uyarı', 'Lütfen tüm alanları doldurun ve bir resim seçin.');
      return;
    }

    setUploading(true);

    try {
      // Benzersiz bir belge ID'si oluşturun
      const docId = Date.now().toString();

      // Resmi Blob olarak okuyun
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function (e) {
          console.error('xhr.onerror', e);
          reject(new TypeError('Ağ isteği başarısız oldu'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', imageUri, true);
        xhr.send(null);
      });

      // Resmi Firebase Storage'daki 'addpet' klasörüne yükleyin
      const imageRef = ref(storage, `addpet/${docId}.jpg`);
      await uploadBytes(imageRef, blob);

      // Blob'u serbest bırakın
      blob.close();

      // Resmin indirme URL'sini alın
      const imageUrl = await getDownloadURL(imageRef);

      // Form verilerini Firestore'a kaydedin
      await setDoc(doc(db, 'Pets', docId), {
        ...formData,
        imageUrl: imageUrl,
        ownerId: user?.uid, // Evcil hayvanı ekleyen kullanıcının uid'si
        ownerName: user?.displayName || 'Anonymous', // Kullanıcının adı
        ownerEmail: user?.email, // Kullanıcının email adresi
        createdAt: new Date(),
      });

      Alert.alert('Başarılı', 'Evcil hayvan başarıyla eklendi!');

      // Form alanlarını sıfırlayın
      setFormData({
        petName: '',
        breed: '',
        age: '',
        weight: '',
        address: '',
        about: '',
        category: '',
        sex: '',
      });
      setImageUri(null);
    } catch (error) {
      console.error('Evcil hayvan eklerken hata oluştu:', error);
      Alert.alert('Hata', `Bir hata oluştu: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Evcil Hayvan Sahiplendirme</Text>

        {/* Evcil Hayvan Resmi */}
        <View style={styles.imageContainer}>
          <TouchableOpacity onPress={pickImage}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.image} />
            ) : (
              <Image source={require('../../assets/images/bone.png')} style={styles.image} />
            )}
          </TouchableOpacity>
        </View>

        {/* Form Alanları */}
        <TextInput
          style={styles.input}
          placeholder="Evcil Hayvan İsmi *"
          value={formData.petName}
          onChangeText={(text) => handleInputChange('petName', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Tür *"
          value={formData.breed}
          onChangeText={(text) => handleInputChange('breed', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Yaş *"
          value={formData.age}
          onChangeText={(text) => handleInputChange('age', text)}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Ağırlık *"
          value={formData.weight}
          onChangeText={(text) => handleInputChange('weight', text)}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Adres *"
          value={formData.address}
          onChangeText={(text) => handleInputChange('address', text)}
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Hakkında *"
          value={formData.about}
          onChangeText={(text) => handleInputChange('about', text)}
          multiline={true}
          numberOfLines={4}
        />

        {/* Kategori Seçimi */}
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Kategori *</Text>
          <Picker
            selectedValue={formData.category}
            onValueChange={(itemValue) => handleInputChange('category', itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Seçiniz..." value="" />
            <Picker.Item label="Dogs" value="Dogs" />
            <Picker.Item label="Fish" value="Fish" />
            <Picker.Item label="Cats" value="Cats" />
            <Picker.Item label="Bird" value="Bird" />
          </Picker>
        </View>

        {/* Cinsiyet Seçimi */}
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Cinsiyet *</Text>
          <Picker
            selectedValue={formData.sex}
            onValueChange={(itemValue) => handleInputChange('sex', itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Seçiniz..." value="" />
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
          </Picker>
        </View>

        {/* Gönder Butonu */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleAddPet}
          disabled={uploading}
        >
          <Text style={styles.submitButtonText}>
            {uploading ? 'Yükleniyor...' : 'Evcil Hayvan Ekle'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Yükleniyor Ekranı */}
      {uploading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fabb00" />
          <Text style={styles.loadingText}>Yükleniyor...</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

// Stiller
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    marginBottom: 15,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  picker: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  submitButton: {
    backgroundColor: '#fabb00',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#fff',
    fontSize: 18,
  },
});
