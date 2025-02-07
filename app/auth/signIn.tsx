import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, ToastAndroid } from 'react-native';
import React, { useContext, useState } from 'react';
import { TextInput } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/config/firebaseConfig';
import { getDoc } from 'firebase/firestore';
import { UserDetailContext } from '@/context/UserDetailContext';
import { ActivityIndicator } from 'react-native';
import { doc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [loading, setLoading] = useState(false);

  const onSignInClick = () => {
    setLoading(true)
    signInWithEmailAndPassword(auth, email, password)
      .then(async (resp) => {
        const user = resp.user
        console.log(user)
        await getUserDetaile();
        setLoading(false);
        router.replace('../Home')
      })
      .catch(e => {
        console.log(e)
        setLoading(false);
        ToastAndroid.show('Incorrect Email & Password', ToastAndroid.BOTTOM)
      })
  }
  const getUserDetaile = async () => {
    const result = await getDoc(doc(db, 'users', email));
    console.log(result.data());
    setUserDetail(result.data())
  }

  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Sign in to continue your learning journey.</Text>

      <TextInput placeholder='Email'
        onChangeText={(value) => setEmail(value)}
        value={email} style={styles.textInput} keyboardType='email-address' />
      <TextInput placeholder='Password' value={password} onChangeText={(value) => setPassword(value)} secureTextEntry style={styles.textInput} />

      <TouchableOpacity onPress={onSignInClick}
        disabled={loading}
        style={styles.button}>
        {!loading ? <Text style={styles.buttonText}>Sign In</Text> :
          <ActivityIndicator size={'large'} color={'white'} />}
      </TouchableOpacity>

      <View style={styles.signUpContainer}>
        <Text style={styles.signUpText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.push('../auth/singUp')}>
          <Text style={styles.signUpLink}>Sign Up Here</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  logo: { width: 100, height: 50 },
  title: { marginTop: 30, fontSize: 24, fontFamily: 'outfit-bold' },
  subtitle: { fontSize: 16, fontFamily: 'outfit', color: 'gray', marginBottom: 10 },
  textInput: { width: '90%', borderWidth: 1, borderRadius: 10, padding: 10, margin: 10, fontSize: 16, color: 'gray' },
  button: { padding: 10, backgroundColor: 'blue', width: '90%', borderRadius: 10, justifyContent: 'center', marginTop: 5 },
  buttonText: { fontSize: 20, color: 'white', fontFamily: 'outfit-bold', textAlign: 'center' },
  signUpContainer: { flexDirection: 'row', marginTop: 5 },
  signUpText: { fontFamily: 'outfit' },
  signUpLink: { color: 'blue', fontFamily: 'outfit-bold', marginLeft: 5 },
});
