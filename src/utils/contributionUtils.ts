
export const calculateTotalContributions = (contributions: any[]): number => {
  return contributions.reduce((total, contribution) => total + (contribution.amount || 0), 0);
};

export const calculateProgress = (current: number, target: number): number => {
  if (target === 0) return 0;
  return Math.min((current / target) * 100, 100);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
  }).format(amount);
};

export const getDaysRemaining = (endDate: string): number => {
  const end = new Date(endDate);
  const now = new Date();
  const diffTime = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

export const getGroupStatus = (endDate: string, targetAmount: number, currentAmount: number): 'active' | 'completed' | 'expired' => {
  const daysRemaining = getDaysRemaining(endDate);
  
  if (currentAmount >= targetAmount) {
    return 'completed';
  }
  
  if (daysRemaining <= 0) {
    return 'expired';
  }
  
  return 'active';
};
