import React, { useEffect, useContext } from "react";
import { Text, View, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/config/firebaseConfig";
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { UserDetailContext } from "@/context/UserDetailContext";
import Colors from "@/constants/Colors";

const Index: React.FC = () => {
  const router = useRouter();
  const { setUserDetail } = useContext(UserDetailContext);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        console.log(user);
        const result = await getDoc(doc(db, "users", user.email || ""));
        if (result.exists()) {
          setUserDetail(result.data());
        }
        router.replace("../(tabs)/Home");
      }
      else{
        const timer = setTimeout(() => {
          router.replace("./auth/singUp");
        }, 3000);
    
        return () => clearTimeout(timer);
      }
    });

    return () => unsubscribe();
  }, [router, setUserDetail]);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     router.replace("./auth/singUp");
  //   }, 3000);

  //   return () => clearTimeout(timer);
  // }, [router]);

  return (
    <View style={styles.container}>
      <Image source={require("@/assets/images/logo.png")} style={styles.logo} />
      <Text style={styles.text}>Welcome to TechTutor</Text>
      <Text style={styles.subtitle}>Let's get your learning journey started.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:Colors.white,
  },
  text: {
    fontSize: 24,
    fontFamily: "outfit-bold",
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 20,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "outfit",
    color: "gray",
    marginBottom: 10,
  },
});

export default Index;
