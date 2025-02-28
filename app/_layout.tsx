import React from 'react';
import { UserDetailContext } from "../context/UserDetailContext";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { useState } from "react";
// import { StatusBar, } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';  // Import GestureHandlerRootView
import useBackHandler from "@/constants/useBackHandler";
import { StatusBar, useColorScheme } from 'react-native';

export default function RootLayout() {
  // useBackHandler();
  useFonts({
    'outfit': require('@/assets/fonts/Outfit-Regular.ttf'),
    'outfit-bold': require('@/assets/fonts/Outfit-Bold.ttf')
  });
  const theme = useColorScheme();
  const [userDetail, setUserDetail] = useState();

  return (
    // Wrap the content in GestureHandlerRootView to enable gesture handling
    <GestureHandlerRootView style={{ flex: 1 }}>
      <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      {/* <StatusBar hidden={true} /> */}
      <StatusBar
     hidden={false} 
     barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} 
     backgroundColor={theme === 'dark' ? '#121212' : '#FFF'} />
        <Stack screenOptions={{
          headerShown: false,
          
        }}>
          {/* Your routes or screens would go here */}
        </Stack>
      </UserDetailContext.Provider>
    </GestureHandlerRootView>
    
  );
}
