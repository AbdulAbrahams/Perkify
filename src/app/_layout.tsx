import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { ApiProvider } from "../providers/ApiProvider";
import { AuthProvider } from "../providers/AuthProvider";
import { ProfileProvider } from "../providers/ProfileProvider";
import { RewardsProvider } from "../providers/RewardsProvider";
import { AppStateProvider } from "../providers/AppStateProvider";
import { AnimatedSplashScreen } from "../screens/AnimatedSplashScreen";
import { View } from "react-native";

// Prevent the native splash from hiding automatically
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    // Hide the native splash as soon as the layout mounts, 
    // transitioning immediately into our Custom Animated Splash
    SplashScreen.hideAsync();
  }, []);

  return (
    <SafeAreaProvider>
      <ApiProvider>
        <AuthProvider>
          <ProfileProvider>
            <RewardsProvider>
              <AppStateProvider>
                <StatusBar style="light" />
                {/* The Stack renders underneath the splash screen */}
                <Stack screenOptions={{ headerShown: false }} />
                
                {/* The Custom Animated Splash overlays the Stack */}
                {!isAppReady && (
                  <AnimatedSplashScreen onFinish={() => setIsAppReady(true)} />
                )}
              </AppStateProvider>
            </RewardsProvider>
          </ProfileProvider>
        </AuthProvider>
      </ApiProvider>
    </SafeAreaProvider>
  );
}