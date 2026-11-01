import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRewards } from "../providers/RewardsProvider";
import { usePalette } from "../hooks/usePalette";
import { SettingsScreen } from "../screens/SettingsScreen";
import { styles } from "../styles/appStyles";

export default function SettingsRoute() {
  const { palette } = usePalette();
  const rewards = useRewards();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}>
      <SettingsScreen
        palette={palette}
        settings={rewards.settings}
        onUpdateSettings={(c) => void rewards.updateSettings(c)}
        onBack={() => router.back()}
        onSecurity={() => router.push("/security")}
      />
    </SafeAreaView>
  );
}