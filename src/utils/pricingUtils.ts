
export const calculateRevenue = (contributions: Array<{ amount: number; memberCount: number; contributorName: string; date: string }>) => {
  return contributions.reduce((sum, c) => sum + c.amount, 0) * 0.02;
};

export const calculateTotalContributed = (contributions: Array<{ amount: number; memberCount: number; contributorName: string; date: string }>) => {
  return contributions.reduce((sum, c) => sum + c.amount, 0);
};

export const isTargetReached = (totalContributed: number, targetAmount: number) => {
  return totalContributed >= targetAmount;
};

export const formatCurrency = (amount: number) => {
  return amount.toLocaleString('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
};
