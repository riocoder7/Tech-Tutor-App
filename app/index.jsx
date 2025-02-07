import React, { useEffect ,useContext} from "react";
import { Text, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import {onAuthStateChanged} from 'firebase/auth';
import { auth } from '@/config/firebaseConfig'
import { getDoc } from "@firebase/firestore";
import { doc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { UserDetailContext } from '@/context/UserDetailContext';
export default function Index() {
  const router = useRouter();
  const { userDetail, setUserDetail } = useContext(UserDetailContext);

  onAuthStateChanged(auth,async(user)=>{
    if(user)
    {
      console.log(user);
      const result = await getDoc(doc(db, 'users', user?.email));
      setUserDetail(result.data());
      router.replace('./(tabs)/Home')
    }
   
  })
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('./auth/singUp');
    }, 3000); // Redirects after 3 seconds

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the App!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "blue",

  },
  text: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
