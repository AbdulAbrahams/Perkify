import { useEffect } from "react";
import { StyleSheet, Text, View, Dimensions, Image, useColorScheme } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  withRepeat,
  withSequence,
  runOnJS,
  Easing,
} from "react-native-reanimated";
import { Colors } from "../../theme/colors";

const { width } = Dimensions.get("window");

// Ensure these filenames match your assets exactly
const APP_ICON_LIGHT = require("../../assets/app-icon-light.png");
const APP_ICON_DARK = require("../../assets/app-icon-dark.png");

type Props = {
  onFinish: () => void;
};

export function AnimatedSplashScreen({ onFinish }: Props) {
  const systemScheme = useColorScheme();
  const isDark = systemScheme === "dark";
  const palette = isDark ? Colors.dark : Colors.light;

  // Core Logo & Container Animations
  const logoScale = useSharedValue(0.8);
  const logoOpacity = useSharedValue(0);
  const logoTranslateY = useSharedValue(0);
  const screenOpacity = useSharedValue(1);
  
  // Bottom Text Animations
  const wordmarkOpacity = useSharedValue(0);
  const wordmarkTranslateY = useSharedValue(10);
  
  const versionOpacity = useSharedValue(0);
  const versionTranslateY = useSharedValue(10);

  useEffect(() => {
    // 1. Logo reveals and springs
    logoOpacity.value = withTiming(1, { duration: 800 });
    logoScale.value = withSpring(1, { damping: 12, stiffness: 90 });

    // 2. Logo continuous floating effect
    logoTranslateY.value = withDelay(
      600,
      withRepeat(
        withSequence(
          withTiming(-8, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 1000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );

    // 3. Wordmark fades in and slides up
    wordmarkOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));
    wordmarkTranslateY.value = withDelay(400, withTiming(0, { duration: 600, easing: Easing.out(Easing.quad) }));

    // 4. Version number fades in slightly AFTER the wordmark
    versionOpacity.value = withDelay(700, withTiming(1, { duration: 600 }));
    versionTranslateY.value = withDelay(700, withTiming(0, { duration: 600, easing: Easing.out(Easing.quad) }));

    // 5. Fade out the whole splash screen
    screenOpacity.value = withDelay(
      2500,
      withTiming(0, { duration: 500 }, (finished) => {
        if (finished) {
          runOnJS(onFinish)();
        }
      })
    );
  }, []);

  // Animated Styles
  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [
      { scale: logoScale.value },
      { translateY: logoTranslateY.value }
    ],
  }));

  const wordmarkStyle = useAnimatedStyle(() => ({
    opacity: wordmarkOpacity.value,
    transform: [{ translateY: wordmarkTranslateY.value }],
  }));

  const versionStyle = useAnimatedStyle(() => ({
    opacity: versionOpacity.value,
    transform: [{ translateY: versionTranslateY.value }],
  }));

  const containerStyle = useAnimatedStyle(() => ({
    opacity: screenOpacity.value,
  }));

  return (
    <Animated.View style={[styles.container, { backgroundColor: palette.background }, containerStyle]}>
      
      {/* Top/Middle Spacer to keep the logo perfectly centered */}
      <View style={styles.spacer} />

      {/* Center Logo */}
      <Animated.View style={logoStyle}>
        <Image 
          source={isDark ? APP_ICON_DARK : APP_ICON_LIGHT} 
          style={styles.logoImage} 
          resizeMode="contain" 
        />
      </Animated.View>

      {/* Bottom Text Section */}
      <View style={styles.bottomContent}>
        <Animated.Text style={[styles.wordmark, { color: palette.brandPrimary}, wordmarkStyle]}>
          Perkify
        </Animated.Text>
        
        <Animated.Text style={[styles.version, { color: palette.textSecondary }]}>
          Version 0.0.1
        </Animated.Text>
      </View>
      
      {/* Bottom Spacer to balance the layout */}
      <View style={styles.spacer} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "space-between", // Changed to space-between
    paddingVertical: 60, // Added padding to push content away from screen edges
    zIndex: 999,
  },
  spacer: {
    flex: 1, // Allows the logo to sit perfectly in the middle
  },
  logoImage: {
    width: 120,
    height: 120,
  },
  bottomContent: {
    position: "absolute",
    bottom: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  wordmark: {
    fontSize: 32,
    fontWeight: "600", // Slightly bolder to match your screenshot
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  version: {
    fontSize: 14,
    fontWeight: "400",
    letterSpacing: 0.5,
  },
});