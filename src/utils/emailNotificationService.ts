
import { supabase } from '@/integrations/supabase/client';
import { activityService } from './activityService';

export interface EmailNotificationData {
  recipientId: string;
  recipientEmail: string;
  type: 'contribution' | 'task_assigned' | 'task_completed' | 'member_joined' | 'group_created';
  subject: string;
  title: string;
  message: string;
  groupId?: string;
  metadata?: Record<string, any>;
}

export const emailNotificationService = {
  async sendNotification(data: EmailNotificationData) {
    try {
      // Create notification in database
      const { error: notificationError } = await supabase.rpc('create_notification', {
        p_user_id: data.recipientId,
        p_title: data.title,
        p_message: data.message,
        p_type: data.type,
        p_group_id: data.groupId || null
      });

      if (notificationError) {
        console.error('Error creating notification:', notificationError);
        throw notificationError;
      }

      // Log activity
      if (data.groupId) {
        await activityService.createActivity({
          userId: data.recipientId,
          groupId: data.groupId,
          activityType: 'message_sent',
          title: 'Notification sent',
          description: data.title,
          metadata: { type: data.type, ...data.metadata }
        });
      }

      console.log('Email notification sent successfully:', data.title);
      return { success: true };
    } catch (error) {
      console.error('Email notification service error:', error);
      return { success: false, error };
    }
  },

  async notifyContribution(groupId: string, contributorName: string, amount: number, groupMembers: any[]) {
    const notifications = groupMembers.map(member => ({
      recipientId: member.member_id,
      recipientEmail: member.profiles?.email || '',
      type: 'contribution' as const,
      subject: 'New Contribution Received',
      title: 'New Group Contribution',
      message: `${contributorName} has contributed KES ${amount.toLocaleString()} to your group`,
      groupId,
      metadata: { amount, contributorName }
    }));

    return Promise.all(notifications.map(notification => 
      this.sendNotification(notification)
    ));
  },

  async notifyTaskAssigned(taskTitle: string, assigneeName: string, assigneeId: string, groupId: string) {
    return this.sendNotification({
      recipientId: assigneeId,
      recipientEmail: '',
      type: 'task_assigned',
      subject: 'New Task Assigned',
      title: 'Task Assigned to You',
      message: `You have been assigned a new task: "${taskTitle}"`,
      groupId,
      metadata: { taskTitle, assigneeName }
    });
  },

  async notifyTaskCompleted(taskTitle: string, assigneeName: string, groupMembers: any[], groupId: string) {
    const notifications = groupMembers.map(member => ({
      recipientId: member.member_id,
      recipientEmail: member.profiles?.email || '',
      type: 'task_completed' as const,
      subject: 'Task Completed',
      title: 'Group Task Completed',
      message: `${assigneeName} has completed the task: "${taskTitle}"`,
      groupId,
      metadata: { taskTitle, assigneeName }
    }));

    return Promise.all(notifications.map(notification => 
      this.sendNotification(notification)
    ));
  },

  async notifyMemberJoined(memberName: string, groupMembers: any[], groupId: string) {
    const notifications = groupMembers.map(member => ({
      recipientId: member.member_id,
      recipientEmail: member.profiles?.email || '',
      type: 'member_joined' as const,
      subject: 'New Group Member',
      title: 'New Member Joined',
      message: `${memberName} has joined your group`,
      groupId,
      metadata: { memberName }
    }));

    return Promise.all(notifications.map(notification => 
      this.sendNotification(notification)
    ));
  }
};
