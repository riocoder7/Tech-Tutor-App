import { View, Text,TouchableOpacity,StyleSheet } from 'react-native'
import React from 'react'
import CourseList from '../components/courseList'
import { ScrollView } from 'react-native-gesture-handler'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from "expo-router";
import Colors from '@/constants/Colors';
export default function Home() {
  const router = useRouter();
  return (
    <ScrollView style={{backgroundColor:'white'}}>
      <TouchableOpacity onPress={()=>router.push('/screens/Search')}style={styles.SearchBar}>
      <Ionicons name="search-outline" size={24} color="gray" />
        <Text style={{fontFamily:'outfit',paddingTop:2,marginLeft:3,fontSize:16,color:'gray'}}>Search</Text>
    </TouchableOpacity>
      <CourseList/>
    </ScrollView>
  )
}
const styles = StyleSheet.create({
  SearchBar:{
      display:'flex',
      flexDirection:'row',
      backgroundColor:Colors.bgColor,
      padding:8,
      marginHorizontal:8,
  borderRadius:10,
  elevation:1,
  borderWidth: 1,
  borderColor: Colors.gray
  }
})