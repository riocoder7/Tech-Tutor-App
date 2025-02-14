import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native'; // Import FlatList here
import React from 'react';
import CourseList from '../components/courseList';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter, withLayoutContext } from "expo-router";
import Colors from '@/constants/Colors';

export default function Home() {
  const router = useRouter();
  
  // Render function for each item in the FlatList
  const renderItem = ({ item }: { item: any }) => ( // Specify the type for item
    <View style={{backgroundColor:'white'}}>
    <TouchableOpacity onPress={() => router.replace('/screens/Search')} style={styles.SearchBar}>
      <Ionicons name="search-outline" size={24} color="gray" />
      <Text style={{ fontFamily: 'outfit', paddingTop: 2, marginLeft: 3, fontSize: 16, color: 'gray' }}>
        Search
      </Text>
    </TouchableOpacity>
    <CourseList/>
    </View>
  );

  return (
    <FlatList
      data={[null]}  // Dummy data to populate the FlatList
      renderItem={renderItem}  // Pass the renderItem function
      keyExtractor={(item, index) => index.toString()}  // Unique key for each item
      // ListHeaderComponent={() => <CourseList />}  // Render CourseList as the header
      contentContainerStyle={{ backgroundColor: 'white' }}  // Style for the content
    />
  );
}

const styles = StyleSheet.create({
  SearchBar: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: Colors.bgColor,
    padding: 8,
    marginTop:10,
    marginHorizontal: 8,
    borderRadius: 10,
    elevation: 1,
    borderWidth: 1,
    borderColor: Colors.gray,
  },
});
