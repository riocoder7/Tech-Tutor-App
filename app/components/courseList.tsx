import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '@/config/firebaseConfig'; // Adjust the import based on where your Firebase config is
import Colors from '@/constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
// Firestore reference
const db = getFirestore(app);

const CourseList: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // State to track loading status
  const categories: string[] = [ 'coding','development', 'database','new Tech'];

  useEffect(() => {
    // Function to fetch courses data from Firestore
    const fetchCourses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'courses')); // 'courses' is the collection name in Firestore
        const fetchedCourses: any[] = [];
        querySnapshot.forEach((doc) => {
          fetchedCourses.push(doc.data()); // Push course data into the array
        });
        setCourses(fetchedCourses); // Set the courses state with fetched data
      } catch (error) {
        console.error('Error fetching courses: ', error);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchCourses(); // Call the function to fetch courses data
  }, []);

  const renderCourseItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.courseItem}>
      <Image source={require('@/assets/images/java.png')} style={styles.courseImage} />
      <Text style={styles.courseTitle}>{item.courseTitle || 'No Title Available'}</Text>
      <View style={{flexDirection:'row',marginLeft:7,marginBottom:7}}>
      <Ionicons name="book-outline" size={20} color={Colors.primary} />
      <Text style={styles.courseChapters}>
        {item.noOfChapter ? `${item.noOfChapter} Chapters` : 'No Chapters Available'}
      </Text>
      </View>
    </TouchableOpacity>
  );
  
  const renderCourseItemp = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.courseItemp}>
      <Image source={require('@/assets/images/java.png')} style={styles.courseImagep} />
    <View>
      <Text style={styles.courseTitlep}>{item.courseTitle || 'No Title Available'}</Text>
      <View style={{flexDirection:'row',marginLeft:7,marginBottom:7}}>
      <Ionicons name="book-outline" size={20} color={Colors.primary} />
      <Text style={styles.courseChaptersp}>
        {item.noOfChapter ? `${item.noOfChapter} Chapters` : 'No Chapters Available'}
      </Text>
      </View>
    </View>
    </TouchableOpacity>
  );

  // Filter the courses for the "Popular Courses" section
  const popularCourses = courses.filter((course) => course.type === 'popular');

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          {/* Popular Courses Section */}
          {popularCourses.length > 0 && (
            <View>
              <Text style={styles.header}>Popular Courses</Text>
              <FlatList
                data={popularCourses}
                renderItem={renderCourseItemp}
                keyExtractor={(item, index) => `popular-${index}`}
                horizontal={true}
              />
            </View>
          )}

          {/* Categories Section - Grid Layout */}
          {categories.map((category) => (
            <View key={category}>
              <Text style={styles.header}>
                {category.charAt(0).toUpperCase() + category.slice(1)} Courses
              </Text>
              <FlatList
                data={courses.filter((course) => course.category === category)}
                renderItem={renderCourseItem}
                keyExtractor={(item, index) => `${category}-${index}`}
                numColumns={2} // Set the grid to 2 columns
                columnWrapperStyle={styles.row} // Styling the row to add spacing between items
              />
            </View>
          ))}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft:5,
  },
  header: {
    fontSize: 20,
    fontFamily:'outfit-bold',
    marginTop: 10,
  },
  row: {},
  courseItemp:{
    flexDirection:'row',
    backgroundColor:Colors.bgColor,
    borderWidth: 1,
    borderColor: '#eaecee',
    borderRadius: 8,
    margin: 10, 
    width: 220,
  },
  courseItem: {
    backgroundColor:Colors.bgColor,
    borderWidth: 1,
    borderColor: '#eaecee',
    borderRadius: 8,
    marginLeft:15,
    marginVertical:10,
    width: 150, 
  },
  courseImage: {
    width: '100%',
    height: 100,
    borderTopRightRadius:7,
    borderTopLeftRadius:7,
    marginBottom:5,
  },
  courseImagep: {
    width: 90,
    height: 90,
    borderTopLeftRadius:7,
    borderBottomLeftRadius:7,
  },
  courseTitle: {
    fontSize: 16,
    fontFamily:'outfit-bold',
    marginLeft:5,
  },
  courseTitlep: {
    marginTop:5,
    marginLeft:5,
    width: 115,
    fontSize: 16,
    fontFamily:'outfit-bold',
  },
  courseChaptersp: {
    fontSize: 14,
    fontFamily:'outfit',
    color: Colors.primary,
    marginLeft:5,
  },
  courseChapters: {
    fontSize: 14,
    fontFamily:'outfit',
    color:Colors.primary,
    marginLeft:5,
  },
});

export default CourseList;