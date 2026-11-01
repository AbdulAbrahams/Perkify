import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRewards } from "../providers/RewardsProvider";
import { usePalette } from "../hooks/usePalette";
import { LoadingState } from "../components";
import { HistoryScreen } from "../screens/cards/HistoryScreen";
import { styles } from "../styles/appStyles";

export default function HistoryRoute() {
  const { palette } = usePalette();
  const rewards = useRewards();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}>
      {rewards.isLoading ? (
        <LoadingState palette={palette} label="Loading your activity..." />
      ) : (
        <HistoryScreen
          palette={palette}
          transactions={rewards.transactions}
          pointsBalance={rewards.summary.pointsBalance}
          hideBalances={rewards.settings.hideBalances}
          onBack={() => router.back()}
        />
      )}
    </SafeAreaView>
  );
}