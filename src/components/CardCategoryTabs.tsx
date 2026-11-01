import { useEffect, useRef } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import { Colors } from "../../theme/colors";
import { styles } from "../styles/appStyles";

export type CardCategoryFilter = "all" | "grocery" | "petrol" | "retail" | "rewards";

const categories: { id: CardCategoryFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "grocery", label: "Grocery" },
  { id: "petrol", label: "Petrol" },
  { id: "retail", label: "Retail" },
  { id: "rewards", label: "Rewards" },
];

type Props = {
  palette: (typeof Colors)["light"];
  selected: CardCategoryFilter;
  onSelect: (category: CardCategoryFilter) => void;
};

export function CardCategoryTabs({ palette, selected, onSelect }: Props) {
  return (
    <View style={styles.categoryTabs}>
      {categories.map((category) => (
        <CategoryTab
          key={category.id}
          label={category.label}
          active={selected === category.id}
          palette={palette}
          onPress={() => onSelect(category.id)}
        />
      ))}
    </View>
  );
}

function CategoryTab({
  label,
  active,
  palette,
  onPress,
}: {
  label: string;
  active: boolean;
  palette: (typeof Colors)["light"];
  onPress: () => void;
}) {
  const progress = useRef(new Animated.Value(active ? 1 : 0)).current;

  useEffect(() => {
    const animation = Animated.timing(progress, {
      toValue: active ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    });
    animation.start();
    return () => animation.stop();
  }, [active, progress]);

  const backgroundColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [palette.surface, palette.brandPrimary],
  });
  const textColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [palette.textSecondary, palette.background],
  });

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      style={styles.categoryTab}
      onPress={onPress}
    >
      <Animated.View style={[styles.categoryTabContent, { backgroundColor }]}>
        <Animated.Text style={[styles.categoryTabText, { color: textColor }]}>
          {label}
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
}
