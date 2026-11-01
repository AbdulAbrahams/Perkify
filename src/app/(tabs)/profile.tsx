import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../providers/AuthProvider";
import { useProfile } from "../../providers/ProfileProvider";
import { useAppState } from "../../providers/AppStateProvider";
import { usePalette } from "../../hooks/usePalette";
import { ProfileScreen } from "../../screens/profile/ProfileScreen";
import { CustomerHeader } from "../../components";
import { styles } from "../../styles/appStyles";

export default function ProfileRoute() {
  const { palette } = usePalette();
  const auth = useAuth();
  const profile = useProfile();
  const { setFormError } = useAppState();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}>
      <CustomerHeader />
      <ProfileScreen
        palette={palette}
        profile={profile.profile ?? auth.user}
        onEditProfile={() => { setFormError(""); router.push("/profile-edit"); }}
        onSettings={() => router.push("/settings")}
        onSecurity={() => router.push("/security")}
        onCards={() => router.push("/(tabs)/cards")}
        onSignOut={() => {
          void auth.logout().then((ok) => { if (ok) router.replace("/welcome"); });
        }}
      />
    </SafeAreaView>
  );
}