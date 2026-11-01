import { Pressable, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../theme/colors";
import { BackButton, SettingsToggle } from "../components";
import { styles } from "../styles/appStyles";

type SettingsShape = { notificationsEnabled: boolean; biometricLoginEnabled: boolean; hideBalances: boolean };

type Props = {
  palette: (typeof Colors)["light"];
  settings: SettingsShape;
  hasBiometricLogin: boolean;
  onUpdateSettings: (changes: Partial<SettingsShape>) => void;
  onBack: () => void;
};

export function SecurityScreen({ palette, settings, hasBiometricLogin, onUpdateSettings, onBack }: Props) {
  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.pageContent}>
      <BackButton palette={palette} onPress={onBack} />
      <Text style={[styles.sectionTitle, styles.editorTitle, { color: palette.text }]}>Security & Privacy</Text>
      <Text style={[styles.bodyText, { color: palette.textSecondary, marginBottom: 22 }]}>
        You're in control of your account and data.
      </Text>

      <View style={[styles.profileMenu, { backgroundColor: palette.surface }]}>
        <SettingsToggle
          icon="finger-print-outline"
          label="Biometric login"
          value={settings.biometricLoginEnabled && hasBiometricLogin}
          onValueChange={(value) => onUpdateSettings({ biometricLoginEnabled: value })}
          palette={palette}
        />
        <SettingsToggle icon="eye-off-outline" label="Hide balances" value={settings.hideBalances} onValueChange={(v) => onUpdateSettings({ hideBalances: v })} palette={palette} />
      </View>

      <View style={[styles.privacyNote, { backgroundColor: palette.surface }]}>
        <Ionicons name="shield-checkmark-outline" size={22} color={Colors.light.tint} />
        <Text style={[styles.bodyText, { color: palette.textSecondary, flex: 1 }]}>
          Your loyalty card details are stored securely on this device.
        </Text>
      </View>

      <Pressable style={[styles.signOutButton, { borderColor: palette.border, marginTop: 12 }]}>
        <Text style={styles.linkText}>Change password</Text>
      </Pressable>
    </ScrollView>
  );
}