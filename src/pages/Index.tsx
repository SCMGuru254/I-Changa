import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { GroupHeader } from "@/components/dashboard/GroupHeader";
import { MembersList } from "@/components/dashboard/MembersList";
import { ContributionsTable } from "@/components/dashboard/ContributionsTable";

export default function Index() {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, navigate, authLoading]);

  const { data: groups, isLoading: groupsLoading, error: groupsError } = useQuery({
    queryKey: ['userGroups', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
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

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
    staleTime: 30000, // Cache data for 30 seconds
    refetchOnWindowFocus: false, // Disable automatic refetch on window focus
  });

  const { data: groupMembers, isLoading: membersLoading, error: membersError } = useQuery({
    queryKey: ['groupMembers', groups?.[0]?.id],
    queryFn: async () => {
      if (!groups?.[0]?.id) return null;
      
      const { data, error } = await supabase
        .from('group_members')
        .select(`
          *,
          profiles(full_name, phone_number)
        `)
        .eq('group_id', groups[0].id);

      if (error) throw error;
      return data;
    },
    enabled: !!groups?.[0]?.id,
    staleTime: 30000,
    refetchOnWindowFocus: false,
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
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
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
          <GroupHeader
            name={currentGroup.name}
            description={currentGroup.description}
            targetAmount={currentGroup.target_amount}
            isAdmin={isAdmin}
            onLeave={handleLeaveGroup}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <MembersList
              members={groupMembers}
              isAdmin={isAdmin}
              currentUserId={user.id}
              onRoleChange={handleRoleChange}
            />
            <ContributionsTable
              contributions={currentGroup.contributions}
            />
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
}