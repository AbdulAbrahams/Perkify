import { Ionicons } from "@expo/vector-icons";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import type { ThemeColors } from "../../theme/colors";
import type { MainTab } from "../types/navigation";

const tabs: { key: MainTab; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: "home", label: "Home", icon: "home-outline" },
  { key: "cards", label: "Cards", icon: "card-outline" },
  { key: "profile", label: "Profile", icon: "person-outline" },
];

export function BottomNav({
  active,
  palette,
  onSelect,
}: {
  active: MainTab;
  palette: ThemeColors;
  onSelect: (tab: MainTab) => void;
}) {
  return (
    <View style={[styles.nav, { backgroundColor: palette.surface }]}>
      {tabs.map((tab) => {
        const selected = active === tab.key;
        return (
          <Pressable key={tab.key} style={styles.item} onPress={() => onSelect(tab.key)}>
            <View style={[styles.iconWrap, selected && { backgroundColor: palette.tint }]}>
              <Ionicons name={selected && tab.key === "home" ? "home" : selected && tab.key === "profile" ? "person" : tab.icon} size={20} color={selected ? "#FFFFFF" : palette.tabIconDefault} />
            </View>
            <Text style={[styles.label, { color: selected ? palette.tabIconSelected : palette.tabIconDefault }]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: { minHeight: 70, flexDirection: "row", alignItems: "center", justifyContent: "space-around", paddingTop: 7, paddingBottom: Platform.OS === "ios" ? 4 : 8 },
  item: { flex: 1, alignItems: "center", justifyContent: "center", gap: 3 },
  iconWrap: { minWidth: 48, height: 29, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  label: { fontSize: 10, fontWeight: "600" },
});
