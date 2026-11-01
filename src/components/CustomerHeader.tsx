import Constants from "expo-constants";
import { router } from "expo-router";
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { usePalette } from "../hooks/usePalette";
import { useAuth } from "../providers/AuthProvider";
import { useProfile } from "../providers/ProfileProvider";
import { styles } from "../styles/appStyles";

const DRAWER_WIDTH = Math.min(Dimensions.get("window").width * 0.78, 300);
const APP_VERSION = Constants.expoConfig?.version ?? "1.0.0";

export function CustomerHeader() {
  const { palette } = usePalette();
  const auth = useAuth();
  const { profile } = useProfile();
  const insets = useSafeAreaInsets();
  const fullName = profile?.fullName ?? auth.user?.fullName ?? "Perkify Member";
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const drawerTranslateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;

  const openDrawer = () => {
    drawerTranslateX.setValue(-DRAWER_WIDTH);
    setIsDrawerOpen(true);
    Animated.timing(drawerTranslateX, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  };

  const closeDrawer = () => {
    Animated.timing(drawerTranslateX, {
      toValue: -DRAWER_WIDTH,
      duration: 180,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) setIsDrawerOpen(false);
    });
  };

  const navigate = (path: "/(tabs)/cards" | "/history" | "/settings" | "/faq" | "/help") => {
    closeDrawer();
    router.push(path);
  };

  const signOut = async () => {
    auth.clearError();
    if (await auth.logout()) {
      setIsDrawerOpen(false);
      router.replace("/welcome");
    }
  };

  return (
    <View style={[styles.customerHeaderContainer, { backgroundColor: palette.background }]}>
      <View style={styles.homeHeader}>
        <View style={styles.userGreeting}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open navigation menu"
            style={[styles.headerIconButton, { backgroundColor: palette.surface }]}
            onPress={openDrawer}
          >
            <Ionicons name="menu-outline" size={24} color={palette.text} />
          </Pressable>
          <View style={styles.customerHeaderText}>
            <Text style={[styles.eyebrow, { color: palette.textSecondary }]}>Good morning,</Text>
            <Text style={[styles.userName, { color: palette.text }]} numberOfLines={1}>
              {fullName}
            </Text>
          </View>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open notifications and activity"
          style={[styles.headerIconButton, { backgroundColor: palette.surface }]}
          onPress={() => router.push("/history")}
        >
          <Ionicons name="notifications-outline" size={21} color={palette.text} />
          <View style={styles.notificationDot} />
        </Pressable>
      </View>
      <Modal
        visible={isDrawerOpen}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={closeDrawer}
      >
        <View style={drawerStyles.modal}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close navigation menu"
            style={drawerStyles.scrim}
            onPress={closeDrawer}
          />
          <Animated.View
            style={[
              drawerStyles.panel,
              {
                width: DRAWER_WIDTH,
                paddingTop: insets.top + 24,
                paddingBottom: insets.bottom + 18,
                backgroundColor: palette.surface,
                transform: [{ translateX: drawerTranslateX }],
              },
            ]}
          >
            <View style={drawerStyles.drawerHeader}>
              <Text style={[drawerStyles.title, { color: palette.text }]}>Perkify</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close navigation menu"
                style={drawerStyles.closeButton}
                onPress={closeDrawer}
              >
                <Ionicons name="close" size={22} color={palette.textSecondary} />
              </Pressable>
            </View>
            <Text style={[drawerStyles.subtitle, { color: palette.textSecondary }]} numberOfLines={1}>
              {fullName}
            </Text>

            <View style={drawerStyles.menu}>
              <DrawerItem icon="card-outline" label="My Cards" color={palette.text} onPress={() => navigate("/(tabs)/cards")} />
              <DrawerItem icon="notifications-outline" label="My Notifications" color={palette.text} onPress={() => navigate("/history")} />
              <DrawerItem icon="settings-outline" label="Settings" color={palette.text} onPress={() => navigate("/settings")} />
              <DrawerItem icon="help-circle-outline" label="FAQ" color={palette.text} onPress={() => navigate("/faq")} />
              <DrawerItem icon="chatbubble-ellipses-outline" label="Help" color={palette.text} onPress={() => navigate("/help")} />
            </View>

            <View style={drawerStyles.footer}>
              {auth.error ? <Text style={drawerStyles.error}>{auth.error}</Text> : null}
               <Pressable
                accessibilityRole="button"
                disabled={auth.isLoading}
                style={[drawerStyles.logout, { borderColor: palette.border }]}
                onPress={() => void signOut()}
              >
                <Ionicons name="log-out-outline" size={20} color={auth.isLoading ? palette.textSecondary : "#D32F2F"} />
                <Text style={[drawerStyles.logoutText, { color: auth.isLoading ? palette.textSecondary : "#D32F2F" }]}>
                  {auth.isLoading ? "Logging out..." : "Log out"}
                </Text>
              </Pressable>
              <View style={[drawerStyles.versionRow, { borderTopColor: palette.border }]}>
                <Text style={[drawerStyles.versionLabel, { color: palette.textSecondary }]}>Version</Text>
                <Text style={[drawerStyles.versionLabel, { color: palette.textSecondary }]}>{APP_VERSION}</Text>
              </View>
             
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

function DrawerItem({
  icon,
  label,
  color,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
  onPress: () => void;
}) {
  return (
    <Pressable accessibilityRole="button" style={drawerStyles.item} onPress={onPress}>
      <Ionicons name={icon} size={21} color={color} />
      <Text style={[drawerStyles.itemLabel, { color }]}>{label}</Text>
    </Pressable>
  );
}

const drawerStyles = StyleSheet.create({
  modal: { flex: 1, flexDirection: "row" },
  scrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.48)",
  },
  panel: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 22,
  },
  drawerHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: { fontSize: 24, fontWeight: "800" },
  closeButton: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  subtitle: { fontSize: 14, marginTop: 5, marginBottom: 28 },
  menu: { gap: 5 },
  item: { minHeight: 50, flexDirection: "row", alignItems: "center", gap: 14 },
  itemLabel: { fontSize: 15, fontWeight: "600" },
  footer: { marginTop: "auto" },
  error: { color: "#D32F2F", fontSize: 12, marginBottom: 12 },
  versionRow: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 17,
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  versionLabel: { fontSize: 12 },
  logout: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },
  logoutText: { fontSize: 14, fontWeight: "700" },
});
