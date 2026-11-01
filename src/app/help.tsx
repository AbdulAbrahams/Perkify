import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomerHeader } from "../components";
import { usePalette } from "../hooks/usePalette";
import { HelpCenterScreen } from "../screens/HelpCenterScreen";
import { styles } from "../styles/appStyles";

export default function HelpRoute() {
  const { palette } = usePalette();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}>
      <CustomerHeader />
      <HelpCenterScreen
        page="help"
        palette={palette}
        onBack={() => router.back()}
        onOpenFaq={() => router.push("/faq")}
        onOpenCards={() => router.push("/(tabs)/cards")}
        onOpenSettings={() => router.push("/settings")}
      />
    </SafeAreaView>
  );
}
