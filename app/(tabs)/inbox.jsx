import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { db, auth } from './../../config/firebaseConfig';
import { collection, query, where, onSnapshot, getDoc, doc } from 'firebase/firestore';
import { useRouter } from 'expo-router';

export default function Inbox() {
  const [chats, setChats] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoadingAuth(false);
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    const chatsRef = collection(db, 'chats');
    const q = query(chatsRef, where('participants', 'array-contains', currentUser.uid));

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const chatsFirestore = await Promise.all(
        querySnapshot.docs.map(async (docSnapshot) => {
          const chatData = docSnapshot.data();
          const otherUserId = chatData.participants.find(id => id !== currentUser.uid);

          try {
            const otherUserDoc = await getDoc(doc(db, 'users', otherUserId));
            const otherUserData = otherUserDoc.exists() ? otherUserDoc.data() : null;

            return {
              id: docSnapshot.id,
              lastMessage: chatData.lastMessage,
              lastUpdated: chatData.lastUpdated,
              userName: otherUserData?.name || 'Unknown',
              userProfilePicture: otherUserData?.profilePicture || 'https://example.com/default-avatar.png',
              animalId: chatData.animalId,
              otherUserId: otherUserId,
            };
          } catch (error) {
            console.error('Error fetching user data:', error);
            return {
              id: docSnapshot.id,
              lastMessage: chatData.lastMessage,
              lastUpdated: chatData.lastUpdated,
              userName: 'Unknown',
              userProfilePicture: 'https://example.com/default-avatar.png',
              animalId: chatData.animalId,
              otherUserId: otherUserId,
            };
          }
        })
      );

      chatsFirestore.sort((a, b) => b.lastUpdated - a.lastUpdated);
      setChats(chatsFirestore);
    });

    return () => unsubscribe();
  }, [currentUser]);

  if (loadingAuth) {
    return <ActivityIndicator />;
  }

  if (!currentUser) {
    return <Text>Please log in to view your chats.</Text>;
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => router.push({
        pathname: '/ChatScreen',
        params: {
          ownerId: item.otherUserId,
          animalId: item.animalId,
        },
      })}
    >
      <Image source={{ uri: item.userProfilePicture }} style={styles.avatar} />
      <View style={styles.chatInfo}>
        <Text style={styles.userName}>{item.userName}</Text>
        <Text style={styles.lastMessage}>{item.lastMessage}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {chats.length === 0 ? (
        <Text style={styles.noChats}>No chats yet.</Text>
      ) : (
        <FlatList
          data={chats}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      )}
    </View>
  );
}

// Styles for the InboxScreen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20, // Yukarıdan boşluk
    backgroundColor: '#f9f9f9', // Arka plan rengi
  },
  chatItem: {
    flexDirection: 'row',
    padding: 15,
    marginVertical: 8, // Elemanlar arasına dikey boşluk ekler
    marginHorizontal: 10, // Kenarlardan yatay boşluk ekler
    borderRadius: 10, // Köşeleri yuvarla
    backgroundColor: '#ffffff', // Beyaz arka plan rengi
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, // Android'de gölge efekti
  },
  avatar: {
    width: 60, // Daha büyük avatar boyutu
    height: 60,
    borderRadius: 30,
  },
  chatInfo: {
    marginLeft: 15,
    justifyContent: 'center',
    flex: 1, // Esneklik sağlamak için
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 18, // Daha büyük font boyutu
    color: '#333', // Daha belirgin bir renk
  },
  lastMessage: {
    color: '#888',
    fontSize: 14, // Daha küçük font boyutu
    marginTop: 5, // Kullanıcı adı ve son mesaj arasında boşluk
  },
  noChats: {
    marginTop: 50,
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
  },
});
