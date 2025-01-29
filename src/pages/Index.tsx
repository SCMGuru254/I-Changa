import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ContributionForm } from "@/components/ContributionForm";
import { ContributionsList } from "@/components/ContributionsList";
import { DashboardStats } from "@/components/DashboardStats";
import { GroupAgenda } from "@/components/GroupAgenda";
import { MemberLeaderboard } from "@/components/MemberLeaderboard";
import { GroupCreationForm } from "@/components/GroupCreationForm";
import { useToast } from "@/hooks/use-toast";
import { Moon, Sun, CheckCircle, LogOut, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Fetch user's groups
  const { data: userGroups, isLoading: groupsLoading } = useQuery({
    queryKey: ['userGroups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('groups')
        .select(`
          id,
          name,
          description,
          target_amount,
          end_date,
          status,
          group_members!inner(role)
        `)
        .eq('group_members.member_id', user?.id);

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    toast({
      title: "Welcome back!",
      description: "You are successfully logged in.",
    });
  }, [user, navigate]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/auth");
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800 dark:text-white transition-colors duration-200">
      <div className="container py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-primary">iChanga Dashboard</h1>
              <p className="text-muted-foreground mt-1">Manage your contribution groups</p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleDarkMode}
                className="rounded-full"
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>

          {/* System Status Card */}
          <Card className="p-6 mb-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
            <h2 className="text-lg font-semibold mb-4">System Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Authentication: Active</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Database: Connected</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>UI Components: Loaded</span>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Sheet>
              <SheetTrigger asChild>
                <Button className="w-full flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create New Group
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Create New Group</SheetTitle>
                  <SheetDescription>
                    Set up a new contribution group and invite members
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  <GroupCreationForm />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-8 space-y-8">
              <GroupAgenda />
              <DashboardStats />
              
              {/* Groups List */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Your Groups</h2>
                {groupsLoading ? (
                  <Card className="p-6">
                    <p className="text-center text-muted-foreground">Loading groups...</p>
                  </Card>
                ) : userGroups?.length ? (
                  <div className="grid gap-4">
                    {userGroups.map((group) => (
                      <Card 
                        key={group.id} 
                        className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => navigate(`/group/${group.id}`)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-semibold">{group.name}</h3>
                            <p className="text-muted-foreground">{group.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">Target: KES {group.target_amount?.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">
                              Ends: {new Date(group.end_date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="p-6">
                    <p className="text-center text-muted-foreground">
                      You haven't joined any groups yet. Create one to get started!
                    </p>
                  </Card>
                )}
              </div>

              {/* Recent Contributions */}
              <div>
                <h2 className="text-2xl font-semibold mb-4">Recent Contributions</h2>
                <ContributionsList />
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-8">
              <MemberLeaderboard />
              <div>
                <h2 className="text-2xl font-semibold mb-4">Quick Contribution</h2>
                <ContributionForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;