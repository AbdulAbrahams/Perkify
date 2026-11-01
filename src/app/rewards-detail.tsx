import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppState } from "../providers/AppStateProvider";
import { usePalette } from "../hooks/usePalette";
import { getBrandForCard } from "../config/brands";
import { getBrandRewards } from "../config/rewards";
import { RewardsDetailScreen } from "../screens/cards/RewardsDetailScreen";
import { styles } from "../styles/appStyles";

export default function RewardsDetailRoute() {
  const { palette } = usePalette();
  const { selectedCard } = useAppState();
  const brand = selectedCard ? getBrandForCard(selectedCard) : null;
  const rewardDetails = selectedCard
    ? getBrandRewards(brand?.id ?? selectedCard.name, brand?.name ?? selectedCard.name)
    : null;

  if (!selectedCard || !rewardDetails) return null;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}>
      <RewardsDetailScreen
        palette={palette}
        rewards={rewardDetails}
        onBack={() => router.back()}
      />
    </SafeAreaView>
  );
}
