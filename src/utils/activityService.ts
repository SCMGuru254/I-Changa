
import { supabase } from '@/integrations/supabase/client';

export interface CreateActivityParams {
  userId: string;
  groupId: string;
  activityType: 'contribution' | 'member_joined' | 'group_created' | 'task_completed' | 'message_sent';
  title: string;
  description?: string;
  metadata?: any;
}

export const activityService = {
  // Create a new activity record
  async createActivity(params: CreateActivityParams) {
    try {
      const { data, error } = await supabase.rpc('create_activity', {
        p_user_id: params.userId,
        p_group_id: params.groupId,
        p_activity_type: params.activityType,
        p_title: params.title,
        p_description: params.description,
        p_metadata: params.metadata || {}
      });

      if (error) {
        console.error('Error creating activity:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Activity service error:', error);
      throw error;
    }
  },

  // Helper methods for common activities
  async logContribution(userId: string, groupId: string, amount: number, contributorName: string) {
    return this.createActivity({
      userId,
      groupId,
      activityType: 'contribution',
      title: `${contributorName} contributed to the group`,
      description: `New contribution of KES ${amount.toLocaleString()} received`,
      metadata: { amount, contributorName }
    });
  },

  async logMemberJoined(userId: string, groupId: string, memberName: string) {
    return this.createActivity({
      userId,
      groupId,
      activityType: 'member_joined',
      title: `${memberName} joined the group`,
      description: `Welcome ${memberName} to the group!`,
      metadata: { memberName }
    });
  },

  async logGroupCreated(userId: string, groupId: string, groupName: string) {
    return this.createActivity({
      userId,
      groupId,
      activityType: 'group_created',
      title: `Created new group: ${groupName}`,
      description: `Group "${groupName}" has been successfully created`,
      metadata: { groupName }
    });
  },

  async logTaskCompleted(userId: string, groupId: string, taskTitle: string, assigneeName: string) {
    return this.createActivity({
      userId,
      groupId,
      activityType: 'task_completed',
      title: `${assigneeName} completed a task`,
      description: `Task "${taskTitle}" has been marked as completed`,
      metadata: { taskTitle, assigneeName }
    });
  },

  async logMessageSent(userId: string, groupId: string, senderName: string, isVoice = false) {
    return this.createActivity({
      userId,
      groupId,
      activityType: 'message_sent',
      title: `${senderName} sent a ${isVoice ? 'voice ' : ''}message`,
      description: isVoice ? 'New voice message in group chat' : 'New message in group chat',
      metadata: { senderName, isVoice }
    });
  }
};
