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
            const otherUserDoc = await getDoc(doc(db, 'Users', otherUserId));
            const otherUserData = otherUserDoc.exists() ? otherUserDoc.data() : null;
            console.log('otherUserData:', otherUserData); 
            console.log('chatData:', chatData);
            console.log('otherUserDoc:', otherUserDoc);
            return {
              id: docSnapshot.id,
              lastMessage: chatData.lastMessage,
              lastUpdated: chatData.lastUpdated,
              userName: otherUserData?.name || 'Unknown',
              userProfilePicture: otherUserData?.profilePicture || './../../assets/images/avatar.png',
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
              userProfilePicture: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKgAAACUCAMAAAAwLZJQAAAAYFBMVEX///9UWV3a29xXXWBPVFhLUVVHTVJKT1RBR0yAg4b7+/v19fXV1tdgZGg+REnn6OiytLW6vL11eXyJjI6dn6FqbnHBwsPi4uM3PkMuNjzu7+/LzM2SlZenqqspMTdvc3bQRQCXAAAEU0lEQVR4nO2c2bKrKhBAYwTUKM5THOL//+XRmNyd8crQQKxiPe23vaobmqnN4QDCqclyHyPnCYT9PGtOMP8BhLAuiP9ieXP1SVGHpv3upBThT5YrGNPUtOFCmGH/u+WKjzPjUY2CdktzoQ0is57l/yX9aQCg0qBmUm1m/SH/VWLKs6eM4bwFlfaGPL2PFek7yDNimnKk/Y5voFClnOG8BVW7aSQQz2tMNZepSCie15hqNQ0nrvn+CJ50LlIBEfV0HBLo86yZls1vtLUuz4TKeDoO1bVElRKJXyCalv2jYGX6wz9qEc09WVEv1+HZxLKejhM3GkQL4RL6By7UezaSU36Fqg9pJjnlV0im2jMMADI/5z5QvZAmIAGdQ6q66NcAc34hVr2OwmR+yb1iUelif8dT69kBZX7OfadUVPQE8o7iMwlMFV1QXElLoLk0zya1e71C+FD3ClK73AdwomrrkxW1or8uuptZv5s6msJtStReQO5mrd/N7ukAF1G1nvvZ4WdQZybV5+UEKPe+6lPobs71hxTmpkT9M85u7p52c5t3OEq9NKy0Wq6cc+mQYi03zoej9HQieu7wT4Psq8igqcVIduLrmPIrcnePym8cH8hl3kL1zKSVrhJ/Bq8Ub0Sf2ct7/TxML2KeF40DdEXsAlL9s807ItsoDZumD/BnX3/eV3qXr5PMNdRJNi9ROU9vXq5tQXonHFrGOoXawWwLaTQRBlVEJsP9o3NQR7rdkUtH4x25M8l4/tyJfYumfx6NdY6+kk4O+VgBMHGmn2jF/o9+DHD8PFwRiUkw9r/Uh38lbPqyas9tG8+08x9V2Te/MDS/kByjvo+OPzMqLRaLZWeEYdclSdeFP1fqT13SRH1aFrlL2vNMe+X6F3HzokzrqEk6swtpF2XjEFQojn3ioQ87KIQw8eMYV8EwZpHWm4c/orKiLvos+C7sEeTSqtS8fe6icbrEvB/fXPdTl2rUFdmwLqeY5fzxVXYqNXzYeCwoEre8uyJaKL10TmraAj3Y45ZmqraCzUhjsE6NOa4xHVWc9MPB4Z89G6qeA37YT8oYrEnjERyXkAPglG2f3UXxaQa2aiX563fekCCcwwQ1TFnvl4RV2xRgqCYyX4OxQgLpoEZ8d6CiYFdyF5DKrkKsILlb81FD2u+QUdxT9ps1TlPhbr1BWfH8jD+IeY6aPWdToezDtOPwITKjaiVr+xYe90tU52iqS88gh/ecIv9NpRi8X2LqLKDP8JXTxjWS+AXk8mz7A0OJX/A4OkujszlPxzmz708mY4lfQBOrZ2/UczZlfC4/FQZH6IJXsJ2iGrOaC2wTX+QnXWBh/IEY8eYrKFDF4tkBNLLK0rKs+LXxzM+5Z9lEDYbn/ILHstc3P0TZBmkI0r4uC92+Oklc05IL7vbNSfMbotsl//gbottX/FaUCysKjRWFxopCY0WhsaLQWFForCg0VhQaKwqNFYVmx6L/AI54VJuqB6haAAAAAElFTkSuQmCC',
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
    console.log('item:', item),
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
