import { BRANDS } from "./brands";

export type BrandRewardBenefit = {
  title: string;
  description: string;
  icon: string;
};

export type BrandRewards = {
  brandId: string;
  brandName: string;
  title: string;
  headline: string;
  tagline: string;
  benefits: BrandRewardBenefit[];
};

export const BRAND_REWARDS: Record<string, BrandRewards> = {
  checkers: {
    brandId: "checkers",
    brandName: BRANDS.checkers.name,
    title: "Checkers rewards",
    headline: "Instant savings, no points, no hassle.",
    tagline: "South Africa's largest rewards programme.",
    benefits: [
      {
        title: "Instant cash savings",
        description: "Swipe your Xtra Savings card for instant discounts at the till.",
        icon: "cash-multiple",
      },
      {
        title: "Personalised offers",
        description: "Get deals tailored to your shopping behaviour.",
        icon: "tag-outline",
      },
      {
        title: "Free monthly funeral grocery cover",
        description: "Xtra Savings members get free funeral grocery cover.",
        icon: "shield-check-outline",
      },
    ],
  },
  woolworths: {
    brandId: "woolworths",
    brandName: BRANDS.woolworths.name,
    title: "Woolworths rewards",
    headline: "Save instantly, every time you shop.",
    tagline: "No points, just instant savings.",
    benefits: [
      {
        title: "Instant savings on WRewards products",
        description: "Swipe your card for immediate discounts in-store, online, or on the app.",
        icon: "tag-outline",
      },
      {
        title: "Extra 5% off with a Woolies card",
        description: "Get an additional 5% off selected items when paying with a Woolies Store or Credit Card.",
        icon: "credit-card-outline",
      },
      {
        title: "Exclusive perks & vouchers",
        description: "Preview sale invitations, a free W Magazine, and special savings vouchers.",
        icon: "gift-outline",
      },
    ],
  },
  picknpay: {
    brandId: "picknpay",
    brandName: BRANDS.picknpay.name,
    title: "Pick n Pay rewards",
    headline: "Save now, save later.",
    tagline: "Instant discounts plus points that work like cash.",
    benefits: [
      {
        title: "Instant discounts at the till",
        description: "Get immediate savings on your shop when you swipe your Smart Shopper card.",
        icon: "cash-multiple",
      },
      {
        title: "Points that work like cash",
        description: "Earn points on every purchase to spend on future shops.",
        icon: "wallet-outline",
      },
      {
        title: "Personalised vouchers & lifestyle clubs",
        description: "Join clubs like Live Well, Wine, Coffee, Baby, and Pet for deeper savings and triple points.",
        icon: "account-group-outline",
      },
    ],
  },
  bp: {
    brandId: "bp",
    brandName: BRANDS.bp.name,
    title: "BP Rewards",
    headline: "Swipe, swipe, get rewards!",
    tagline: "Bigger rewards, bigger value.",
    benefits: [
      {
        title: "Earn up to 30c per litre",
        description: "Swipe your BP Rewards and Smart Shopper cards together.",
        icon: "fuel",
      },
      {
        title: "Earn 1% cashback",
        description: "Get cashback on bp Express purchases.",
        icon: "storefront-outline",
      },
      {
        title: "Earn 20c/l on BP Rewards",
        description: "Get up to 50% fuel cashback per month with Discovery Insure.",
        icon: "cash-multiple",
      },
    ],
  },
  shell: {
    brandId: "shell",
    brandName: BRANDS.shell.name,
    title: "Shell rewards",
    headline: "Earn instant cash-rewards on fuel and shop purchases.",
    tagline: "Rewards on the forecourt and in-store.",
    benefits: [
      {
        title: "Instant cash-rewards on fuel",
        description: "Earn cash-rewards for every litre of fuel purchased at Shell service stations.",
        icon: "fuel",
      },
      {
        title: "Rewards on shop purchases",
        description: "Earn cash-rewards on selected Shop items in-store.",
        icon: "storefront-outline",
      },
      {
        title: "Redeem on fuel or in-store",
        description: "Use your cash rewards on the forecourt for fuel or in the Shell Select store.",
        icon: "cash-multiple",
      },
    ],
  },
  astron: {
    brandId: "astron",
    brandName: BRANDS.astron.name,
    title: "Astron rewards",
    headline: "Fuel up, get rewarded.",
    tagline: "Daily and monthly vouchers with Astron Energy Rewards.",
    benefits: [
      {
        title: "R25 daily vouchers",
        description: "Fuel up any amount at participating Astron Energy forecourts for a chance to win a daily voucher.",
        icon: "ticket-outline",
      },
      {
        title: "R150 monthly vouchers",
        description: "Monthly rewards for members who fill up with Astron Energy.",
        icon: "ticket-confirmation-outline",
      },
      {
        title: "Quick sign-up via USSD, web, or app",
        description: "Register in seconds and claim rewards with your cellphone number at the forecourt.",
        icon: "cellphone",
      },
    ],
  },
  count: {
  brandId: "count",
  brandName: BRANDS.count.name,
  title: "uCount rewards",
  headline: "Choose Your Own Rewards — earn more in your preferred category.",
  tagline: "Up to 40% back in Rewards Points on Groceries, Fashion or Lifestyle.",
  benefits: [
    {
      title: "Grocery Rewards — up to 40% back",
      description:
        "Earn up to 40% back in Rewards Points at major grocery retailers (Checkers Sixty60 and Shoprite Sixty60 up to 40%, in-store Checkers/Shoprite up to 30%, other grocery retailers up to 20%).",
      icon: "cart-outline",
    },
    {
      title: "Fashion Rewards — up to 20% back",
      description:
        "Choose Fashion Retailers and earn up to 20% back in Rewards Points on your clothing and fashion shopping.",
      icon: "tshirt-crew-outline",
    },
    {
      title: "Lifestyle Rewards — up to 20% back",
      description:
        "Select a Lifestyle Retailer and earn up to 20% back on gym memberships, movies, book stores and restaurants.",
      icon: "movie-open-outline",
    },
    {
      title: "Higher tiers earn more",
      description:
        "Rewards rates scale with your Tier (1–5) — a Tier 5 virtual credit card earns up to 40% at Sixty60 vs 4% at Tier 1.",
      icon: "trending-up",
    },
    {
      title: "R2,500 monthly cap",
      description:
        "Earning on your chosen category is capped at the lower of 20% of your total qualifying monthly card spend or R2,500 per fixed cycle.",
      icon: "cash-multiple",
    },
    {
      title: "Other categories still earn 1%",
      description:
        "The two categories you don't choose still earn up to 1% back in Rewards Points.",
      icon: "percent-outline",
    },
  ],
},
};

export function getBrandRewards(brandId: string, brandName?: string): BrandRewards {
  const key = brandId.toLowerCase().replace(/[^a-z0-9]/g, "");
  return BRAND_REWARDS[key] ?? {
    brandId: key,
    brandName: brandName ?? brandId,
    title: `${brandName ?? brandId} rewards`,
    headline: "",
    tagline: "",
    benefits: [],
  };
}
