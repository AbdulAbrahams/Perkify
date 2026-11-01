import { router } from "expo-router";
import { useAuth } from "../providers/AuthProvider";
import { useAppState } from "../providers/AppStateProvider";
import { usePalette } from "../hooks/usePalette";
import { WelcomeScreen } from "../screens/WelcomeScreen";

export default function WelcomeRoute() {
  const { palette } = usePalette();
  const auth = useAuth();
  const { setAuthMode } = useAppState();

  return (
    <WelcomeScreen
      palette={palette}
      onLogin={() => { auth.clearError(); setAuthMode("login"); router.push("/auth"); }}
      onSignup={() => { auth.clearError(); setAuthMode("signup"); router.push("/auth"); }}
    />
  );
}