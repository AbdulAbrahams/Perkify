import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../providers/AuthProvider";
import { useProfile } from "../../providers/ProfileProvider";
import { useRewards } from "../../providers/RewardsProvider";
import { useAppState } from "../../providers/AppStateProvider";
import { usePalette } from "../../hooks/usePalette";
import { LoadingState } from "../../components";
import { HomeScreen } from "../../screens/tabs/HomeScreen";
import { styles } from "../../styles/appStyles";
import type { LoyaltyCard } from "../../types/models";

export default function HomeRoute() {
  const { palette } = usePalette();
  const auth = useAuth();
  const profile = useProfile();
  const rewards = useRewards();
  const { setSelectedCard } = useAppState();

  if (rewards.isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}>
        <LoadingState palette={palette} label="Loading your rewards..." />
      </SafeAreaView>
    );
  }

  const openCard = (card: LoyaltyCard) => {
    setSelectedCard(card);
    router.push("/card-detail");
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}>
      <HomeScreen
        palette={palette}
        cards={rewards.cards}
        profile={profile.profile ?? auth.user}
        summary={rewards.summary}
        hideBalances={rewards.settings.hideBalances}
        onOpenCards={() => router.push("/(tabs)/cards")}
        onOpenCard={openCard}
        onHistory={() => router.push("/history")}
        onAddCard={() => router.push("/add-card")}
      />
    </SafeAreaView>
  );
}