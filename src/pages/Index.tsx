
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
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const { data: groups, isLoading: groupsLoading } = useQuery({
    queryKey: ['userGroups', user?.id],
    queryFn: async () => {
      try {
        if (!user?.id) return [];
        
        const { data, error } = await supabase
          .from('groups')
          .select(`
            *,
            group_members!inner(role)
          `)
          .eq('group_members.member_id', user.id);

        if (error) {
          console.error("Groups fetch error:", error);
          toast({
            title: "Error loading groups",
            description: "Please try refreshing the page",
            variant: "destructive",
          });
          return [];
        }

        return data || [];
      } catch (err) {
        console.error("Groups fetch exception:", err);
        toast({
          title: "Error loading groups",
          description: "Please try refreshing the page",
          variant: "destructive",
        });
        return [];
      }
    },
    enabled: Boolean(user?.id),
    staleTime: 5000
  });

  // Show loading state while authenticating
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show login page if no user
  if (!user) {
    return null; // useEffect will handle navigation
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
        ) : Array.isArray(groups) && groups.length > 0 ? (
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
