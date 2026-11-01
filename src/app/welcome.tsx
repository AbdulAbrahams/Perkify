import { router } from "expo-router";
import { useEffect, useRef } from "react";
import { useAuth } from "../providers/AuthProvider";
import { useAppState } from "../providers/AppStateProvider";
import { usePalette } from "../hooks/usePalette";
import { WelcomeScreen } from "../screens/WelcomeScreen";

export default function WelcomeRoute() {
  const { palette } = usePalette();
  const auth = useAuth();
  const biometricAttemptStarted = useRef(false);
  const { setAuthMode } = useAppState();

  useEffect(() => {
    if (!auth.biometricSetupChecked || !auth.hasBiometricLogin || biometricAttemptStarted.current) return;
    biometricAttemptStarted.current = true;
    void auth.biometricLogin().then((success) => {
      if (success) router.replace("/(tabs)");
    });
  }, [auth.biometricSetupChecked, auth.hasBiometricLogin, auth.biometricLogin]);

  return (
    <WelcomeScreen
      palette={palette}
      onLogin={() => { auth.clearError(); setAuthMode("login"); router.push("/auth"); }}
      onSignup={() => { auth.clearError(); setAuthMode("signup"); router.push("/auth"); }}
    />
  );
}