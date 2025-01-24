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
  endDate: string;
  status: 'active' | 'completed' | 'expired';
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

export interface GroupMember extends Member {
  groupId: string;
  status: 'active' | 'left';
  leftAt?: string;
}