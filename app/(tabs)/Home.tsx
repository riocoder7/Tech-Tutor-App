import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList
} from 'react-native';
import CourseList from '../components/courseList';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';

export default function Home() {
  const router = useRouter();

  // Render function for each item in the FlatList
  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity 
        onPress={() => router.push('/screens/Search')} 
        style={styles.SearchBar}
      >
        <Ionicons name="search-outline" size={24} color={Colors.black} />
        <Text style={styles.searchText}>Search</Text>
      </TouchableOpacity>
      <CourseList />
    </View>
  );

  return (
    <View style={styles.wrapper}>
      <FlatList
        data={[null]}  // Dummy data to populate the FlatList
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        style={styles.flatList}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: 'white'
  },
  flatList: {
    backgroundColor: 'white'
  },
  contentContainer: {
    backgroundColor: 'white',
    // paddingHorizontal: 16,
    paddingBottom: 20,
    // marginTop: 10,
  },
  itemContainer: {
    backgroundColor: 'white',
    marginTop: 5,
  },
  SearchBar: {
    flexDirection: 'row',
    backgroundColor: Colors.bgColor,
    padding: 8,
    marginTop: 10,
    marginHorizontal: 8,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  searchText: {
    fontFamily: 'outfit',
    paddingTop: 2,
    marginLeft: 3,
    fontSize: 16,
    color: Colors.black
  },
});

