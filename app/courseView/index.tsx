import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { auth, db } from '@/config/firebaseConfig'; // Ensure correct Firebase config import
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
import Colors from '@/constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';

interface Chapter {
  chapterName: string;
}

interface Course {
  courseTitle: string;
  description: string;
  type: string;
  category: string;
  image: string;
  noOfChapter: string;
  chapters: Chapter[];
}

export default function CourseView() {
  const { courseParams } = useLocalSearchParams();
  const router = useRouter();

  let course: Course | null = null;
  try {
    course = JSON.parse(courseParams as string);
  } catch (error) {
    console.error('Error parsing courseParams:', error);
  }

  const [isLoading, setIsLoading] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isChaptersVisible, setIsChaptersVisible] = useState(false); // To toggle visibility of chapters
  const user = auth.currentUser; // Get the logged-in user

  useEffect(() => {
    if (user && course) {
      checkEnrollment();
    }
  }, [user, course]);

  // 🔍 Check if the user is already enrolled in the course
  const checkEnrollment = async () => {
    if (!user || !course) return;
    const courseRef = doc(db, `users/${user.uid}/enrolledCourses`, course.courseTitle);
    const docSnap = await getDoc(courseRef);

    if (docSnap.exists()) {
      setIsEnrolled(true); // User is already enrolled
    }
  };

  // 📌 Handle course enrollment
  const enrollCourse = async () => {
    if (!user || !course) return;

    setIsLoading(true);

    try {
      // ✅ Correct Firestore path: users/{userId}/enrolledCourses/{courseTitle}
      const courseRef = doc(collection(db, `users/${user.uid}/enrolledCourses`), course.courseTitle);

      await setDoc(courseRef, {
        courseTitle: course.courseTitle,
        description: course.description,
        type: course.type,
        category: course.category,
        image: course.image,
        noOfChapter: course.noOfChapter,
        chapters: course.chapters,
        enrolledAt: new Date().toISOString(), // Track enrollment date
      });

      setIsEnrolled(true); // Set enrollment status to true
    } catch (error) {
      console.error('Error enrolling in course:', error);
      Alert.alert('Enrollment Error', 'Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // 📌 Navigate to the detailed course screen
  const startLearning = () => {
    router.replace({
      pathname: '/courseView/courseDetail',
      params: { courseParams: JSON.stringify(course) },
    });
  };

  // 📌 Toggle visibility of the chapters list
  const toggleChaptersList = () => {
    setIsChaptersVisible(prevState => !prevState);
  };

  if (!course) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <Text>Error: Unable to load course details.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView>
      <View style={{
        flexDirection:'row',
        padding:5,
        backgroundColor: "white",
      }}>
        <TouchableOpacity  onPress={() => router.replace('/(tabs)/Home')}>
          <Ionicons name="arrow-back" size={30} color="black" />
        </TouchableOpacity >
        {/* <Text style={{ marginLeft: 5, fontSize: 18, fontFamily: 'outfit' }}>Search</Text> */}
      </View>
        <View>
          <Image source={require('@/assets/images/javascript_icon.webp')} style={{ width: '100%', height: 200 }} />
          <Text style={{ fontSize: 24, fontFamily: 'outfit-bold', marginVertical: 5, marginLeft: 5, }}>{course.courseTitle}</Text>
          <View style={{ flexDirection: 'row', marginLeft: 7, }}>
            <Ionicons name="book-outline" size={22} color={Colors.primary} />
            <Text style={{
              fontSize: 18,
              fontFamily: 'outfit',
              color: Colors.primary,
              marginLeft: 5,
            }}>
              {course.noOfChapter} Chapters
            </Text>
          </View>
          <Text style={{ fontSize: 20, fontFamily: 'outfit-bold', marginLeft: 5,marginVertical:3, }}>Description:</Text>
          <Text style={{ fontFamily: 'outfit', fontSize: 18, marginLeft: 15,marginBottom:8 }}>{course.description}</Text>
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: isEnrolled ? Colors.green : Colors.primary,
            padding: 8,
            borderRadius: 5,
            alignItems: 'center',
            marginHorizontal: 10,
          }}
          onPress={isEnrolled ? startLearning : enrollCourse}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size='large' color="#fff" />
          ) : (
            <Text style={{ color: 'white', fontSize: 20, fontFamily: 'outfit-bold' }}>
              {isEnrolled ? 'Start Learning' : 'Enroll'}
            </Text>
          )}
        </TouchableOpacity>

        {/* Dropdown for List of Chapters */}
        <TouchableOpacity
          onPress={toggleChaptersList}
          style={{
            backgroundColor: Colors.bgColor,
            padding: 10,
            marginTop: 15,
          }}
        >
          <Text style={{ color: 'black', fontSize: 18, fontFamily: 'outfit-bold' }}>
            {isChaptersVisible ? 'Hide Chapters' : 'List of Chapters'}
          </Text>
        </TouchableOpacity>

        {/* Show Chapters if the list is visible */}
        {isChaptersVisible && (
          <View style={{ marginTop: 10, marginBottom: 10, }}>
            {course.chapters.map((chapter, index) => (
              <Text key={chapter.chapterName} style={{ fontSize: 16, fontFamily: 'outfit', marginLeft: 5 ,marginBottom:5,}}>
                {index + 1}. {chapter.chapterName}
              </Text>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
