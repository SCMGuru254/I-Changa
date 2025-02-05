import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Crown, Shield } from "lucide-react";

interface MembersListProps {
  members: any[];
  isAdmin: boolean;
  currentUserId: string;
  onRoleChange: (memberId: string, newRole: string) => void;
}

export function MembersList({ members, isAdmin, currentUserId, onRoleChange }: MembersListProps) {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Members</h3>
      <div className="space-y-4">
        {members?.map((member) => (
          <div key={member.id} className="flex items-center justify-between p-2 hover:bg-accent/10 rounded-lg">
            <div>
              <p className="font-medium">{member.profiles?.full_name}</p>
              <p className="text-sm text-muted-foreground">{member.profiles?.phone_number}</p>
            </div>
            <div className="flex items-center gap-2">
              {member.role === 'admin' && (
                <Crown className="h-4 w-4 text-yellow-500" />
              )}
              {member.role === 'treasurer' && (
                <Shield className="h-4 w-4 text-blue-500" />
              )}
              {isAdmin && member.member_id !== currentUserId && (
                <select
                  value={member.role}
                  onChange={(e) => onRoleChange(member.member_id, e.target.value)}
                  className="text-sm border rounded p-1"
                >
                  <option value="member">Member</option>
                  <option value="treasurer">Treasurer</option>
                  <option value="admin">Admin</option>
                </select>
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