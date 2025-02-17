import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import Constants from 'expo-constants'; // For environment variables
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const Chatbot: React.FC = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const flatListRef = useRef<FlatList<Message>>(null);

  const GEMINI_API_KEY = Constants.expoConfig?.extra?.GEMINI_API_KEY || 'AIzaSyByweqMe8GlV6phTmKSmH5pS-RP33QDr-c';
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    setLoading(true);
    
    const userMessage: Message = { text: inputText, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputText('');

    try {
      const response = await axios.post(
        GEMINI_API_URL,
        {
          contents: [
            {
              parts: [{ text: inputText }]
            }
          ]
        },
        { headers: { 'Content-Type': 'application/json' } }
      );

      let botResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response received.';
      botResponse = botResponse.replace(/\*/g, '').replace(/_/g, '');
      displayBotMessage(botResponse);
    } catch (error: any) {
      console.error('Error fetching response:', error.response?.data || error.message);
      Alert.alert('API Error', error.response?.data?.error?.message || 'Something went wrong.');
      displayBotMessage('Error fetching response.');
    } finally {
      setLoading(false);
    }
  };

  const displayBotMessage = (fullText: string) => {
    let words = fullText.split(' ');
    let currentText = '';
    let index = 0;

    const interval = setInterval(() => {
      if (index < words.length) {
        currentText += words[index] + ' ';
        setMessages((prevMessages) => {
          let newMessages = [...prevMessages];
          let lastMessage = newMessages[newMessages.length - 1];

          if (lastMessage?.sender === 'bot') {
            lastMessage.text = currentText;
          } else {
            newMessages.push({ text: currentText, sender: 'bot' });
          }
          return [...newMessages];
        });

        index++;
        scrollToBottom();
      } else {
        clearInterval(interval);
      }
    }, 50);
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 50);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await Clipboard.setStringAsync(text);
      Alert.alert('Copied!', 'Message copied to clipboard.');
    } catch (error) {
      console.error('Error copying text:', error);
      Alert.alert('Error', 'Failed to copy text.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* Back Button & Header */}
      <View style={styles.headerContainer}>
        <View style={{ flexDirection: "row", alignItems: 'center' }}>
          <TouchableOpacity onPress={() => router.replace('/(tabs)/Explore')}>
            <Ionicons name="arrow-back" size={30} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerText}>AI Support</Text>
        </View>
      </View>

      {/* Chat Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={({ item }) => (
          <TouchableOpacity onLongPress={() => copyToClipboard(item.text)} activeOpacity={0.8}>
            <View style={[styles.messageBubble, item.sender === 'user' ? styles.userBubble : styles.botBubble]}>
              <Text style={styles.messageText}>{item.text}</Text>
              <TouchableOpacity onPress={() => copyToClipboard(item.text)} style={styles.copyButton}>
                <Ionicons name="copy-outline" size={18} color="#666" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.chatContainer}
        onContentSizeChange={scrollToBottom}
        onLayout={scrollToBottom}
      />

      {/* Loading Indicator */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#007bff" />
          <Text style={styles.loadingText}>AI is thinking...</Text>
        </View>
      )}

      {/* Input Field */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={sendMessage}
          editable={!loading}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Ionicons name="paper-plane" size={24} color="#fff" />}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingBottom: 10,
    paddingTop: 15,
    paddingLeft: 15,
    backgroundColor: "white",
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  headerText: {
    marginLeft: 10,
    fontSize: 24,
    fontFamily:'outfit-bold'
  },
  chatContainer: {
    flexGrow: 1,
    padding: 10,
    paddingVertical:70,
    // marginTop: 60, // Adjust for header
  },
  messageBubble: {
    maxWidth: '95%',
    padding: 12,
    borderRadius: 20,
    marginBottom: 15,
    position: 'relative',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.bluebg,
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#e0e0e0',
  },
  messageText: {
    color: '#000',
    fontSize: 16,
    fontFamily:'outfit',
    marginRight:25,
  },
  copyButton: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    // padding: 5,
    // marginLeft:20,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  loadingText: {
    marginLeft: 5,
    fontSize: 14,
    color: Colors.primary,
    fontFamily:'outfit'
  },
  inputContainer: {
    marginBottom:25,
    // flex:1,
    borderRadius:25,
    flexDirection: 'row',
    padding: 5,
    backgroundColor: 'white',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    marginHorizontal:5,
  },
  input: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    fontFamily:'outfit',
    fontSize:16,
    marginRight:60,
  },
  sendButton: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    // justifyContent: 'center',
    // alignItems: 'center',
    padding: 10,
    backgroundColor: Colors.primary,
    borderRadius: 25,
  },
});

export default Chatbot;
