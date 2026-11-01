import React, { useRef, useEffect } from "react";
import { 
  Pressable, 
  Text, 
  View, 
  useColorScheme, 
  ScrollView, 
  Dimensions, 
  NativeSyntheticEvent, 
  NativeScrollEvent,
  ImageBackground
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../theme/colors";
import { styles } from "../styles/appStyles";

const { width } = Dimensions.get("window");

type ScrollViewRefType = React.ElementRef<typeof ScrollView>;

const slides = [
  { title: "Discover All the Perks\nYou've Been Missing", body: "Find all your loyalty rewards in one simple place." },
  { title: "Gain Points Faster", body: "Keep every loyalty card close and never miss a reward." },
  { title: "Store All Your Loyalty\nCards in 1 Place!", body: "Your everyday rewards, always ready when you are." },
];

export const ONBOARDING_LENGTH = slides.length;

// --- BRAND CONFIGURATION ---
// Ensure these file paths match exactly what you have in your assets folder
const BRANDS = {
  picknpay: {
    image: require("../../assets/brands/groceries/picknpay/front.png"), 
    textColor: "#1D4ED8", // Blue text for PnP
    points: "1,250",
  },
  checkers: {
    image: require("../../assets/brands/groceries/checkers/front.png"),
    textColor: "#111827", // Dark text for Checkers
    points: "3,400",
  },
  woolworths: {
    image: require("../../assets/brands/groceries/woolworths/front.png"),
    textColor: "#111827", // Dark text for Woolworths
    points: "2,750",
  },
  bp: {
    image: require("../../assets/brands/petrol/bp/front.png"),
    textColor: "#FFFFFF", // White text for BP
    points: "850",
  },
  shell: {
    image: require("../../assets/brands/petrol/shell/front.png"),
    textColor: "#000000", // Black text for Shell
    points: "2,100",
  },
  astron: {
    image: require("../../assets/brands/petrol/astron/front.png"),
    textColor: "#FFFFFF", // White text for Astron
    points: "1,500",
  }
};

type Props = {
  index: number;
  palette: (typeof Colors)["light"];
  onNext: () => void;
  onSkip: () => void;
  setIndex: (index: number) => void; 
};

export function OnboardingScreen({ index, palette, onNext, onSkip, setIndex }: Props) {
  const scrollViewRef = useRef<ScrollViewRefType>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollTo({ x: index * width, animated: true });
  }, [index]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offset / width);
    
    if (newIndex !== index && newIndex >= 0 && newIndex < slides.length) {
      setIndex(newIndex);
    }
  };

  return (
    <View style={[styles.onboarding, { backgroundColor: palette.background }]}>
      <View style={styles.onboardingTop}>
        <Pressable onPress={onSkip} hitSlop={12}>
          <Text style={[styles.skip, { color: palette.textSecondary }]}>Skip</Text>
        </Pressable>
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
        style={styles.flex}
      >
        {slides.map((slide, i) => (
          <View key={i} style={{ width, flex: 1, alignItems: "center", justifyContent: "space-between" }}>
            
            <View style={[styles.illustrationArea, { width: "100%", flex: 0.8 }]}>
              <RewardsIllustration index={i} />
            </View>

            <View style={{ flex: 0.5, alignItems: "center", paddingTop: 20 }}>
              <Text style={[styles.onboardingTitle, { color: palette.text }]}>
                {slide.title}
              </Text>
              <Text style={[styles.onboardingBody, { color: palette.textSecondary }]}>
                {slide.body}
              </Text>
            </View>

          </View>
        ))}
      </ScrollView>

      <View style={styles.onboardingFooter}>
        <View style={styles.dots}>
          {Array.from({ length: slides.length }, (_, dotIndex) => (
            <View 
              key={dotIndex} 
              style={[
                styles.dot, 
                { backgroundColor: dotIndex === index ? palette.brandAccent : palette.border }
              ]} 
            />
          ))}
        </View>

        <Pressable style={[styles.nextButton, { backgroundColor: palette.brandPrimary }]} onPress={onNext}>
          <Text style={styles.nextButtonText}>
            {index === slides.length - 1 ? "Get started" : "Continue"}
          </Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        </Pressable>
      </View>
      
      <Text style={[styles.onboardingFootnote, { color: palette.textSecondary }]}>Your rewards. Your way.</Text>
    </View>
  );
}

function RewardsIllustration({ index }: { index: number }) {
  // Assign South African brands to the 3 slides
  const currentBrands = index === 0 
    ? [BRANDS.checkers, BRANDS.woolworths, BRANDS.picknpay] 
    : [BRANDS.bp, BRANDS.shell, BRANDS.astron];

  return (
    <View style={styles.rewardStack}>
      
      {/* 1. Back Card */}
      <ImageBackground 
        source={currentBrands[0].image} 
        style={[styles.rewardCard, styles.rewardBack]}
        imageStyle={{ borderRadius: 16 }} // This clips the image to match the card radius
      >
      </ImageBackground>

      {/* 2. Middle Card */}
      <ImageBackground 
        source={currentBrands[1].image} 
        style={[styles.rewardCard, styles.rewardMiddle]}
        imageStyle={{ borderRadius: 16 }}
      >
      </ImageBackground>

      {/* 3. Front Card */}
      <ImageBackground 
        source={currentBrands[2].image} 
        style={[styles.rewardCard, styles.rewardFront]}
        imageStyle={{ borderRadius: 16 }}
      >
      </ImageBackground>

    </View>
  );
}