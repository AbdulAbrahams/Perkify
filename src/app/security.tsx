import { router } from "expo-router";
import { Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRewards } from "../providers/RewardsProvider";
import { useAuth } from "../providers/AuthProvider";
import { usePalette } from "../hooks/usePalette";
import { SecurityScreen } from "../screens/SecurityScreen";
import { CustomerHeader } from "../components";
import { styles } from "../styles/appStyles";

export default function SecurityRoute() {
  const { palette } = usePalette();
  const rewards = useRewards();
  const auth = useAuth();

  const updateSettings = async (changes: { biometricLoginEnabled?: boolean; hideBalances?: boolean }) => {
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

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}>
      <CustomerHeader />
      <SecurityScreen
        palette={palette}
        settings={rewards.settings}
        hasBiometricLogin={auth.hasBiometricLogin}
        onUpdateSettings={(changes) => void updateSettings(changes)}
        onBack={() => router.back()}
      />
    </SafeAreaView>
  );
}