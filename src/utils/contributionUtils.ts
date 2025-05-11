
/**
 * Utility functions for handling contribution data
 */

/**
 * Calculate the total contributed amount from all contributions
 */
export const calculateTotalContributed = (contributions: Array<{ amount: number; memberCount?: number }>): number => {
  return contributions.reduce((total, contribution) => total + contribution.amount, 0);
};

/**
 * Check if the target amount has been reached
 */
export const isTargetReached = (totalContributed: number, targetAmount: number): boolean => {
  return totalContributed >= targetAmount;
};

/**
 * Format a number as currency (KES)
 */
export const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
};

/**
 * Calculate revenue (simplified placeholder function)
 * In a real app, this would include more complex calculations
 */
export const calculateRevenue = (contributions: Array<{ amount: number; memberCount?: number }>): number => {
  // Simplified revenue calculation example - could be updated with actual business logic
  return contributions.reduce((total, contribution) => total + contribution.amount, 0);
};
