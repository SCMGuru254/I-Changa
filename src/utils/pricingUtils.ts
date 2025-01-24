export interface PricingTier {
  minMembers: number;
  feePercentage: number;
  description: string;
}

export const PRICING_TIERS: PricingTier[] = [
  {
    minMembers: 1,
    feePercentage: 2.5,
    description: "Basic (1-4 members)"
  },
  {
    minMembers: 5,
    feePercentage: 1.5,
    description: "Standard (5-9 members)"
  },
  {
    minMembers: 10,
    feePercentage: 0.75,
    description: "Premium (10+ members)"
  },
  {
    minMembers: 25,
    feePercentage: 0.5,
    description: "Enterprise (25+ members)"
  }
];

export const calculateTransactionFee = (amount: number, memberCount: number): number => {
  const tier = [...PRICING_TIERS]
    .reverse()
    .find(tier => memberCount >= tier.minMembers) || PRICING_TIERS[0];
  return (amount * tier.feePercentage) / 100;
};

export const getLoyaltyDiscount = (membershipDays: number): number => {
  if (membershipDays >= 365) return 0.5;
  if (membershipDays >= 180) return 0.25;
  if (membershipDays >= 90) return 0.1;
  return 0;
};

export const calculateRevenue = (contributions: { amount: number; memberCount: number }[]): number => {
  return contributions.reduce((total, contribution) => {
    const fee = calculateTransactionFee(contribution.amount, contribution.memberCount);
    return total + fee;
  }, 0);
};