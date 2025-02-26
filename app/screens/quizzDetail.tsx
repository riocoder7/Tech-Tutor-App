import React, { useEffect, useState } from 'react';
import { 
  View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, Animated 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

const db = getFirestore();

interface Question {
  question: string;
  options: string[];
  correctAns: string;
}

const QuizzDetail: React.FC = () => {
  const { quizId } = useLocalSearchParams();
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const quizDoc = await getDoc(doc(db, 'quizzes', quizId as string));
        if (quizDoc.exists()) {
          const quizData = quizDoc.data();
          const shuffledQuestions = quizData.quiz.sort(() => 0.5 - Math.random()).slice(0, 10);
          setQuestions(shuffledQuestions);
        } else {
          console.log('Quiz not found');
        }
      } catch (error) {
        console.error('Error fetching quiz:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizData();
  }, [quizId]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [currentIndex]);

  const handleAnswer = (answer: string) => {
    if (answer === questions[currentIndex].correctAns) {
      setScore(prev => prev + 1);
    }
    setSelectedAnswer(answer);
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setSelectedAnswer(null);
        fadeAnim.setValue(0);
      } else {
        setCompleted(true);
      }
    }, 1000);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (completed) {
    return (
      <View style={styles.resultContainer}>
        <Ionicons name="trophy" size={80} color={Colors.primary} />
        <Text style={styles.resultText}>Quiz Completed!</Text>
        <Text style={styles.resultScore}>Your Score: {score} / {questions.length}</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.replace('/screens/Quizz')}>
          <Text style={styles.buttonText}>Back to Quizzes</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.questionContainer, { opacity: fadeAnim }]}>
        <Text style={styles.questionText}>{questions[currentIndex].question}</Text>
      </Animated.View>

      {questions[currentIndex].options.map(option => (
        <TouchableOpacity
          key={option}
          style={[
            styles.optionButton,
            selectedAnswer && option === questions[currentIndex].correctAns ? styles.correctOption : null,
            selectedAnswer && option !== questions[currentIndex].correctAns ? styles.wrongOption : null,
          ]}
          onPress={() => handleAnswer(option)}
          disabled={!!selectedAnswer}
          activeOpacity={0.8}
        >
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}

      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>Question {currentIndex + 1} / {questions.length}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#f7f7f7', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  questionContainer: { 
    marginBottom: 20, 
    width: '100%', 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 12, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowOffset: { width: 0, height: 2 }, 
    elevation: 2 
  },
  questionText: { 
    fontSize: 22, 
    fontFamily:'outfit-bold',
    textAlign: 'center', 
    color: Colors.black 
  },
  optionButton: { 
    padding: 15, 
    backgroundColor: Colors.primary, 
    borderRadius: 12, 
    marginVertical: 10, 
    width: '100%', 
    alignItems: 'center', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    elevation: 3,
  },
  optionText: { 
    color: 'white', 
    fontSize: 18, 
    fontFamily:'Outfit-bold',
    textAlign: 'center' 
  },
  correctOption: { 
    backgroundColor: '#58d68d' 
  },
  wrongOption: { 
    backgroundColor: '#ec7063' 
  },
  progressContainer: { 
    marginTop: 20 
  },
  progressText: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: Colors.gray 
  },
  resultContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#f7f7f7', 
    padding: 20 
  },
  resultText: { 
    fontSize: 26, 
    fontWeight: '700', 
    marginBottom: 10, 
    color: '#333' 
  },
  resultScore: { 
    fontSize: 20, 
    marginBottom: 20, 
    color: '#555' 
  },
  button: { 
    padding: 15, 
    backgroundColor: Colors.primary, 
    borderRadius: 12, 
    width: '80%', 
    alignItems: 'center' 
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: '600' 
  },
});

export default QuizzDetail;
