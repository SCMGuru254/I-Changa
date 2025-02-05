import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, UserPlus, LogOut, Crown, Shield } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Index() {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  // Check auth state
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, navigate, authLoading]);

  const { data: groups, isLoading: groupsLoading, error: groupsError } = useQuery({
    queryKey: ['userGroups', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      console.log("Fetching groups for user:", user.id);
      
      const { data, error } = await supabase
        .from('groups')
        .select(`
          *,
          group_members!inner(role),
          contributions(
            amount,
            transaction_id,
            created_at,
            profiles(full_name)
          )
        `)
        .eq('group_members.member_id', user.id);

      if (error) {
        console.error("Error fetching groups:", error);
        throw error;
      }
      
      console.log("Fetched groups:", data);
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: groupMembers, isLoading: membersLoading, error: membersError } = useQuery({
    queryKey: ['groupMembers', groups?.[0]?.id],
    queryFn: async () => {
      if (!groups?.[0]?.id) return null;
      console.log("Fetching members for group:", groups[0].id);
      
      const { data, error } = await supabase
        .from('group_members')
        .select(`
          *,
          profiles(full_name, phone_number)
        `)
        .eq('group_id', groups[0].id);

      if (error) {
        console.error("Error fetching members:", error);
        throw error;
      }
      
      console.log("Fetched members:", data);
      return data;
    },
    enabled: !!groups?.[0]?.id,
  });

  const handleLeaveGroup = async () => {
    if (!user || !groups?.[0]?.id) return;

    try {
      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groups[0].id)
        .eq('member_id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "You have left the group successfully",
      });
      
      navigate('/');
    } catch (error: any) {
      console.error("Error leaving group:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleRoleChange = async (memberId: string, newRole: string) => {
    if (!groups?.[0]?.id) return;

    try {
      const { error } = await supabase
        .from('group_members')
        .update({ role: newRole })
        .eq('group_id', groups[0].id)
        .eq('member_id', memberId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Member role updated successfully",
      });
    } catch (error: any) {
      console.error("Error updating role:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (groupsLoading || membersLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (groupsError || membersError) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="p-6 text-center text-red-500">
          <p>Error loading data. Please try again later.</p>
          <Button 
            onClick={() => navigate('/auth')} 
            className="mt-4"
            variant="outline"
          >
            Back to Login
          </Button>
        </Card>
      </div>
    );
  }

  const currentGroup = groups?.[0];
  const isAdmin = currentGroup?.group_members[0]?.role === 'admin';

  return (
    <div className="container mx-auto py-8 px-4">
      <DashboardHeader />
      
      {currentGroup ? (
        <div className="space-y-8">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">{currentGroup.name}</h2>
            <p className="text-muted-foreground mb-4">{currentGroup.description}</p>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">Target Amount:</p>
                <p className="text-xl text-primary">
                  KES {currentGroup.target_amount?.toLocaleString()}
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={handleLeaveGroup}
                disabled={isAdmin}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Leave Group
              </Button>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Members</h3>
              <div className="space-y-4">
                {groupMembers?.map((member) => (
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

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Recent Contributions</h3>
              {currentGroup.contributions?.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentGroup.contributions?.map((contribution) => (
                      <TableRow key={contribution.transaction_id}>
                        <TableCell>{contribution.profiles?.full_name}</TableCell>
                        <TableCell>KES {contribution.amount.toLocaleString()}</TableCell>
                        <TableCell>{contribution.transaction_id}</TableCell>
                        <TableCell>
                          {new Date(contribution.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-muted-foreground">No contributions yet</p>
              )}
            </Card>
          </div>
        </div>
      ) : (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground mb-4">
            You haven't joined any groups yet. Create one to get started!
          </p>
          <Button onClick={() => navigate('/onboarding')}>Create Group</Button>
        </Card>
      )}
    </div>
  );
