import React from "react";
import AppLoading from "expo-app-loading";
import { useFonts, DMSans_400Regular } from "@expo-google-fonts/dm-sans";
import { DMSerifDisplay_400Regular } from "@expo-google-fonts/dm-serif-display";
import { ThemeProvider } from "styled-components/native";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "@hooks/auth";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import theme from "./src/theme";

import { SignIn } from "@screens/SignIn";
import { Products } from "@screens/Products";
import { Home } from "@screens/Home";

export default function App() {
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSerifDisplay_400Regular,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider theme={theme}>
        <StatusBar style="light" translucent backgroundColor="transparent" />
        <AuthProvider>
          {/* <SignIn /> */}
          {/* <Products/> */}
          <Home />
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
