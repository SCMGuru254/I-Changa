
import { supabase } from "@/integrations/supabase/client";
import { validationService } from "./validationService";
import { errorHandlingService } from "./errorHandlingService";

export interface InviteData {
  groupId: string;
  inviterName: string;
  groupName: string;
  email?: string;
  phoneNumber?: string;
  role?: string;
}

export const inviteService = {
  async generateInviteLink(groupId: string): Promise<string> {
    try {
      // Get the group's share token
      const { data: group, error } = await supabase
        .from('groups')
        .select('share_token')
        .eq('id', groupId)
        .single();

      if (error) throw error;

      const baseUrl = window.location.origin;
      return `${baseUrl}/join/${group.share_token}`;
    } catch (error) {
      console.error('Error generating invite link:', error);
      throw error;
    }
  },

  async sendEmailInvite(data: InviteData): Promise<{ success: boolean; error?: string }> {
    if (!data.email) {
      return { success: false, error: 'Email is required' };
    }

    const validation = validationService.validateEmail(data.email);
    if (!validation.isValid) {
      return { success: false, error: validation.errors[0] };
    }

    try {
      const inviteLink = await this.generateInviteLink(data.groupId);
      
      // Call edge function to send email
      const { error } = await supabase.functions.invoke('send-invite-email', {
        body: {
          email: data.email,
          inviterName: data.inviterName,
          groupName: data.groupName,
          inviteLink: inviteLink,
          role: data.role || 'member'
        }
      });

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      console.error('Email invite error:', error);
      return { success: false, error: error.message };
    }
  },

  async sendPhoneInvite(data: InviteData): Promise<{ success: boolean; error?: string }> {
    if (!data.phoneNumber) {
      return { success: false, error: 'Phone number is required' };
    }

    const validation = validationService.validatePhoneNumber(data.phoneNumber);
    if (!validation.isValid) {
      return { success: false, error: validation.errors[0] };
    }

    try {
      // First check if user exists with this phone number
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('phone_number', data.phoneNumber)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      if (!profileData) {
        // Create pending invitation
        const { error: inviteError } = await supabase
          .from('pending_invitations')
          .insert({
            group_id: data.groupId,
            phone_number: data.phoneNumber,
            role: data.role || 'member'
          });
          
        if (inviteError) throw inviteError;
      } else {
        // Add user directly to group
        const { error: memberError } = await supabase
          .from('group_members')
          .insert({
            group_id: data.groupId,
            member_id: profileData.id,
            role: data.role || 'member'
          });
          
        if (memberError) throw memberError;
      }

      // Send SMS notification
      const inviteLink = await this.generateInviteLink(data.groupId);
      
      const { error: smsError } = await supabase.functions.invoke('send-sms-invite', {
        body: {
          phoneNumber: data.phoneNumber,
          inviterName: data.inviterName,
          groupName: data.groupName,
          inviteLink: inviteLink
        }
      });

      if (smsError) {
        console.warn('SMS sending failed, but invitation was recorded:', smsError);
      }

      return { success: true };
    } catch (error: any) {
      console.error('Phone invite error:', error);
      return { success: false, error: error.message };
    }
  },

  async copyInviteLink(groupId: string): Promise<{ success: boolean; link?: string; error?: string }> {
    try {
      const link = await this.generateInviteLink(groupId);
      
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(link);
        return { success: true, link };
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = link;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return { success: true, link };
      }
    } catch (error: any) {
      console.error('Copy link error:', error);
      return { success: false, error: error.message };
    }
  }
};
