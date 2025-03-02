import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { app } from '@/config/firebaseConfig'; // Adjust the import based on where your Firebase config is
import Colors from '@/constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { auth } from '@/config/firebaseConfig'; // Import Firebase auth for checking user

// Firestore reference
const db = getFirestore(app);

const CourseList: React.FC = () => {
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // State to track loading status
  const categories: string[] = ['coding', 'development', 'database', 'new Tech'];

  useEffect(() => {
    // Function to fetch courses data from Firestore
    const fetchCourses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'courses')); // 'courses' is the collection name in Firestore
        const fetchedCourses: any[] = [];
        querySnapshot.forEach((doc) => {
          fetchedCourses.push({ id: doc.id, ...doc.data() }); // Push course data into the array
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

  const handleCoursePress = async (item: any) => {
    const user = auth.currentUser;

    if (!user) return;

    // Check if the user is already enrolled in the course
    const courseRef = doc(db, `users/${user.uid}/enrolledCourses`, item.courseTitle);
    const docSnap = await getDoc(courseRef);

    // If the course exists in enrolledCourses, redirect to Course Details screen
    if (docSnap.exists()) {
      router.push({
        pathname: '/courseView/courseDetail', // Redirect to Course Detail Screen
        params: {
          courseParams: JSON.stringify(item),
        },
      });
    } else {
      // Otherwise, redirect to Course View screen
      router.push({
        pathname: '../courseView', // Redirect to Course View Screen
        params: {
          courseParams: JSON.stringify(item),
        },
      });
    }
  };

  const renderCourseItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.courseItem}
      onPress={() => handleCoursePress(item)} // Handle course press
    >
      <Image source={require('@/assets/images/javascript_icon.webp')} style={styles.courseImage} />
      <Text style={styles.courseTitle}>{item.courseTitle || 'No Title Available'}</Text>
      <View style={{ flexDirection: 'row', marginLeft: 7, marginBottom: 7 }}>
        <Ionicons name="book-outline" size={20} color={Colors.primary} />
        <Text style={styles.courseChapters}>
          {item.noOfChapter ? `${item.noOfChapter} Chapters` : 'No Chapters Available'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderCourseItemp = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.courseItemp}
      onPress={() => handleCoursePress(item)} // Handle course press
    >
      <Image source={require('@/assets/images/javascript_icon.webp')} style={styles.courseImagep} />
      <View>
        <Text style={styles.courseTitlep}>{item.courseTitle || 'No Title Available'}</Text>
        <View style={{ flexDirection: 'row', marginLeft: 7, marginBottom: 7 }}>
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
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
                <ActivityIndicator size="large" color={Colors.primary} /> 
              </View>
      ) : (
        <>
          {/* Popular Courses Section */}
          {popularCourses.length > 0 && (
            <View style={{marginTop:15 }}>
              <Text style={styles.header}>Must Try Courses</Text>
              <FlatList
                data={popularCourses}
                renderItem={renderCourseItemp}
                keyExtractor={(item) => item.id}
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
                keyExtractor={(item) => item.id}
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
    marginLeft: 5,
  },
  header: {
    fontSize: 20,
    fontFamily: 'outfit-bold',
    marginTop: 10,
  },
  row: {},
  courseItemp: {
    flexDirection: 'row',
    backgroundColor: Colors.bluebg,
    borderRadius: 8,
    margin: 10,
    width: 220,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 }, // Shadow at the bottom
    shadowOpacity: 0.2,
    shadowRadius: 3,
    // ✅ Shadow for Android
    elevation: 5,
  },
  courseItem: {
    backgroundColor: Colors.bluebg,
    borderRadius: 8,
    marginLeft: 15,
    marginVertical: 20,
    marginHorizontal:20,
    width: 140,
    shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 }, // Shadow at the bottom
  shadowOpacity: 0.2,
  shadowRadius: 3,
  // ✅ Shadow for Android
  elevation: 5,
  },
  courseImage: {
    width: '100%',
    height: 100,
    borderTopRightRadius: 7,
    borderTopLeftRadius: 7,
    marginBottom: 5,
  },
  courseImagep: {
    width: 90,
    height: 90,
    borderTopLeftRadius: 7,
    borderBottomLeftRadius: 7,
  },
  courseTitle: {
    fontSize: 16,
    fontFamily: 'outfit-bold',
    marginLeft: 5,
  },
  courseTitlep: {
    marginTop: 5,
    marginLeft: 5,
    width: 115,
    fontSize: 16,
    fontFamily: 'outfit-bold',
  },
  courseChaptersp: {
    fontSize: 14,
    fontFamily: 'outfit',
    color: Colors.primary,
    marginLeft: 5,
  },
  courseChapters: {
    fontSize: 14,
    fontFamily: 'outfit',
    color: Colors.primary,
    marginLeft: 5,
  },
});

export default CourseList;
