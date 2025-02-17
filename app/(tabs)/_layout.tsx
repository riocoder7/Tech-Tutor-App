import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Colors from '@/constants/Colors';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
        tabBarActiveTintColor: Colors.primary,  // Active icon color
        tabBarInactiveTintColor: Colors.black,  
    //     tabBarStyle: {
    //         backgroundColor: 'white',
    //         shadowColor: "#000",
    // shadowOffset: { width: 0, height: 4 }, // Shadow at the bottom
    // shadowOpacity: 0.2,
    // shadowRadius: 3,
    // // ✅ Shadow for Android
    // elevation: 2,
    //       },
        //   headerStyle: {
        //     // backgroundColor: Col,  // Optional: Set header background color
        //     elevation: 2,  // Remove shadow on Android
        //     shadowOpacity: 2,  // Set shadow height to 0
        //   },
          
            // Tab bar background
      }}>
        <Tabs.Screen name='Home' options={{
            
            headerTitle: () => (
                <View style={{flexDirection:'row'}}>
                <Text style={{
                    fontSize:26,
                    fontFamily:'outfit-bold',
                    color:"#00b3e8",
                }}>Code</Text>
                <Text style={{
                    fontSize:26,
                    fontFamily:'outfit-bold',
                    color:'#a300ef',
                }}>Spark</Text>
                </View>
            ),
            headerRight: () => (
                <TouchableOpacity style={{marginRight:15}}>
                    <MaterialCommunityIcons name="bell-outline" size={24} color={Colors.black} />
                </TouchableOpacity>
            ),
            tabBarIcon: ({color,size})=> <Ionicons name="home-outline" size={size} color={color} />,
            tabBarLabel: 'Home'
        }}/>
        <Tabs.Screen name='Explore' options={{
            headerTitle: ()=>(
                <Text style={{fontFamily:'outfit-bold' ,fontSize:26,color:Colors.primary}}>Explore</Text>
            ),
            tabBarIcon: ({color,size})=> <Ionicons name="paper-plane-outline" size={size} color={color} />,
            tabBarLabel: 'Explore'
        }}/>
        <Tabs.Screen name='Progress' options={{
            headerLeft: ()=>(
                <View style={{marginLeft:20}}>
                <MaterialCommunityIcons name="google-analytics" size={24} color={Colors.primary} />
                </View>
            ),
            headerTitle: ()=>(
                <Text style={{fontFamily:'outfit-bold' ,fontSize:26,color:Colors.primary}}>Progress</Text>
            ),
            tabBarIcon: ({color,size})=> <MaterialCommunityIcons name="google-analytics" size={size} color={color} />,
            tabBarLabel: 'Progress'
        }}/>
        <Tabs.Screen name='Profile' options={{
            headerTitle: ()=>(
                <Text style={{fontFamily:'outfit-bold' ,fontSize:26,color:Colors.primary}}>Profile</Text>
            ),
            tabBarIcon: ({color,size})=> <Ionicons name="person-circle-outline" size={size} color={color} />,
            tabBarLabel: 'Profile'
        }}/>
    </Tabs>
  )
}