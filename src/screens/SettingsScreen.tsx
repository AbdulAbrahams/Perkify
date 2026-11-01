import { ScrollView, Text, View } from "react-native";
import { Colors } from "../../theme/colors";
import { BackButton, MenuRow, SettingsToggle } from "../components";
import { styles } from "../styles/appStyles";

type SettingsShape = { notificationsEnabled: boolean; biometricLoginEnabled: boolean; hideBalances: boolean };

type Props = {
  palette: (typeof Colors)["light"];
  settings: SettingsShape;
  onUpdateSettings: (changes: Partial<SettingsShape>) => void;
  onBack: () => void;
  onSecurity: () => void;
};

export function SettingsScreen({ palette, settings, onUpdateSettings, onBack, onSecurity }: Props) {
  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.pageContent}>
      <BackButton palette={palette} onPress={onBack} />
      <Text style={[styles.sectionTitle, styles.editorTitle, { color: palette.text }]}>Settings</Text>

      <Text style={[styles.eyebrow, styles.menuEyebrow, { color: palette.textSecondary }]}>PREFERENCES</Text>
      <View style={[styles.profileMenu, { backgroundColor: palette.surface }]}>
        <SettingsToggle icon="notifications-outline" label="Push notifications" value={settings.notificationsEnabled} onValueChange={(v) => onUpdateSettings({ notificationsEnabled: v })} palette={palette} />
        <MenuRow icon="shield-checkmark-outline" label="Security & Privacy" palette={palette} onPress={onSecurity} />
        <SettingsToggle icon="finger-print-outline" label="Biometric login" value={settings.biometricLoginEnabled} onValueChange={(v) => onUpdateSettings({ biometricLoginEnabled: v })} palette={palette} />
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
    </ScrollView>
  );
}