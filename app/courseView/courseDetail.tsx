import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '@/constants/Colors';
import { auth, db } from '@/config/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

interface Chapter {
  chapterName: string;
  completed: boolean;
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
  const [storedCourse, setStoredCourse] = useState<Course | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  let course: Course | null = null;
  if (typeof courseParams === 'string') {
    try {
      course = JSON.parse(courseParams);
    } catch (error) {
      console.error('Error parsing courseParams:', error, 'Raw Value:', courseParams);
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (user) {
        setUserId(user.uid);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (course && userId) {
      loadProgress(course, userId);
    }
  }, [course, userId]);

  const loadProgress = async (course: Course, userId: string) => {
    try {
      const courseRef = doc(db, `users/${userId}/enrolledCourses`, course.courseTitle);
      const docSnap = await getDoc(courseRef);

      if (docSnap.exists()) {
        setStoredCourse(docSnap.data() as Course);
      } else {
        setStoredCourse(course);
      }
    } catch (error) {
      console.error('Error loading course progress from Firestore:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const handleChapterPress = (index: number, chapter: Chapter) => {
    if (index > 0 && !storedCourse?.chapters[index - 1].completed) {
      Alert.alert('Access Denied', 'Complete previous chapters first.');
      return;
    }

    router.push({
      pathname: '../courseView/chapterDetail',
      params: { chapterData: JSON.stringify(chapter), courseParams: JSON.stringify(storedCourse) },
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView>
        <View style={{ flexDirection: 'row', padding: 5, backgroundColor: 'white' }}>
          <TouchableOpacity onPress={() => router.replace('/(tabs)/Home')}>
            <Ionicons name="arrow-back" size={30} color={Colors.black} />
          </TouchableOpacity>
        </View>
        <View>
          <Image source={require('@/assets/images/java.png')} style={{ width: '100%', height: 200 }} />
          <Text style={{ fontSize: 24, fontFamily: 'outfit-bold', marginVertical: 5, marginLeft: 5 }}>
            {storedCourse?.courseTitle}
          </Text>
          <View style={{ flexDirection: 'row', marginLeft: 7 }}>
            <Ionicons name="book-outline" size={22} color={Colors.primary} />
            <Text style={{ fontSize: 18, fontFamily: 'outfit', color: Colors.primary, marginLeft: 5 }}>
              {storedCourse?.noOfChapter} Chapters
            </Text>
          </View>
          <Text style={{ fontSize: 20, fontFamily: 'outfit-bold', marginLeft: 5, marginVertical: 3 }}>Description:</Text>
          <Text style={{ fontFamily: 'outfit', fontSize: 18, marginLeft: 15, marginBottom: 5 }}>
            {storedCourse?.description}
          </Text>
          <Text style={{ fontSize: 20, fontFamily: 'outfit-bold', marginLeft: 5 }}>Chapters:</Text>
        </View>

        <View style={{ marginTop: 10, marginBottom: 10 }}>
          {storedCourse?.chapters.map((chapter, index) => (
            <TouchableOpacity
              key={chapter.chapterName}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 10,
                backgroundColor: Colors.bgColor,
                marginHorizontal: 10,
                marginVertical: 7,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: Colors.gray,
                shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 }, // Shadow at the bottom
  shadowOpacity: 0.2,
  shadowRadius: 3,
  // ✅ Shadow for Android
  elevation: 5,
              }}
              onPress={() => handleChapterPress(index, chapter)}
            >
              <Text style={{ fontSize: 16, fontFamily: 'outfit', marginLeft: 5, width: '90%' }}>
                {index + 1}. {chapter.chapterName}
              </Text>
              <Ionicons
                name={chapter.completed ? 'checkmark-circle' : 'play'}
                size={24}
                color={chapter.completed ? 'green' : Colors.primary}
                style={{ alignItems: 'center' }}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
