/**
 * Centralized brand configuration for South African loyalty programs
 * Maps card IDs/names to images, colors, and brand metadata
 */

import type { ImageSourcePropType } from "react-native";
import type { LoyaltyCard, LoyaltyCardCategory } from "../types/models";

export type BrandConfig = {
  id: string;
  name: string;
  category: LoyaltyCardCategory;
  images: {
    front: ImageSourcePropType | null;
    logo?: ImageSourcePropType;
  };
  colors: {
    primary: string;
    text: string;
    background: string;
  };
  mockPoints?: string | null;
};

export const BRANDS: Record<string, BrandConfig> = {
  // Grocery Retailers
  checkers: {
    id: "checkers",
    name: "Checkers",
    category: "grocery",
    images: {
      front: require("../../assets/brands/groceries/checkers/front.png"),
    },
    colors: {
      primary: "#20A9B5",
      text: "#FFFFFF",
      background: "#20A9B5",
    },
    mockPoints: null,
  },
  woolworths: {
    id: "woolworths",
    name: "Woolworths",
    category: "grocery",
    images: {
      front: require("../../assets/brands/groceries/woolworths/front.png"),
    },
    colors: {
      primary: "#111111",
      text: "#FFFFFF",
      background: "#111111",
    },
    mockPoints: null,
  },
  picknpay: {
    id: "picknpay",
    name: "Pick n Pay",
    category: "grocery",
    images: {
      front: require("../../assets/brands/groceries/picknpay/front.png"),
    },
    colors: {
      primary: "#1D4ED8",
      text: "#FFFFFF",
      background: "#1D4ED8",
    },
    mockPoints: null,
  },
  shoprite: {
    id: "shoprite",
    name: "Shoprite",
    category: "grocery",
    images: { front: null },
    colors: {
      primary: "#E93145",
      text: "#FFFFFF",
      background: "#E93145",
    },
    mockPoints: null,
  },

  // Petrol/Fuel Retailers
  bp: {
    id: "bp",
    name: "BP",
    category: "petrol",
    images: {
      front: require("../../assets/brands/petrol/bp/front.png"),
    },
    colors: {
      primary: "#19C90A",
      text: "#000000",
      background: "#19C90A",
    },
    mockPoints: null,
  },
  shell: {
    id: "shell",
    name: "Shell",
    category: "petrol",
    images: {
      front: require("../../assets/brands/petrol/shell/front.png"),
    },
    colors: {
      primary: "#FFD522",
      text: "#000000",
      background: "#FFD522",
    },
    mockPoints: null,
  },
  astron: {
    id: "astron",
    name: "Astron",
    category: "petrol",
    images: {
      front: require("../../assets/brands/petrol/astron/front.png"),
    },
    colors: {
      primary: "#FF6B35",
      text: "#FFFFFF",
      background: "#FF6B35",
    },
    mockPoints: null,
  },
  engen: {
    id: "engen",
    name: "Engen",
    category: "petrol",
    images: { front: null },
    colors: {
      primary: "#F47A12",
      text: "#FFFFFF",
      background: "#F47A12",
    },
    mockPoints: null,
  },

  // Rewards Programs
  count: {
    id: "count",
    name: "uCount",
    category: "rewards",
    images: { front: null },
    colors: {
      primary: "#7C3AED",
      text: "#FFFFFF",
      background: "#7C3AED",
    },
    mockPoints: null,
  },
};

export const SELECTABLE_CARD_BRANDS: readonly BrandConfig[] = [
  BRANDS.checkers,
  BRANDS.woolworths,
  BRANDS.picknpay,
  BRANDS.bp,
  BRANDS.shell,
  BRANDS.astron,
  BRANDS.count,
];

/**
 * Get brand config by card ID or name
 * Performs case-insensitive lookup
 */
export function getBrandConfig(cardId: string): BrandConfig | null {
  const key = cardId.toLowerCase().replace(/[^a-z0-9]/g, "");
  const configuredBrand = BRANDS[key] || Object.values(BRANDS).find(
    (brand) => brand.name.toLowerCase().replace(/[^a-z0-9]/g, "") === key,
  );
  return configuredBrand || null;
}

export function getBrandForCard(card: Pick<LoyaltyCard, "id" | "name">): BrandConfig | null {
  return getBrandConfig(card.name) || getBrandConfig(card.id);
}

export function getCardCategory(
  card: Pick<LoyaltyCard, "id" | "name" | "category">,
): LoyaltyCardCategory | null {
  return card.category ?? getBrandForCard(card)?.category ?? null;
}

/**
 * Get brand colors for a card
 * Defaults to neutral colors if brand not found
 */
export function getBrandColors(cardId: string) {
  const brand = getBrandConfig(cardId);
  return brand?.colors || {
    primary: "#CCCCCC",
    text: "#FFFFFF",
    background: "#CCCCCC",
  };
}

/**
 * Get front card image for a brand
 */
export function getBrandImage(cardId: string) {
  const brand = getBrandConfig(cardId);
  return brand?.images.front || null;
}

/**
 * Get all brands in a category
 */
export function getBrandsByCategory(category: BrandConfig["category"]): BrandConfig[] {
  return Object.values(BRANDS).filter((brand) => brand.category === category);
}

/**
 * Get featured brands for onboarding
 */
export function getFeaturedBrands() {
  return {
    groceries: [BRANDS.checkers, BRANDS.woolworths, BRANDS.picknpay],
    petrol: [BRANDS.bp, BRANDS.shell, BRANDS.astron],
  };
}
