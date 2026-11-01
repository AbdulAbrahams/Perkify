import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../providers/AuthProvider";
import { useProfile } from "../providers/ProfileProvider";
import { useAppState } from "../providers/AppStateProvider";
import { usePalette } from "../hooks/usePalette";
import { ProfileEditScreen } from "../screens/profile/ProfileEditScreen";
import { validateEmail, validateFullName } from "../utils/validation";
import { styles } from "../styles/appStyles";

export default function ProfileEditRoute() {
  const { palette } = usePalette();
  const auth = useAuth();
  const profile = useProfile();
  const { formError, setFormError } = useAppState();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}>
      <ProfileEditScreen
        palette={palette}
        profile={profile.profile ?? auth.user}
        isSaving={profile.isLoading}
        error={formError}
        onBack={() => router.back()}
        onSave={async (fullName, emailAddress) => {
          const nameError = validateFullName(fullName);
          const emailError = validateEmail(emailAddress);
          if (nameError || emailError) {
            setFormError(nameError ?? emailError ?? "Check your details and try again.");
            return;
          }
          setFormError("");
          const ok = await profile.updateProfile({ fullName: fullName.trim(), email: emailAddress.trim() });
          if (ok) router.replace("/(tabs)/profile");
        }}
      />
    </SafeAreaView>
  );
}