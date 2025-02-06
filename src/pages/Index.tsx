
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
import { MainContent } from "@/components/dashboard/MainContent";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Header } from "@/components/layout/Header";

export default function Index() {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  // Basic groups query without inner join to test if user can access their groups
  const { data: groups, isLoading: groupsLoading, error: groupsError } = useQuery({
    queryKey: ['userGroups', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.log("No user ID available");
        return null;
      }

      try {
        // First, get groups the user is a member of
        const { data: memberGroups, error: memberError } = await supabase
          .from('group_members')
          .select('group_id, role')
          .eq('member_id', user.id);

        if (memberError) {
          console.error('Error fetching group memberships:', memberError);
          throw memberError;
        }

        if (!memberGroups?.length) {
          console.log('User has no group memberships');
          return [];
        }

        // Then get the actual group data
        const groupIds = memberGroups.map(mg => mg.group_id);
        const { data: groupsData, error: groupsError } = await supabase
          .from('groups')
          .select(`
            *,
            contributions(
              amount,
              transaction_id,
              created_at,
              profiles(full_name)
            )
          `)
          .in('id', groupIds);

        if (groupsError) {
          console.error('Error fetching groups data:', groupsError);
          throw groupsError;
        }

        // Combine group data with member roles
        const groupsWithRoles = groupsData.map(group => ({
          ...group,
          role: memberGroups.find(mg => mg.group_id === group.id)?.role
        }));

        console.log('Successfully fetched groups:', groupsWithRoles);
        return groupsWithRoles;
      } catch (error) {
        console.error('Error in groups query:', error);
        throw error;
      }
    },
    enabled: !!user?.id,
    staleTime: 30000,
    retry: 1
  });

  useEffect(() => {
    if (!authLoading && !user) {
      console.log("No authenticated user, redirecting to auth");
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null; // useEffect will handle redirect
  }

  if (groupsError) {
    console.error("Groups query error:", groupsError);
    toast({
      title: "Error Loading Data",
      description: "There was a problem loading your groups. Please try again.",
      variant: "destructive",
    });
  }

  if (groupsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 px-4">
        <Header />
        <DashboardHeader />
        
        {groups && groups.length > 0 ? (
          <div className="grid lg:grid-cols-12 gap-8">
            <MainContent />
            <Sidebar />
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
    </DashboardLayout>
  );
}
