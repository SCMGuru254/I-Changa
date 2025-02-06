
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

  console.log("Auth state:", { user, authLoading }); // Debug auth state

  const { data: groups, isLoading: groupsLoading, error: groupsError } = useQuery({
    queryKey: ['userGroups', user?.id],
    queryFn: async () => {
      console.log("Fetching groups for user:", user?.id); // Debug query execution
      
      if (!user?.id) {
        console.log("No user ID available"); // Debug user state
        return null;
      }
      
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
          .eq('group_members.member_id', user.id);

        if (error) {
          console.error('Supabase error:', error); // Debug database errors
          throw error;
        }

        console.log("Groups data received:", data); // Debug successful data
        return data;
      } catch (error) {
        console.error('Error in groups query:', error); // Debug catch block
        throw error;
      }
    },
    enabled: !!user?.id,
    staleTime: 30000,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  useEffect(() => {
    console.log("Component mounted, auth state:", { user, authLoading }); // Debug component lifecycle
  }, [user, authLoading]);

  if (groupsError) {
    console.error("Groups query error:", groupsError); // Debug query errors
    toast({
      title: "Error Loading Data",
      description: "There was a problem loading your groups. Please try again.",
      variant: "destructive",
    });
  }

  if (authLoading || !user) {
    console.log("Showing auth loading state"); // Debug loading state
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (groupsLoading) {
    console.log("Showing groups loading state"); // Debug loading state
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  console.log("Rendering dashboard with groups:", groups); // Debug final render

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
