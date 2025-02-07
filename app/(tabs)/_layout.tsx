import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
export default function TabLayout() {
  return (
    <Tabs>
        <Tabs.Screen name='Home' options={{
            headerTitle: () => (
                <Text style={{
                    fontSize:26,
                    fontFamily:'outfit-bold',
                    color:'blue',
                }}>TechTutor</Text>
            ),
            headerRight: () => (
                <TouchableOpacity style={{marginRight:15}}>
                    <MaterialCommunityIcons name="bell-outline" size={24} color="black" />
                </TouchableOpacity>
            ),
            tabBarIcon: ({color,size})=> <Ionicons name="home-outline" size={size} color={color} />,
            tabBarLabel: 'Home'
        }}/>
        <Tabs.Screen name='Explore' options={{
            tabBarIcon: ({color,size})=> <Ionicons name="paper-plane-outline" size={size} color={color} />,
            tabBarLabel: 'Explore'
        }}/>
        <Tabs.Screen name='Social' options={{
            tabBarStyle: { display: "none" },
            tabBarIcon: ({color,size})=> <Ionicons name="share-social-outline" size={size} color={color} />,
            tabBarLabel: 'Social'
        }}/>
        <Tabs.Screen name='Profile' options={{
            tabBarStyle: { display: "none" },
            tabBarIcon: ({color,size})=> <Ionicons name="person-circle-outline" size={size} color={color} />,
            tabBarLabel: 'Profile'
        }}/>
    </Tabs>
  )
}