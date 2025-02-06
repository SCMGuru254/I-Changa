
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

  const { data: memberGroups, isLoading: membershipLoading } = useQuery({
    queryKey: ['userGroupMemberships', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('group_members')
        .select('group_id')
        .eq('member_id', user.id);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  const { data: groups, isLoading: groupsLoading } = useQuery({
    queryKey: ['groups', memberGroups],
    queryFn: async () => {
      if (!memberGroups?.length) return [];
      const groupIds = memberGroups.map(mg => mg.group_id);
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .in('id', groupIds);

      if (error) throw error;
      return data || [];
    },
    enabled: !!memberGroups?.length,
  });

  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const isLoading = membershipLoading || groupsLoading;

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 px-4">
        <Header />
        <DashboardHeader />
        
        {isLoading ? (
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
