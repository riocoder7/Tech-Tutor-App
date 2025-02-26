import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '@/config/firebaseConfig'; // Adjust the import path based on your setup
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';

// Firestore reference
const db = getFirestore(app);

const Quizz: React.FC = () => {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'quizzes')); // 'quizzes' collection
        const fetchedQuizzes: any[] = [];
        querySnapshot.forEach((doc) => {
          fetchedQuizzes.push({ id: doc.id, ...doc.data() });
        });
        setQuizzes(fetchedQuizzes);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const handleQuizPress = (quiz: any) => {
    router.push({
      pathname: '/screens/quizzDetail',
      params: { quizParams: JSON.stringify(quiz) },
    });
  };

  const renderQuizItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.quizItem} onPress={() => handleQuizPress(item)}>
      <Image source={require('@/assets/images/quizz.jpeg')} style={styles.quizImage} />
      <Text style={styles.quizTitle}>{item.title || 'Untitled Quiz'}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Fixed Header */}
      <View style={{ flexDirection: 'row', padding: 5, backgroundColor: 'white',shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,marginBottom:10, }}>
          <TouchableOpacity onPress={() => router.replace('/(tabs)/Home')}>
            <Ionicons name="arrow-back" size={30} color={Colors.black} />
          </TouchableOpacity>
          <Text style={{paddingLeft:5, fontFamily:'outfit-bold',fontSize:24}}>Quizzes</Text>
    </View>

      {/* Loading State */}
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={quizzes}
          renderItem={renderQuizItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 60,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  headerText: {
    fontSize: 20,
    fontFamily: 'outfit-bold',
    color: '#fff',
  },
  list: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  quizItem: {
    backgroundColor: Colors.bluebg,
    borderRadius: 10,
    margin: 10,
    // padding: 10,
    alignItems: 'center',
    width: '45%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  quizImage: {
    borderTopLeftRadius:10,
    borderTopRightRadius:10,
    width: '100%',
    height: 80,
  },
  quizTitle: {
    padding:5,
    fontSize: 16,
    fontFamily: 'outfit-bold',
    textAlign: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Quizz;
