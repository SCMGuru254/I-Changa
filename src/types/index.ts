export interface Contribution {
  id: string;
  amount: number;
  contributorName: string;
  phoneNumber: string;
  date: string;
  transactionId: string;
  groupId: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  target?: number;
  totalContributions: number;
}