import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Linking, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRewards } from "../providers/RewardsProvider";
import { useAuth } from "../providers/AuthProvider";
import { useAppState } from "../providers/AppStateProvider";
import { usePalette } from "../hooks/usePalette";
import { SettingsScreen } from "../screens/SettingsScreen";
import { CustomerHeader } from "../components";
import { styles } from "../styles/appStyles";
import { getNotificationPermissionGranted, requestNotificationPermission } from "../lib/notifications";
import type { AppSettings } from "../types/models";

export default function SettingsRoute() {
  const { palette } = usePalette();
  const rewards = useRewards();
  const auth = useAuth();
  const appState = useAppState();
  const [notificationPermissionGranted, setNotificationPermissionGranted] = useState(false);

  useEffect(() => {
    let active = true;
    getNotificationPermissionGranted()
      .then((granted) => {
        if (active) setNotificationPermissionGranted(granted);
      })
      .catch((error: unknown) => {
        console.error("Unable to check notification permission.", error);
      });

    return () => {
      active = false;
    };
  }, []);

  const updateSettings = async (changes: Partial<AppSettings>) => {
    if (changes.notificationsEnabled === true) {
      try {
        const granted = await requestNotificationPermission();
        setNotificationPermissionGranted(granted);
        if (!granted) {
          if (Platform.OS === "web") {
            Alert.alert("Notifications unavailable", "Push notifications are only available in the iOS and Android apps.");
          } else {
            Alert.alert(
              "Notifications are off",
              "Allow notifications in your device settings to receive updates.",
              [
                { text: "Not now", style: "cancel" },
                {
                  text: "Open settings",
                  onPress: () => {
                    void Linking.openSettings().catch((error: unknown) => {
                      console.error("Unable to open device settings.", error);
                    });
                  },
                },
              ],
            );
          }
          return;
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Please try again.";
        Alert.alert("Unable to enable notifications", message);
        return;
      }
    }

    if (changes.biometricLoginEnabled === true) {
      try {
        await auth.enableBiometricLogin();
      } catch (error) {
        Alert.alert(
          "Unable to enable biometric login",
          error instanceof Error ? error.message : "Check that biometrics are set up on this device.",
        );
        return;
      }
    } else if (changes.biometricLoginEnabled === false) {
      try {
        await auth.disableBiometricLogin();
      } catch (error) {
        Alert.alert(
          "Unable to disable biometric login",
          error instanceof Error ? error.message : "Please try again.",
        );
        return;
      }
    }

    if (!await rewards.updateSettings(changes)) {
      if (changes.biometricLoginEnabled === true) {
        await auth.disableBiometricLogin();
      }
      Alert.alert("Unable to save settings", "Please try again.");
    }
  };

  const clearCache = async () => {
    try {
      await auth.disableBiometricLogin();
      if (!await appState.clearLocalAppState()) {
        Alert.alert("Unable to clear cache", "Please try again.");
        return false;
      }
      router.replace("/");
      return true;
    } catch (error) {
      Alert.alert(
        "Unable to clear cache",
        error instanceof Error ? error.message : "Please try again.",
      );
      return false;
    }
  };

  const clearData = async () => {
    try {
      await auth.clearLocalSession();
      if (!await appState.clearLocalAppState()) {
        Alert.alert("Unable to clear device data", "Please try again.");
        return false;
      }
      router.replace("/");
      return true;
    } catch (error) {
      Alert.alert(
        "Unable to clear device data",
        error instanceof Error ? error.message : "Please try again.",
      );
      return false;
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}>
      <CustomerHeader />
      <SettingsScreen
        palette={palette}
        settings={rewards.settings}
        notificationPermissionGranted={notificationPermissionGranted}
        hasBiometricLogin={auth.hasBiometricLogin}
        onUpdateSettings={(changes) => void updateSettings(changes)}
        onBack={() => router.back()}
        onSecurity={() => router.push("/security")}
        onClearCache={clearCache}
        onClearData={clearData}
      />
    </SafeAreaView>
  );
}