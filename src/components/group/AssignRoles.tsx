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
      
      onMembersUpdated();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update role",
        variant: "destructive",
      });
    }
  };

  const inviteMember = async () => {
    if (!invitePhone.trim()) return;
    
    setIsInviting(true);
    try {
      // First, check if user exists
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('phone_number', invitePhone)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      if (!profileData) {
        // User doesn't exist, create pending invitation
        toast({
          title: "Info",
          description: "No user found with this phone number. They'll be added when they sign up.",
        });
        
        const { error } = await supabase
          .from('pending_invitations')
          .insert({
            group_id: groupId,
            phone_number: invitePhone,
            role: inviteRole
          });
          
        if (error) throw error;
      } else {
        // User exists, add to group
        const { error } = await supabase
          .from('group_members')
          .insert({
            group_id: groupId,
            member_id: profileData.id,
            role: inviteRole
          });
          
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Invitation sent successfully",
      });
      
      setInvitePhone("");
      setInviteRole("member");
      setDialogOpen(false);
      onMembersUpdated();
    } catch (error: any) {
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
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={inviteMember} disabled={isInviting}>
                  <Check className="h-4 w-4 mr-2" />
                  {isInviting ? "Inviting..." : "Invite"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      <div className="space-y-4">
        {members.map((member) => (
          <div key={member.id} className="flex items-center justify-between p-2 hover:bg-accent/10 rounded-lg">
            <div>
              <p className="font-medium">{member.profiles?.full_name || 'Unknown'}</p>
              <p className="text-sm text-muted-foreground">{member.profiles?.phone_number || 'No phone'}</p>
            </div>
            <div className="flex items-center gap-2">
              {member.role === 'admin' && (
                <Shield className="h-4 w-4 text-yellow-500" />
              )}
              {member.role === 'treasurer' && (
                <Shield className="h-4 w-4 text-blue-500" />
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
        ))}
      </div>
    </Card>
  );
}
