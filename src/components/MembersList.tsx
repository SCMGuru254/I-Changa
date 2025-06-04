import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Crown, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface MembersListProps {
  groupMembers: any[];
  isAdmin: boolean;
  groupId: string;
}

export function MembersList({ groupMembers, isAdmin, groupId }: MembersListProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleRoleChange = async (memberId: string, newRole: string) => {
    if (!groupId) return;

    try {
      const { error } = await supabase
        .from('group_members')
        .update({ role: newRole })
        .eq('group_id', groupId)
        .eq('member_id', memberId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Member role updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Add privacy options for phone numbers and profile pictures
  const handlePrivacyToggle = async (memberId: string, field: 'phoneNumber' | 'profilePicture', isPrivate: boolean) => {
    try {
      const { error } = await supabase
        .from('members')
        .update({ [field]: isPrivate ? null : user[field] })
        .eq('id', memberId);

      if (error) throw error;

      toast({
        title: 'Privacy Updated',
        description: `${field} privacy has been updated successfully.`,
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update privacy settings.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Members</h3>
      <div className="space-y-4">
        {groupMembers?.map((member) => (
          <div key={member.id} className="flex items-center justify-between p-2 hover:bg-accent/10 rounded-lg">
            <div className="flex items-center gap-4">
              <img
                src={member.profiles?.avatar_url || '/placeholder.svg'}
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-medium">{member.profiles?.full_name || 'Unknown'}</p>
                <p className="text-sm text-muted-foreground">
                  {member.profiles?.phone_number ? member.profiles.phone_number : 'Hidden'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {member.role === 'admin' && (
                <Crown className="h-4 w-4 text-yellow-500" />
              )}
              {member.role === 'treasurer' && (
                <Shield className="h-4 w-4 text-blue-500" />
              )}
              {isAdmin && member.member_id !== user.id && (
                <select
                  value={member.role}
                  onChange={(e) => handleRoleChange(member.member_id, e.target.value)}
                  className="text-sm border rounded p-1"
                >
                  <option value="member">Member</option>
                  <option value="treasurer">Treasurer</option>
                  <option value="admin">Admin</option>
                </select>
              )}
              {isAdmin && (
                <Button
                  onClick={() => handlePrivacyToggle(member.id, 'phoneNumber', !member.profiles?.phone_number)}
                  className="text-sm"
                >
                  Toggle Phone Privacy
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      {isAdmin && (
        <Button className="mt-4 w-full flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Invite Member
        </Button>
      )}
    </Card>
  );
}
