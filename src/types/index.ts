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

export type MemberRole = 'admin' | 'treasurer' | 'member';

export interface Member {
  id: string;
  name: string;
  phoneNumber: string;
  role: MemberRole;
  joinedAt: string;
  totalContributions: number;
}