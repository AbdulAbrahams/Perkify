import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRewards } from "../providers/RewardsProvider";
import { usePalette } from "../hooks/usePalette";
import { SecurityScreen } from "../screens/SecurityScreen";
import { styles } from "../styles/appStyles";

export default function SecurityRoute() {
  const { palette } = usePalette();
  const rewards = useRewards();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}>
      <SecurityScreen
        palette={palette}
        settings={rewards.settings}
        onUpdateSettings={(c) => void rewards.updateSettings(c)}
        onBack={() => router.back()}
      />
    </SafeAreaView>
  );
}