
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

  useEffect(() => {
    if (!authLoading && !user) {
      console.log("No authenticated user, redirecting to auth");
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const { data: groups, isLoading: groupsLoading, error: groupsError } = useQuery({
    queryKey: ['userGroups', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.log("Query aborted - no user ID");
        return null;
      }

      try {
        console.log("Fetching groups for user:", user.id);
        const { data: memberGroups, error: memberError } = await supabase
          .from('group_members')
          .select('group_id')
          .eq('member_id', user.id);

        if (memberError) {
          console.error('Member groups error:', memberError);
          throw memberError;
        }

        if (!memberGroups?.length) {
          console.log('No group memberships found');
          return [];
        }

        const groupIds = memberGroups.map(mg => mg.group_id);
        const { data: groupsData, error: groupsError } = await supabase
          .from('groups')
          .select('*')
          .in('id', groupIds);

        if (groupsError) {
          console.error('Groups data error:', groupsError);
          throw groupsError;
        }

        console.log('Groups fetched successfully:', groupsData);
        return groupsData;
      } catch (error) {
        console.error('Groups query error:', error);
        throw error;
      }
    },
    enabled: !!user?.id && !authLoading,
    retry: 1
  });

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

  if (groupsError) {
    console.error("Groups error:", groupsError);
    toast({
      title: "Error Loading Groups",
      description: "There was a problem loading your groups. Please try again.",
      variant: "destructive",
    });
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 px-4">
        <Header />
        <DashboardHeader />
        
        {groupsLoading ? (
          <div className="flex items-center justify-center h-[200px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : groups && groups.length > 0 ? (
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
