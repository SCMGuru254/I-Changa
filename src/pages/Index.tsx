
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { DashboardStats } from "@/components/DashboardStats";
import { GroupDetails } from "@/components/GroupDetails";
import { MembersList } from "@/components/MembersList";
import { ContributionsTable } from "@/components/ContributionsTable";
import { EmptyGroupState } from "@/components/EmptyGroupState";
import { OfflineDetection } from "@/components/OfflineDetection";

export default function Index() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: groups, isLoading: groupsLoading } = useQuery({
    queryKey: ['userGroups'],
    queryFn: async () => {
      try {
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
          .eq('group_members.member_id', user?.id);

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error("Error fetching groups:", error);
        return [];
      }
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 60 * 60 * 1000, // 1 hour (cache persists longer for offline usage)
    retry: 3,
  });

  const { data: groupMembers, isLoading: membersLoading } = useQuery({
    queryKey: ['groupMembers', groups?.[0]?.id],
    queryFn: async () => {
      try {
        if (!groups?.[0]?.id) return [];
        const { data, error } = await supabase
          .from('group_members')
          .select(`
            *,
            profiles(full_name, phone_number)
          `)
          .eq('group_id', groups[0].id);

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error("Error fetching group members:", error);
        return [];
      }
    },
    enabled: !!groups?.[0]?.id,
    staleTime: 5 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    retry: 3,
  });

  if (groupsLoading || membersLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const currentGroup = groups?.[0];
  const isAdmin = currentGroup?.group_members?.[0]?.role === 'admin';

  return (
    <div className="container mx-auto py-8 px-4">
      <OfflineDetection />
      <DashboardHeader />
      
      <DashboardStats />
      
      {currentGroup ? (
        <div className="space-y-8">
          <GroupDetails group={currentGroup} isAdmin={isAdmin} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <MembersList 
              groupMembers={groupMembers || []} 
              isAdmin={isAdmin} 
              groupId={currentGroup.id} 
            />

            <ContributionsTable 
              contributions={currentGroup.contributions || []} 
            />
          </div>
        </div>
      ) : (
        <EmptyGroupState />
      )}
    </div>
  );
}
