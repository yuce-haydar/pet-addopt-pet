import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { db, auth } from './../../config/firebaseConfig';
import { collection, query, where, onSnapshot, getDoc, doc } from 'firebase/firestore';
import { useRouter } from 'expo-router';

export default function Inbox() {
  const [chats, setChats] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      setLoading(false);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!currentUser) return;
  
    const chatsRef = collection(db, 'chats');
    const q = query(chatsRef, where('participants', 'array-contains', currentUser.uid));
  
    const unsubscribe = onSnapshot(q, async querySnapshot => {
      const chatsFirestore = await Promise.all(
        querySnapshot.docs.map(async docSnapshot => {
          const chatData = docSnapshot.data();
  
          // chatData ve participants dizisinin var olup olmadığını kontrol ediyoruz
          if (!chatData || !chatData.participants || !Array.isArray(chatData.participants)) {
            console.error('Invalid chatData or participants array:', chatData);
            return null;
          }
  
          // Eğer participants dizisinde sadece tek bir unique ID varsa, bu sohbeti geçiyoruz
          const uniqueParticipants = [...new Set(chatData.participants)];
          if (uniqueParticipants.length < 2) {
            console.error('Participants array does not contain two unique user IDs:', uniqueParticipants);
            return null;
          }
  
          // otherUserId'yi currentUser.uid'den farklı olan ID'yi seçerek belirliyoruz
          const otherUserId = uniqueParticipants.find(id => id !== currentUser.uid);
  
          if (!otherUserId) {
            console.error('No valid otherUserId found for chat:', docSnapshot.id);
            return null;
          }
  
          try {
            const otherUserDoc = await getDoc(doc(db, 'Users', otherUserId));
            const otherUserData = otherUserDoc.exists() ? otherUserDoc.data() : {};
  
            return {
              id: docSnapshot.id, // Güvenilir ID
              lastMessage: chatData.lastMessage || 'No messages yet.',
              lastUpdated: chatData.lastUpdated?.toDate() || new Date(),
              userName: otherUserData.displayName || 'Unknown',
              userProfilePicture: otherUserData.profilePicture || 'data:image/png;base64,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',
              animalId: chatData.animalId || null,
              otherUserId,
            };
          } catch (error) {
            console.error('Error fetching user data for otherUserId:', otherUserId, error);
            return null; // Hata durumunda null dönüyoruz
          }
        })
      );
  
      const validChats = chatsFirestore.filter(chat => chat !== null);
      validChats.sort((a, b) => b.lastUpdated - a.lastUpdated); // En güncel chat'leri öne al
      setChats(validChats);
    });
  
    return () => unsubscribe();
  }, [currentUser]);
  

  if (loading) {
    return <ActivityIndicator />;
  }

  if (!currentUser) {
    return <Text>Please log in to view your chats.</Text>;
  }

  return (
    <View style={styles.container}>
      {chats.length === 0 ? (
        <Text style={styles.noChats}>No chats yet.</Text>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={item => item.id} // Her chat için güvenilir ID
          renderItem={({ item }) => (
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
          )}
        />
      )}
    </View>
  );
}

// Styles for the InboxScreen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#f9f9f9',
  },
  chatItem: {
    flexDirection: 'row',
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  chatInfo: {
    marginLeft: 15,
    justifyContent: 'center',
    flex: 1,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#333',
  },
  lastMessage: {
    color: '#888',
    fontSize: 14,
    marginTop: 5,
  },
  noChats: {
    marginTop: 50,
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
  },
});
