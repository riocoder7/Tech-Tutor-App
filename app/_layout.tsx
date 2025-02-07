import { UserDetailContext } from "../context/UserDetailContext";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { useState } from "react";
import { GestureHandlerRootView } from 'react-native-gesture-handler';  // Import GestureHandlerRootView

export default function RootLayout() {
  
  useFonts({
    'outfit': require('@/assets/fonts/Outfit-Regular.ttf'),
    'outfit-bold': require('@/assets/fonts/Outfit-Bold.ttf')
  });

  const [userDetail, setUserDetail] = useState();

  return (
    // Wrap the content in GestureHandlerRootView to enable gesture handling
    <GestureHandlerRootView style={{ flex: 1 }}>
      <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
        <Stack screenOptions={{
          headerShown: false
        }}>
          {/* Your routes or screens would go here */}
        </Stack>
      </UserDetailContext.Provider>
    </GestureHandlerRootView>
  );
}
