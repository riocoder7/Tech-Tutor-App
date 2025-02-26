import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { auth } from '@/config/firebaseConfig'; // Ensure correct Firebase config import
import { useRouter } from 'expo-router';

export default function SignOutScreen() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      // Sign out the user
      await auth.signOut();

      // Redirect to the SignUp screen after successful sign out
      router.replace('/auth/singUp'); // Adjust the route as needed for your app
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.push('/Progress')}>
        <Text>Progress</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('../components/courseProgress')}>
        <Text>Progress</Text>
      </TouchableOpacity>
      <Text style={styles.heading}>Are you sure you want to sign out?</Text>
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor:'#f7f9f9'
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  signOutButton: {
    backgroundColor: '#FF5733', // Red button for sign out
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
