import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Octicons from '@expo/vector-icons/Octicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { auth } from '@/config/firebaseConfig';
import { UserDetailContext } from '@/context/UserDetailContext';
import { useRouter } from 'expo-router';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

// Define the type for Firestore user data
interface UserData {
  name: string;
  email: string;
  profileImage?: string; // Profile image URL (optional)
}

export default function ProfileScreen() {
  const router = useRouter();
  const { userDetail } = useContext(UserDetailContext);
  const [userData, setUserData] = useState<UserData>({ name: '', email: '', profileImage: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user?.email) {  // Ensure email is available
          const db = getFirestore();
          const userDoc = await getDoc(doc(db, 'users', user.email));

          if (userDoc.exists()) {
            setUserData(userDoc.data() as UserData);  // Type assertion
          } else {
            console.log('No such user data found!');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      router.replace('/auth/singUp');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        {userData.profileImage ? (
          <Image source={{ uri: userData.profileImage }} style={styles.image} />
        ) : (
          <View style={[styles.imagePlaceholder, { backgroundColor: getRandomColor(userData.name) }]}>
            <Text style={styles.imageText}>{userData.name.charAt(0).toUpperCase()}</Text>
          </View>
        )}
        <View>
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <>
              <Text style={styles.name}>{userData.name}</Text>
              <Text style={styles.email}>{userData.email}</Text>
            </>
          )}
        </View>
      </View>

      {/* Menu List */}
      <View style={styles.menu}>
        <TouchableOpacity onPress={() => router.push('/screens/myCourse')}>
          <View style={styles.menuItem}>
            <Ionicons name="bookmarks-outline" size={24} color="black" />
            <Text style={styles.menuItemText}>My Courses</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/(tabs)/Progress")}>
          <View style={styles.menuItem}>
            <MaterialCommunityIcons name="progress-check" size={24} color="black" />
            <Text style={styles.menuItemText}>Progress</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/screens/Quizz")}>
          <View style={styles.menuItem}>
            <MaterialIcons name="quiz" size={24} color="black" />
            <Text style={styles.menuItemText}>Quiz Challenge</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/screens/Chatbot")}>
          <View style={styles.menuItem}>
            <Octicons name="dependabot" size={24} color="black" />
            <Text style={styles.menuItemText}>AI Support</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/screens/Compiler")}>
          <View style={styles.menuItem}>
            <FontAwesome5 name="laptop-code" size={24} color="black" />
            <Text style={styles.menuItemText}>Compiler</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Sign Out Button */}
      <View style={{ alignItems: 'center' }}>
        <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
          <Ionicons name="power" size={24} color="red" />
          <Text style={[styles.menuItemText, { textAlign: "center", color: "red" }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Function to generate a random background color for the placeholder
const getRandomColor = (name: string) => {
  const colors = ['#FF5733', '#33A1FF', '#FF33A1', '#33FF57', '#A133FF', '#FFA133'];
  return colors[name.charCodeAt(0) % colors.length]; // Select color based on first letter
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  header: {
    backgroundColor: '#2E4EA7',
    height: 110,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
    backgroundColor: "#fff",
  },
  imagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight:10,
  },
  imageText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  name: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  email: {
    color: 'white',
    fontSize: 14,
  },
  menu: {
    marginTop: 10,
  },
  menuItem: {
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    borderRadius: 15,
  },
  menuItemText: {
    marginLeft: 16,
    fontSize: 16,
    color: 'black',
  },
  signOutBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    borderRadius: 12,
    borderWidth: 1,
    padding: 10,
    borderColor: '#e0e0e0',
    width: '50%',
  },
  footer: {
    color: 'gray',
    textAlign: 'center',
    marginTop: 25,
    fontSize: 16,
  },
});

