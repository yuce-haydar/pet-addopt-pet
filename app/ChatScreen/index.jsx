import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { db, auth } from './../../config/firebaseConfig';
import { collection, doc, addDoc, query, orderBy, onSnapshot, getDoc, setDoc } from 'firebase/firestore';
import { useLocalSearchParams } from 'expo-router';

export default function ChatScreen() {
  const { ownerId, animalId } = useLocalSearchParams();
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoadingAuth(false);
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!currentUser || !ownerId || !animalId) return;

    let unsubscribe;

    const createOrLoadChat = async () => {
      try {
        const chatIdGenerated = [currentUser.uid, ownerId, animalId].sort().join('_');
        setChatId(chatIdGenerated);

        const chatRef = doc(db, 'chats', chatIdGenerated);
        const chatDoc = await getDoc(chatRef);

        if (!chatDoc.exists()) {
          await setDoc(chatRef, {
            participants: [currentUser.uid, ownerId],
            lastMessage: '',
            lastUpdated: new Date(),
            animalId: animalId,
          });
        }

        const messagesRef = collection(db, 'chats', chatIdGenerated, 'messages');
        const q = query(messagesRef, orderBy('timestamp', 'asc')); // Mesajları eskiden yeniye doğru sıralayın

        unsubscribe = onSnapshot(q, (querySnapshot) => {
          const messagesFirestore = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setMessages(messagesFirestore);
        });
      } catch (error) {
        console.error('Error loading chat:', error);
      }
    };

    createOrLoadChat();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [currentUser, ownerId, animalId]);

  const sendMessage = async () => {
    if (messageText.trim() === '' || !chatId) return;

    try {
      const messagesRef = collection(db, 'chats', chatId, 'messages');

      await addDoc(messagesRef, {
        senderId: currentUser.uid,
        text: messageText,
        timestamp: new Date(),
      });

      const chatRef = doc(db, 'chats', chatId);
      await setDoc(chatRef, {
        lastMessage: messageText,
        lastUpdated: new Date(),
      }, { merge: true });

      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loadingAuth) {
    return <ActivityIndicator />;
  }

  if (!currentUser) {
    return <Text>Please log in to continue.</Text>;
  }

  const renderItem = ({ item }) => {
    const isMyMessage = item.senderId === currentUser.uid;
    return (
      <View style={[styles.messageContainer, isMyMessage ? styles.myMessage : styles.otherMessage]}>
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        // inverted={true} Bu satırı kaldırdık
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Type your message..."
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
}

// Styles for the ChatScreen
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageContainer: {
    marginVertical: 5,
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 10,
    maxWidth: '70%',
  },
  myMessage: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#CCC',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginRight: 10,
  },
});
