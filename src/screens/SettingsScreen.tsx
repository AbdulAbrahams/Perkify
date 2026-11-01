import { useState } from "react";
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../theme/colors";
import { BackButton, MenuRow, SettingsToggle } from "../components";
import { styles } from "../styles/appStyles";

type SettingsShape = { notificationsEnabled: boolean; biometricLoginEnabled: boolean; hideBalances: boolean };

type Props = {
  palette: (typeof Colors)["light"];
  settings: SettingsShape;
  notificationPermissionGranted: boolean;
  hasBiometricLogin: boolean;
  onUpdateSettings: (changes: Partial<SettingsShape>) => void;
  onBack: () => void;
  onSecurity: () => void;
  onClearCache: () => Promise<boolean>;
  onClearData: () => Promise<boolean>;
};

export function SettingsScreen({
  palette,
  settings,
  notificationPermissionGranted,
  hasBiometricLogin,
  onUpdateSettings,
  onBack,
  onSecurity,
  onClearCache,
  onClearData,
}: Props) {
  const [pendingClear, setPendingClear] = useState<"cache" | "data" | null>(null);
  const [isClearing, setIsClearing] = useState(false);

  const confirmClear = async () => {
    if (!pendingClear) return;
    setIsClearing(true);
    try {
      const cleared = await (pendingClear === "cache" ? onClearCache() : onClearData());
      if (cleared) setPendingClear(null);
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <>
      <ScrollView style={styles.flex} contentContainerStyle={styles.pageContent}>
        <BackButton palette={palette} onPress={onBack} />
        <Text style={[styles.sectionTitle, styles.editorTitle, { color: palette.text }]}>Settings</Text>

        <Text style={[styles.eyebrow, styles.menuEyebrow, { color: palette.textSecondary }]}>PREFERENCES</Text>
        <View style={[styles.profileMenu, { backgroundColor: palette.surface }]}>
        <SettingsToggle
          icon="notifications-outline"
          label="Push notifications"
          value={settings.notificationsEnabled && notificationPermissionGranted}
          onValueChange={(value) => onUpdateSettings({ notificationsEnabled: value })}
          palette={palette}
        />
        <MenuRow icon="shield-checkmark-outline" label="Security & Privacy" palette={palette} onPress={onSecurity} />
        <SettingsToggle
          icon="finger-print-outline"
          label="Biometric login"
          value={settings.biometricLoginEnabled && hasBiometricLogin}
          onValueChange={(value) => onUpdateSettings({ biometricLoginEnabled: value })}
          palette={palette}
        />
        </View>

        <Text style={[styles.eyebrow, styles.menuEyebrow, { color: palette.textSecondary, marginTop: 26 }]}>ABOUT</Text>
        <View style={[styles.profileMenu, { backgroundColor: palette.surface }]}>
        <MenuRow icon="document-text-outline" label="Terms of service" palette={palette} onPress={() => {}} />
        <MenuRow icon="lock-closed-outline" label="Privacy policy" palette={palette} onPress={() => {}} />
        <View style={styles.versionRow}>
          <Text style={[styles.bodyText, { color: palette.textSecondary }]}>App version</Text>
          <Text style={[styles.bodyText, { color: palette.textSecondary }]}>1.0.0</Text>
        </View>
        </View>

        <Text style={[styles.eyebrow, styles.menuEyebrow, { color: palette.textSecondary, marginTop: 26 }]}>
          DATA & STORAGE
        </Text>
        <View style={[styles.profileMenu, { backgroundColor: palette.surface }]}>
          <MenuRow
            icon="refresh-outline"
            label="Clear cache"
            palette={palette}
            onPress={() => setPendingClear("cache")}
          />
          <MenuRow
            icon="trash-outline"
            label="Clear data"
            palette={palette}
            onPress={() => setPendingClear("data")}
          />
        </View>
      </ScrollView>

      <Modal
        visible={pendingClear !== null}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => {
          if (!isClearing) setPendingClear(null);
        }}
      >
        <View style={localStyles.modalRoot}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cancel clearing app data"
            style={StyleSheet.absoluteFill}
            disabled={isClearing}
            onPress={() => setPendingClear(null)}
          />
          <View
            accessibilityViewIsModal
            style={[localStyles.dialog, { backgroundColor: palette.background }]}
          >
            <View style={[localStyles.dialogIcon, { backgroundColor: `${palette.brandPrimary}18` }]}>
              <Ionicons
                name={pendingClear === "data" ? "trash-outline" : "refresh-outline"}
                size={24}
                color={pendingClear === "data" ? "#D32F2F" : palette.brandPrimary}
              />
            </View>
            <Text style={[localStyles.dialogTitle, { color: palette.text }]}>
              {pendingClear === "data" ? "Clear device data?" : "Clear cache?"}
            </Text>
            <Text style={[localStyles.dialogDescription, { color: palette.textSecondary }]}>
              {pendingClear === "data"
                ? "This signs you out, removes biometric sign-in and resets onboarding on this device. Your online account and loyalty cards will not be deleted."
                : "This resets onboarding and removes biometric sign-in from this device. Your current session and online account data will be kept."}
            </Text>

            <View style={localStyles.dialogActions}>
              <Pressable
                accessibilityRole="button"
                disabled={isClearing}
                style={[localStyles.cancelButton, { borderColor: palette.border }]}
                onPress={() => setPendingClear(null)}
              >
                <Text style={[localStyles.cancelText, { color: palette.text }]}>Cancel</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                disabled={isClearing}
                style={[
                  localStyles.confirmButton,
                  { backgroundColor: pendingClear === "data" ? "#D32F2F" : palette.brandPrimary },
                  isClearing && { opacity: 0.7 },
                ]}
                onPress={() => void confirmClear()}
              >
                {isClearing ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={localStyles.confirmText}>
                    {pendingClear === "data" ? "Clear data" : "Clear cache"}
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const localStyles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    backgroundColor: "#00000080",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  dialog: { width: "100%", maxWidth: 400, borderRadius: 24, padding: 22, alignItems: "center" },
  dialogIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  dialogTitle: { fontSize: 20, fontWeight: "800", textAlign: "center" },
  dialogDescription: { fontSize: 14, lineHeight: 21, textAlign: "center", marginTop: 8 },
  dialogActions: { flexDirection: "row", gap: 10, width: "100%", marginTop: 22 },
  cancelButton: {
    flex: 1,
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: { fontSize: 14, fontWeight: "700" },
  confirmButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmText: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
});