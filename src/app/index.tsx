import { router } from "expo-router";
import { useEffect } from "react";
import { useAppState } from "../providers/AppStateProvider";
import { usePalette } from "../hooks/usePalette";
import { OnboardingScreen, ONBOARDING_LENGTH } from "../screens/OnboardingScreen";

export default function OnboardingRoute() {
  const { palette } = usePalette();
  const {
    onboardingIndex,
    setOnboardingIndex,
    hasCompletedOnboarding,
    isOnboardingStateReady,
    completeOnboarding,
  } = useAppState();

  useEffect(() => {
    if (isOnboardingStateReady && hasCompletedOnboarding) {
      router.replace("/welcome");
    }
  }, [hasCompletedOnboarding, isOnboardingStateReady]);

  const finish = async () => {
    if (await completeOnboarding()) {
      router.replace("/welcome");
    }
  };
  const next = () =>
  onboardingIndex >= ONBOARDING_LENGTH - 1 // -1 because the array starts at 0
    ? finish()
    : setOnboardingIndex(onboardingIndex + 1);

  if (!isOnboardingStateReady || hasCompletedOnboarding) return null;

  return <OnboardingScreen index={onboardingIndex} palette={palette} onNext={next} onSkip={finish} setIndex={setOnboardingIndex}/>;
}