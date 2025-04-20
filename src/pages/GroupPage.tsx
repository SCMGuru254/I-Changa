
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GroupAgenda } from "@/components/GroupAgenda";
import { ContributionForm } from "@/components/ContributionForm";
import { ContributionsList } from "@/components/ContributionsList";
import { DashboardStats } from "@/components/DashboardStats";
import { MemberLeaderboard } from "@/components/MemberLeaderboard";
import { GroupManagement } from "@/components/GroupManagement";
import { MessageList } from "@/components/messaging/MessageList";
import { AssignRoles } from "@/components/group/AssignRoles";
import { TaskManagement } from "@/components/group/TaskManagement";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function GroupPage() {
  const { groupId } = useParams();
  const { user } = useAuth();

  const { data: group, isLoading: groupLoading } = useQuery({
    queryKey: ['group', groupId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('groups')
        .select('*, group_members!inner(*)')
        .eq('id', groupId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: memberRole } = useQuery({
    queryKey: ['memberRole', groupId],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('group_members')
        .select('role')
        .eq('group_id', groupId)
        .eq('member_id', user.id)
        .single();

      if (error) return null;
      return data.role;
    },
  });

  const { data: members, isLoading: membersLoading, refetch: refetchMembers } = useQuery({
    queryKey: ['groupMembers', groupId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('group_members')
        .select(`
          *,
          profiles(id, full_name, phone_number)
        `)
        .eq('group_id', groupId);

      if (error) throw error;
      return data || [];
    },
  });

  const { data: contributions, isLoading: contributionsLoading } = useQuery({
    queryKey: ['groupContributions', groupId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contributions')
        .select(`
          id,
          amount,
          created_at,
          transaction_id,
          profiles(full_name)
        `)
        .eq('group_id', groupId);

      if (error) throw error;
      
      return data.map(contribution => ({
        amount: contribution.amount,
        memberCount: 1,
        contributorName: contribution.profiles?.full_name || 'Unknown',
        date: contribution.created_at
      })) || [];
    },
  });

  if (groupLoading || membersLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-muted-foreground">Group not found</p>
      </div>
    );
  }

  const isAdmin = memberRole === 'admin';
  const isTreasurer = memberRole === 'treasurer';

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <GroupAgenda />
      <DashboardStats />
      
      <Tabs defaultValue="contributions" className="w-full">
        <TabsList className="grid grid-cols-3 lg:w-[400px] mb-6">
          <TabsTrigger value="contributions">Contributions</TabsTrigger>
          <TabsTrigger value="messaging">Messaging</TabsTrigger>
          <TabsTrigger value="management">Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="contributions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <ContributionForm />
              <ContributionsList />
            </div>
            
            <div className="space-y-8">
              <MemberLeaderboard />
              <GroupManagement
                groupId={group.id}
                isAdmin={isAdmin}
                isTreasurer={isTreasurer}
                targetAmount={group.target_amount}
                endDate={group.end_date}
                contributions={contributions || []}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="messaging">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <MessageList groupId={group.id} />
            </div>
            
            <div className="space-y-8">
              <AssignRoles 
                groupId={group.id} 
                isAdmin={isAdmin} 
                members={members || []} 
                onMembersUpdated={refetchMembers}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="management">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <TaskManagement 
                groupId={group.id} 
                isAdmin={isAdmin} 
                isTreasurer={isTreasurer} 
                members={members || []}
              />
            </div>
            
            <div className="space-y-8">
              <GroupManagement
                groupId={group.id}
                isAdmin={isAdmin}
                isTreasurer={isTreasurer}
                targetAmount={group.target_amount}
                endDate={group.end_date}
                contributions={contributions || []}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
