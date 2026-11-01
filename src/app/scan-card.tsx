import { SafeAreaView } from "react-native-safe-area-context";
import { usePalette } from "../hooks/usePalette";
import { ScanCardScreen } from "../screens/cards/ScanCardScreen";
import { CustomerHeader } from "../components";
import { styles } from "../styles/appStyles";

export default function ScanCardRoute() {
  const { palette } = usePalette();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}>
      <CustomerHeader />
      <ScanCardScreen palette={palette} />
    </SafeAreaView>
  );
}