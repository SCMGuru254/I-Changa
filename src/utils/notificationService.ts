
import { supabase } from '@/integrations/supabase/client';

export interface CreateNotificationParams {
  userId: string;
  title: string;
  message: string;
  type?: 'info' | 'warning' | 'success' | 'error';
  groupId?: string;
}

export const notificationService = {
  // Create a new notification
  async createNotification(params: CreateNotificationParams) {
    try {
      const { data, error } = await supabase.rpc('create_notification', {
        p_user_id: params.userId,
        p_title: params.title,
        p_message: params.message,
        p_type: params.type || 'info',
        p_group_id: params.groupId
      });

      if (error) {
        console.error('Error creating notification:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Notification service error:', error);
      throw error;
    }
  },

  // Helper methods for common notifications
  async notifyContributionReceived(userId: string, groupId: string, amount: number, contributorName: string) {
    return this.createNotification({
      userId,
      title: 'New Contribution',
      message: `${contributorName} contributed KES ${amount.toLocaleString()} to your group`,
      type: 'success',
      groupId
    });
  },

  async notifyMemberJoined(userId: string, groupId: string, memberName: string) {
    return this.createNotification({
      userId,
      title: 'New Member',
      message: `${memberName} has joined your group`,
      type: 'info',
      groupId
    });
  },

  async notifyTaskAssigned(userId: string, groupId: string, taskTitle: string) {
    return this.createNotification({
      userId,
      title: 'Task Assigned',
      message: `You have been assigned a new task: ${taskTitle}`,
      type: 'info',
      groupId
    });
  },

  async notifyPaymentDue(userId: string, groupId: string, dueDate: string) {
    return this.createNotification({
      userId,
      title: 'Payment Due',
      message: `Your contribution is due on ${dueDate}`,
      type: 'warning',
      groupId
    });
  },

  async notifyGoalReached(userId: string, groupId: string, goalAmount: number) {
    return this.createNotification({
      userId,
      title: 'Goal Reached!',
      message: `Congratulations! Your group has reached its target of KES ${goalAmount.toLocaleString()}`,
      type: 'success',
      groupId
    });
  },

  // Mark notification as read
  async markAsRead(notificationId: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // Get unread count for a user
  async getUnreadCount(userId: string) {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }
};
