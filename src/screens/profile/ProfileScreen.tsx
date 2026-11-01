import { Pressable, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../../theme/colors";
import { MenuRow } from "../../components";
import { getInitials } from "../../utils/formatters";
import { styles } from "../../styles/appStyles";
import type { UserProfile } from "../../types/models";

type Props = {
  palette: (typeof Colors)["light"];
  profile: UserProfile | null;
  onEditProfile: () => void;
  onSettings: () => void;
  onSecurity: () => void;
  onCards: () => void;
  onSignOut: () => void;
};

export function ProfileScreen({
  palette, profile, onEditProfile, onSettings, onSecurity, onCards, onSignOut,
}: Props) {
  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.pageContent}>
      <View style={styles.profileHeader}>
        <View style={[styles.profileAvatar, { backgroundColor: palette.surfaceSlate }]}>
          <Text style={styles.profileAvatarText}>{getInitials(profile?.fullName ?? "")}</Text>
        </View>
        <Text style={[styles.profileName, { color: palette.text }]}>{profile?.fullName ?? "Perkify Member"}</Text>
        <Text style={[styles.bodyText, { color: palette.textSecondary }]}>{profile?.email ?? ""}</Text>
      </View>

      <View style={[styles.profileMenu, { backgroundColor: palette.surface }]}>
        <Text style={[styles.eyebrow, styles.menuEyebrow, { color: palette.textSecondary }]}>YOUR ACCOUNT</Text>
        <MenuRow icon="person-outline" label="Personal information" palette={palette} onPress={onEditProfile} />
        <MenuRow icon="card-outline" label="My cards" palette={palette} onPress={onCards} />
        <MenuRow icon="settings-outline" label="Settings" palette={palette} onPress={onSettings} />
        <MenuRow icon="shield-checkmark-outline" label="Security & Privacy" palette={palette} onPress={onSecurity} />
      </View>

      <Pressable style={[styles.signOutButton, { borderColor: palette.border }]} onPress={onSignOut}>
        <Ionicons name="log-out-outline" size={20} color={Colors.danger} />
        <Text style={styles.dangerButtonText}>Log out</Text>
      </Pressable>
    </ScrollView>
  );
}