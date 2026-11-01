import { router } from "expo-router";
import { Alert } from "react-native";
import { useAuth } from "../providers/AuthProvider";
import { useAppState } from "../providers/AppStateProvider";
import { useRewards } from "../providers/RewardsProvider";
import { usePalette } from "../hooks/usePalette";
import { USE_MOCK_API } from "../lib/api";
import { canUseBiometrics } from "../lib/biometrics";
import { AuthScreen } from "../screens/auth/AuthScreen";
import { validateEmail, validateFullName, validatePassword } from "../utils/validation";

export default function AuthRoute() {
  const { palette } = usePalette();
  const auth = useAuth();
  const s = useAppState();
  const rewards = useRewards();

  const continueAfterAuth = async () => {
    let available = false;
    try {
      available = await canUseBiometrics();
    } catch (error) {
      console.error("Unable to check biometric availability.", error);
    }
    if (auth.hasBiometricLogin || !available) {
      router.replace("/(tabs)");
      return;
    }

    Alert.alert(
      "Enable biometric login?",
      "Use Face ID or your fingerprint to securely sign in next time.",
      [
        {
          text: "Not now",
          style: "cancel",
          onPress: () => router.replace("/(tabs)"),
        },
        {
          text: "Enable",
          onPress: () => {
            void (async () => {
              try {
                await auth.enableBiometricLogin();
                if (!await rewards.updateSettings({ biometricLoginEnabled: true })) {
                  await auth.disableBiometricLogin();
                  Alert.alert("Unable to save setting", "You can enable biometric login later in Settings.");
                }
              } catch (error) {
                Alert.alert(
                  "Unable to enable biometric login",
                  error instanceof Error ? error.message : "Please try again later.",
                );
              }
              router.replace("/(tabs)");
            })();
          },
        },
      ],
    );
  };

  const submitAuth = async () => {
    const emailError = validateEmail(s.email);
    const passwordError = validatePassword(s.password);
    const nameError = s.authMode === "signup" ? validateFullName(s.fullName) : null;
    if (emailError || passwordError || nameError) {
      s.setFormError(emailError ?? passwordError ?? nameError ?? "Check the information and try again.");
      return;
    }
    s.setFormError("");
    const ok =
      s.authMode === "signup"
        ? await auth.register({ email: s.email.trim(), password: s.password, fullName: s.fullName.trim() })
        : await auth.login({ email: s.email.trim(), password: s.password });
    if (ok) await continueAfterAuth();
  };

  const submitSocialAuth = async () => {
    if (!USE_MOCK_API) return;
    const ok = await auth.login({ email: "john.doe@email.com", password: "mock-google-login" });
    if (ok) await continueAfterAuth();
  };

  const submitPasswordReset = async () => {
    const v = validateEmail(s.email);
    if (v) { s.setFormError(v); return; }
    s.setFormError("");
    const ok = await auth.requestPasswordReset(s.email.trim());
    if (ok) {
      Alert.alert("Password reset requested", "If an account matches that email, password reset instructions have been sent.");
    }
  };

  return (
    <AuthScreen
      mode={s.authMode}
      palette={palette}
      email={s.email}
      password={s.password}
      fullName={s.fullName}
      error={s.formError || auth.error || ""}
      isSubmitting={auth.isLoading}
      onSocialLogin={() => void submitSocialAuth()}
      onForgotPassword={() => void submitPasswordReset()}
      onEmail={s.setEmail}
      onPassword={s.setPassword}
      onFullName={s.setFullName}
      onSubmit={() => void submitAuth()}
      onBack={() => router.back()}
      onSwitch={() => {
        s.setFormError("");
        auth.clearError();
        s.setAuthMode(s.authMode === "login" ? "signup" : "login");
      }}
    />
  );
}