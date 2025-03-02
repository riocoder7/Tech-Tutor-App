import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { auth, db } from '@/config/firebaseConfig'; // Ensure correct Firebase config import
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';

interface Course {
  courseTitle: string;
  description: string;
  type: string;
  category: string;
  image: string;
  noOfChapter: string;
  chapters: Array<any>;
}

export default function EnrolledCoursesScreen() {
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = auth.currentUser;
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchEnrolledCourses();
    }
  }, [user]);

  const fetchEnrolledCourses = async () => {
    if (!user) return;

    try {
      const coursesRef = collection(db, `users/${user.uid}/enrolledCourses`);
      const q = query(coursesRef);
      const querySnapshot = await getDocs(q);

      const courses: Course[] = [];
      querySnapshot.forEach((doc) => {
        courses.push(doc.data() as Course);
      });

      setEnrolledCourses(courses);
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToCourseDetails = (course: Course) => {
    router.replace({
      pathname: '/courseView/courseDetail',
      params: { courseParams: JSON.stringify(course) },
    });
  };

  const renderCourseItem = ({ item }: { item: Course }) => (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        marginHorizontal: 20,
        padding: 10,
        backgroundColor: Colors.bluebg,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 }, // Shadow at the bottom
        shadowOpacity: 0.2,
        shadowRadius: 3,
        // ✅ Shadow for Android
        elevation: 5,
      }}
      onPress={() => navigateToCourseDetails(item)}
    >
      <Image
        source={require('@/assets/images/javascript_icon.webp')}
        style={{ width: 100, height: 100, borderRadius: 8, marginRight: 15 }}
      />
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 18, fontFamily: 'outfit-bold' }}>{item.courseTitle}</Text>
        <Text numberOfLines={2} style={{ color: '#555', fontFamily: 'outfit' }}>
          {item.description}
        </Text>
        <View style={{ flexDirection: 'row', marginVertical: 7 }}>
          <Ionicons name="book-outline" size={20} color={Colors.primary} />
          <Text style={{ fontSize: 14, fontFamily: 'outfit', color: Colors.primary, marginLeft: 5, }}>
            {item.noOfChapter ? `${item.noOfChapter} Chapters` : 'No Chapters Available'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        paddingBottom:10,
        paddingTop: 15,
        paddingLeft: 15,
        backgroundColor: "white",
        zIndex: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 }, // Shadow at the bottom
        shadowOpacity: 0.2,
        shadowRadius: 3,
        // ✅ Shadow for Android
        elevation: 5,
      }}>
        <View style={{ flexDirection: "row", }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={30} color="black" />
          </TouchableOpacity >
          <Text style={{ marginLeft: 5, fontSize: 24, fontFamily: 'outfit' }}>My Courses</Text>
        </View>
      </View>
      {enrolledCourses.length === 0 ? (
        <View style={{
          justifyContent: 'center',
          alignItems: 'center', marginTop: '60%'
        }}>
          <Entypo style={{
          }} name="open-book" size={100} color="gray" />
          <Text style={{
            fontFamily: 'outfit-bold', fontSize: 24,
            color: "#888", textAlign: 'center'
          }}> You are not enrolled in any courses yet.</Text>
        </View>
      ) : (
        <View style={{ marginTop: 70 }}>
          <FlatList
            data={enrolledCourses}
            renderItem={renderCourseItem}
            keyExtractor={(item) => item.courseTitle}
          />
        </View>
      )}
    </View>
  );
}
