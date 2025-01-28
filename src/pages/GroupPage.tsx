import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GroupAgenda } from "@/components/GroupAgenda";
import { ContributionForm } from "@/components/ContributionForm";
import { ContributionsList } from "@/components/ContributionsList";
import { DashboardStats } from "@/components/DashboardStats";
import { MemberLeaderboard } from "@/components/MemberLeaderboard";
import { GroupManagement } from "@/components/GroupManagement";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

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

  if (groupLoading) {
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
            contributions={[]} // This will be populated from the ContributionsList data
          />
        </div>
      </div>
    </div>
  );
}