
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InviteMembers } from "./InviteMembers";
import { useAuth } from "@/contexts/AuthContext";

interface AssignRolesProps {
  groupId: string;
  groupName: string;
  isAdmin: boolean;
  members: any[];
  onMembersUpdated: () => void;
}

export function AssignRoles({ groupId, groupName, isAdmin, members, onMembersUpdated }: AssignRolesProps) {
  const { toast } = useToast();
  const { user } = useAuth();

  const handleRoleChange = async (memberId: string, newRole: string) => {
    if (!groupId || !memberId) {
      toast({
        title: "Error",
        description: "Missing required information",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Updating role for member:', memberId, 'to:', newRole);
      const { error } = await supabase
        .from('group_members')
        .update({ role: newRole })
        .eq('group_id', groupId)
        .eq('member_id', memberId);

      if (error) {
        console.error('Error updating role:', error);
        throw error;
      }

      console.log('Role updated successfully');
      toast({
        title: "Success",
        description: "Member role updated successfully",
      });
      
      onMembersUpdated();
    } catch (error: any) {
      console.error('Role update error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update role",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Group Roles</h3>
        
        {isAdmin && (
          <InviteMembers
            groupId={groupId}
            groupName={groupName}
            inviterName={user?.user_metadata?.full_name || 'Someone'}
            isAdmin={isAdmin}
          />
        )}
      </div>
      
      <div className="space-y-4">
        {members.length === 0 ? (
          <div className="text-center py-8">
            <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No members found</p>
          </div>
        ) : (
          members.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-2 hover:bg-accent/10 rounded-lg">
              <div>
                <p className="font-medium">{member.profiles?.full_name || 'Unknown'}</p>
                <p className="text-sm text-muted-foreground">{member.profiles?.phone_number || 'No phone'}</p>
              </div>
              <div className="flex items-center gap-2">
                {member.role === 'admin' && (
                  <div title="Admin">
                    <Shield className="h-4 w-4 text-yellow-500" />
                  </div>
                )}
                {member.role === 'treasurer' && (
                  <div title="Treasurer">
                    <Shield className="h-4 w-4 text-blue-500" />
                  </div>
                )}
                {isAdmin && member.member_id !== user?.id && (
                  <Select 
                    value={member.role} 
                    onValueChange={(value) => handleRoleChange(member.member_id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="treasurer">Treasurer</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
