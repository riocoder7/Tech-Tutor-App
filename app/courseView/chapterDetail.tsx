import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, useWindowDimensions } from 'react-native'; // Import ActivityIndicator for loading spinner
import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { auth, db } from '@/config/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import Ionicons from '@expo/vector-icons/Ionicons';

interface Topic {
  topic: string;
  explain: string;
  code?: string;
  example?: string;
}

interface Chapter {
  chapterName: string;
  completed?: boolean;
  content: Topic[];
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

export default function ChapterDetail() {
  const { chapterData, courseParams } = useLocalSearchParams();
  const router = useRouter();
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // State to track loading status

  const { width } = useWindowDimensions();

  let chapter: Chapter | null = null;
  let course: Course | null = null;

  if (typeof chapterData === 'string') {
    try {
      chapter = JSON.parse(chapterData);
    } catch (error) {
      console.error('Error parsing chapterData:', error, 'Raw Value:', chapterData);
    }
  }

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

  if (!chapter || !chapter.content || chapter.content.length === 0 || !course) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <Text>Error: No content available for this chapter.</Text>
      </View>
    );
  }

  const topic = chapter.content[currentTopicIndex];
  const totalTopics = chapter.content.length;

  const saveChapterCompletion = async () => {
    if (!userId || !course || !chapter) return;

    try {
      const courseRef = doc(db, `users/${userId}/enrolledCourses`, course.courseTitle);
      const docSnap = await getDoc(courseRef);

      if (docSnap.exists()) {
        const updatedChapters = course.chapters.map(ch =>
          ch.chapterName === chapter.chapterName ? { ...ch, completed: true } : ch
        );

        await updateDoc(courseRef, { chapters: updatedChapters });
      }
    } catch (error) {
      console.error('Error updating chapter completion in Firestore:', error);
    }
  };

  const handleFinish = async () => {
    if (!chapter || !course) return;

    setLoading(true); // Set loading to true when finishing the chapter

    chapter.completed = true;
    await saveChapterCompletion();

    const updatedCourse = {
      ...course,
      chapters: course.chapters.map(ch =>
        ch.chapterName === chapter.chapterName ? { ...ch, completed: true } : ch
      ),
    };

    setLoading(false); // Set loading to false once the process is done

    router.replace({
      pathname: '../courseView/courseDetail',
      params: { courseParams: JSON.stringify(updatedCourse) },
    });
  };

  const handleNextTopic = () => {
    if (currentTopicIndex < chapter.content.length - 1) {
      setCurrentTopicIndex(currentTopicIndex + 1);
    }
  };

  const handlePreviousTopic = () => {
    if (currentTopicIndex > 0) {
      setCurrentTopicIndex(currentTopicIndex - 1);
    }
  };

  const progressBarWidth = (currentTopicIndex / (totalTopics)) * width;

  return (
    <View style={{ flex: 1, backgroundColor: 'white', padding: 15 }}>
      {/* <View style={{ flexDirection: 'row', backgroundColor: 'white' }}> */}
          <TouchableOpacity onPress={() => router.replace('/(tabs)/Home')}>
            <Ionicons name="arrow-back" size={30} color={Colors.black} />
          </TouchableOpacity>
        {/* </View> */}
      {/* Progress Bar */}
      <View style={{ height: 5, backgroundColor: Colors.gray, marginVertical: 20, width: '100%' }}>
        <View style={{ height: '100%', backgroundColor: Colors.primary, width: progressBarWidth }} />
      </View>

      <ScrollView>
        <Text style={{ fontSize: 24, fontFamily: 'outfit-bold', marginBottom: 10 }}>{topic.topic}</Text>
        {/* <Text style={{fontSize:20,fontFamily:'outfit-bold', marginBottom:5,}}>Explaination:</Text> */}
        <Text style={{ fontSize: 18, fontFamily: 'outfit', marginBottom: 10 }}>{topic.explain}</Text>

        {topic.code && (
          <View style={{ marginBottom:15 }}>
            <Text style={{fontSize:20,fontFamily:'outfit-bold', marginBottom:5,}}>Code :</Text>
            <Text style={{ backgroundColor: Colors.black, padding: 20, borderRadius: 5, fontFamily: 'monospace', color:Colors.white}}>{topic.code}</Text>
          </View>
        )}

        {topic.example && (
          <View>
            <Text style={{fontSize:20,fontFamily:'outfit-bold', marginBottom:5,}}>Example :</Text>
          <Text style={{ backgroundColor: Colors.bgColor, padding: 20, borderRadius: 5,fontSize: 18, fontFamily: 'outfit', marginBottom: 10 }}>{topic.example}</Text>
          </View>
        )}
      </ScrollView>

      <View style={{ flexDirection: 'row', marginTop: 10 }}>
        {/* Previous Button for middle topics */}
        {currentTopicIndex > 0 && currentTopicIndex < totalTopics - 1 && (
          <TouchableOpacity
            style={{
              backgroundColor: Colors.primary,
              padding: 10,
              borderRadius: 10,
              alignItems: 'center',
              shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 }, // Shadow at the bottom
    shadowOpacity: 0.2,
    shadowRadius: 3,
    // ✅ Shadow for Android
    elevation: 2,
            }}
            onPress={handlePreviousTopic}
          >
            <Text style={{ color: 'white', fontSize: 24, fontFamily: 'outfit-bold' }}>Previous</Text>
          </TouchableOpacity>
        )}

        {/* Next Button */}
        {currentTopicIndex < totalTopics - 1 && (
          <TouchableOpacity
          style={{
            marginLeft:'25%',
            backgroundColor: Colors.primary,
            padding: 10,
            borderRadius: 10,
            alignItems: 'center',
            shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 }, // Shadow at the bottom
    shadowOpacity: 0.2,
    shadowRadius: 3,
    // ✅ Shadow for Android
    elevation: 2,
          }}
          onPress={handleNextTopic}
          >
            <Text style={{ color: 'white', fontSize: 24, fontFamily: 'outfit-bold' }}>Next Topic</Text>
          </TouchableOpacity>
        )}

        {/* Finish Button for the last topic */}
        {currentTopicIndex === totalTopics - 1 && (
          <TouchableOpacity
            style={{
              width:'100%',
              backgroundColor: Colors.primary,
              padding: 10,
              borderRadius: 10,
              alignItems: 'center',
              shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 }, // Shadow at the bottom
    shadowOpacity: 0.2,
    shadowRadius: 3,
    // ✅ Shadow for Android
    elevation: 2,
            }}
            onPress={handleFinish}
            disabled={loading} // Disable the button when loading
          >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={{ color: 'white', fontSize: 24, fontFamily: 'outfit-bold' }}>Finish</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
