import { router } from "expo-router";
import { useAppState } from "../providers/AppStateProvider";
import { usePalette } from "../hooks/usePalette";
import { OnboardingScreen, ONBOARDING_LENGTH } from "../screens/OnboardingScreen";

export default function OnboardingRoute() {
  const { palette } = usePalette();
  const { onboardingIndex, setOnboardingIndex } = useAppState();

  const finish = () => router.replace("/welcome");
  const next = () =>
  onboardingIndex >= ONBOARDING_LENGTH - 1 // -1 because the array starts at 0
    ? finish()
    : setOnboardingIndex(onboardingIndex + 1);

  return <OnboardingScreen index={onboardingIndex} palette={palette} onNext={next} onSkip={finish} setIndex={setOnboardingIndex}/>;
}