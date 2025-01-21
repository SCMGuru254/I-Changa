export interface PricingTier {
  minMembers: number;
  feePercentage: number;
  description: string;
}

export const PRICING_TIERS: PricingTier[] = [
  {
    minMembers: 1,
    feePercentage: 2.5, // Higher fee for very small groups
    description: "Basic (1-4 members)"
  },
  {
    minMembers: 5,
    feePercentage: 1.5, // Medium fee for small groups
    description: "Standard (5-9 members)"
  },
  {
    minMembers: 10,
    feePercentage: 0.75, // Lower fee for medium groups
    description: "Premium (10+ members)"
  },
  {
    minMembers: 25,
    feePercentage: 0.5, // Lowest fee for large groups
    description: "Enterprise (25+ members)"
  }
];

export const calculateTransactionFee = (amount: number, memberCount: number): number => {
  const tier = PRICING_TIERS.findLast(tier => memberCount >= tier.minMembers) || PRICING_TIERS[0];
  return (amount * tier.feePercentage) / 100;
};

export const getLoyaltyDiscount = (membershipDays: number): number => {
  if (membershipDays >= 365) return 0.5; // 50% discount after 1 year
  if (membershipDays >= 180) return 0.25; // 25% discount after 6 months
  if (membershipDays >= 90) return 0.1; // 10% discount after 3 months
  return 0;
};