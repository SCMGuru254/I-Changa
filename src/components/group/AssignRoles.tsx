
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, UserPlus, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AssignRolesProps {
  groupId: string;
  isAdmin: boolean;
  members: any[];
  onMembersUpdated: () => void;
}

export function AssignRoles({ groupId, isAdmin, members, onMembersUpdated }: AssignRolesProps) {
  const { toast } = useToast();
  const [invitePhone, setInvitePhone] = useState("");
  const [inviteRole, setInviteRole] = useState("member");
  const [isInviting, setIsInviting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

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

  const inviteMember = async () => {
    if (!invitePhone.trim()) {
      toast({
        title: "Validation Error",
        description: "Phone number is required",
        variant: "destructive",
      });
      return;
    }
    
    setIsInviting(true);
    try {
      console.log('Inviting member with phone:', invitePhone);
      
      // First, check if user exists with this phone number
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('phone_number', invitePhone)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error checking profile:', profileError);
        throw profileError;
      }

      if (!profileData) {
        // User doesn't exist, create pending invitation
        const { error: inviteError } = await supabase
          .from('pending_invitations')
          .insert({
            group_id: groupId,
            phone_number: invitePhone,
            role: inviteRole
          });
          
        if (inviteError) {
          console.error('Error creating pending invitation:', inviteError);
          throw inviteError;
        }

        console.log('Pending invitation created');
        toast({
          title: "Invitation Sent",
          description: "User will be added when they sign up with this phone number",
        });
      } else {
        // User exists, check if already a member
        const { data: existingMember } = await supabase
          .from('group_members')
          .select('id')
          .eq('group_id', groupId)
          .eq('member_id', profileData.id)
          .single();

        if (existingMember) {
          toast({
            title: "Already a Member",
            description: "This user is already a member of the group",
            variant: "destructive",
          });
          return;
        }

        // Add user to group
        const { error: memberError } = await supabase
          .from('group_members')
          .insert({
            group_id: groupId,
            member_id: profileData.id,
            role: inviteRole
          });
          
        if (memberError) {
          console.error('Error adding group member:', memberError);
          throw memberError;
        }

        console.log('Member added to group');
        toast({
          title: "Success",
          description: "Member added to group successfully",
        });
      }

      setInvitePhone("");
      setInviteRole("member");
      setDialogOpen(false);
      onMembersUpdated();
    } catch (error: any) {
      console.error('Invite member error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to invite member",
        variant: "destructive",
      });
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Group Roles</h3>
        
        {isAdmin && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Invite Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite New Member</DialogTitle>
                <DialogDescription>
                  Enter the phone number of the person you want to invite.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="+254700000000"
                    value={invitePhone}
                    onChange={(e) => setInvitePhone(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={inviteRole} onValueChange={setInviteRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="treasurer">Treasurer</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => {
                  setDialogOpen(false);
                  setInvitePhone("");
                  setInviteRole("member");
                }}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={inviteMember} disabled={isInviting || !invitePhone.trim()}>
                  <Check className="h-4 w-4 mr-2" />
                  {isInviting ? "Inviting..." : "Invite"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
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
                  <Shield className="h-4 w-4 text-yellow-500" title="Admin" />
                )}
                {member.role === 'treasurer' && (
                  <Shield className="h-4 w-4 text-blue-500" title="Treasurer" />
                )}
                {isAdmin && (
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
