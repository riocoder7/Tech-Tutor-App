import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity,ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { auth, db } from '@/config/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import Colors from '@/constants/Colors';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';

interface Chapter {
  chapterName: string;
  completed?: boolean;
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

export default function CourseProgressScreen() {
  
  const [userId, setUserId] = useState<string | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (user) {
        setUserId(user.uid);
        await loadEnrolledCourses(user.uid);
      } else {
        setError('User not logged in.');
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // ✅ Fetch enrolled courses & progress from Firestore
  const loadEnrolledCourses = async (userId: string) => {
    try {
      setLoading(true);
      const coursesRef = collection(db, `users/${userId}/enrolledCourses`);
      const coursesSnapshot = await getDocs(coursesRef);
      const courses: Course[] = [];

      coursesSnapshot.forEach(doc => {
        courses.push(doc.data() as Course);
      });

      setEnrolledCourses(courses);
      setError(null);
    } catch (error) {
      console.error('Error loading enrolled courses:', error);
      setError('Failed to load enrolled courses. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (chapters: Chapter[]) => {
    const totalChapters = chapters.length;
    const completedChapters = chapters.filter((chapter) => chapter.completed).length;
    const progressPercentage = totalChapters > 0 ? completedChapters / totalChapters : 0;
    return { completedChapters, totalChapters, progressPercentage };
  };

  return (
    <View style={styles.container}>
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {loading ? (
          <View style={{ backgroundColor: 'white',marginTop:'90%' }}>
                  <ActivityIndicator size="large" color={Colors.primary} /> 
                </View>
        ) : enrolledCourses.length === 0 ? (
          <View style={{
            justifyContent: 'center',
            alignItems: 'center',marginTop:'60%'}}>
            <Entypo style={{
    }} name="open-book" size={100} color="gray" />
          <Text style={{fontFamily:'outfit-bold',fontSize: 24,
    color: "#888",}}>No courses found.</Text>
            </View>
        ) : (
          enrolledCourses.map((course) => {
            const { completedChapters, totalChapters, progressPercentage } = calculateProgress(course.chapters);

            return (
              <TouchableOpacity 
                key={course.courseTitle} 
                style={styles.courseContainer}
                onPress={() =>
                  router.push({
                    pathname: '/courseView/courseDetail',
                    params: { courseParams: JSON.stringify(course) },
                  })
                }
              >
                <Text style={styles.courseTitle}>{course.courseTitle}</Text>
                <Text style={styles.courseDescription}>{course.description}</Text>
                {/* Custom Progress Bar */}
                <View style={styles.progressBarBackground}>
                  <View style={[styles.progressBarFill, { width: `${progressPercentage * 100}%` }]} />
                </View>
                <Text style={styles.progressText}>
                  {completedChapters} out of {totalChapters} chapters completed
                </Text>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContainer: {
    marginTop:10
  },
  courseContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: Colors.bgColor,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.gray,
  },
  courseTitle: {
    fontSize: 20,
    fontFamily: 'outfit-bold',
    marginBottom: 10,
  },
  courseDescription: {
    fontSize: 16,
    marginBottom: 10,
    color: Colors.gray,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: Colors.gray,
    borderRadius: 5,
    marginBottom: 10,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 5,
  },
  progressText: {
    fontSize: 16,
    color: Colors.gray,
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: Colors.gray,
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});
