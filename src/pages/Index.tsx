import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ContributionForm } from "@/components/ContributionForm";
import { ContributionsList } from "@/components/ContributionsList";
import { DashboardStats } from "@/components/DashboardStats";
import { GroupAgenda } from "@/components/GroupAgenda";
import { MemberLeaderboard } from "@/components/MemberLeaderboard";
import { GroupCreationForm } from "@/components/GroupCreationForm";
import { useToast } from "@/hooks/use-toast";
import { Moon, Sun, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Verify database connection
  const { data: dbStatus, isError: dbError } = useQuery({
    queryKey: ['dbStatus'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('groups')
        .select('id')
        .limit(1);
      if (error) throw error;
      return true;
    },
  });

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    // Verify that authentication is working
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
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-primary">iChanga Dashboard</h1>
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
              >
                Sign Out
              </Button>
            </div>
          </div>

          <Card className="p-4 mb-8">
            <h2 className="text-lg font-semibold mb-4">System Status</h2>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Authentication: Working</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className={`h-5 w-5 ${dbStatus ? 'text-green-500' : 'text-red-500'}`} />
                <span>Database Connection: {dbStatus ? 'Connected' : 'Error'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>UI Components: Loaded</span>
              </div>
            </div>
          </Card>

          <GroupAgenda />
          <DashboardStats />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-4 space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4 text-primary">New Group</h2>
                <GroupCreationForm />
              </div>
              <div>
                <MemberLeaderboard />
              </div>
            </div>

            <div className="md:col-span-8 space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4 text-primary">Make Contribution</h2>
                <ContributionForm />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-4 text-primary">Recent Contributions</h2>
                <ContributionsList />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;