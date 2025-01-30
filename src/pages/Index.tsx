import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ContributionForm } from "@/components/ContributionForm";
import { ContributionsList } from "@/components/ContributionsList";
import { DashboardStats } from "@/components/DashboardStats";
import { GroupAgenda } from "@/components/GroupAgenda";
import { MemberLeaderboard } from "@/components/MemberLeaderboard";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/layout/Header";
import { SystemStatus } from "@/components/dashboard/SystemStatus";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { GroupsList } from "@/components/dashboard/GroupsList";

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

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

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800 dark:text-white transition-colors duration-200">
      <div className="container py-8">
        <div className="max-w-7xl mx-auto">
          <Header />
          <SystemStatus />
          <QuickActions />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              <GroupAgenda />
              <DashboardStats />
              <GroupsList />
              
              <div>
                <h2 className="text-2xl font-semibold mb-4">Recent Contributions</h2>
                <ContributionsList />
              </div>
            </div>

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