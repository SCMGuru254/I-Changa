
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

// Task related types
export interface Task {
  id: string;
  group_id: string;
  title: string;
  description?: string;
  assignee_id?: string;
  is_completed: boolean;
  due_date?: string;
  created_at?: string;
  assignee_name?: string;
}

// Message related types
export interface Message {
  id: string;
  group_id: string;
  sender_id: string;
  content: string;
  is_voice: boolean;
  audio_url?: string;
  created_at: string;
  sender_name?: string;
}

// Activity related types
export interface ActivityMetadata {
  amount?: number;
  contributorName?: string;
  memberName?: string;
  groupName?: string;
  taskTitle?: string;
  assigneeName?: string;
  senderName?: string;
  isVoice?: boolean;
}

export interface Activity {
  id: string;
  user_id?: string;
  group_id?: string;
  activity_type: 'contribution' | 'member_joined' | 'group_created' | 'task_completed' | 'message_sent';
  title: string;
  description?: string;
  metadata?: ActivityMetadata;
  created_at: string;
}

// Achievement related types
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string | null;
  points: number;
  created_at?: string;
}

export interface AchievementWithStatus extends Achievement {
  isUnlocked: boolean;
  earned_at?: string;
}
