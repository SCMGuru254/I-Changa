import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ContributionForm } from "@/components/ContributionForm";
import { ContributionsList } from "@/components/ContributionsList";
import { DashboardStats } from "@/components/DashboardStats";
import { ContributionCalendar } from "@/components/ContributionCalendar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { GroupAgenda } from "@/components/GroupAgenda";
import { MemberLeaderboard } from "@/components/MemberLeaderboard";
import { OwnerWallet } from "@/components/OwnerWallet";
import { useToast } from "@/hooks/use-toast";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const userRole: 'owner' | 'admin' | 'treasurer' | 'member' = 'owner';

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }

    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    const preventScreenCapture = () => {
      document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 's')) {
          e.preventDefault();
          toast({
            title: "Action Prevented",
            description: "Printing and saving of this page is disabled for security reasons.",
            variant: "destructive",
          });
        }
      });

      document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        toast({
          title: "Action Prevented",
          description: "Right-click is disabled for security reasons.",
          variant: "destructive",
        });
      });

      const watermark = document.createElement('div');
      watermark.style.position = 'fixed';
      watermark.style.top = '50%';
      watermark.style.left = '50%';
      watermark.style.transform = 'translate(-50%, -50%) rotate(-45deg)';
      watermark.style.fontSize = '24px';
      watermark.style.color = 'rgba(128, 128, 128, 0.1)';
      watermark.style.pointerEvents = 'none';
      watermark.style.userSelect = 'none';
      watermark.style.zIndex = '9999';
      watermark.textContent = 'iChanga - Secure Platform';
      document.body.appendChild(watermark);
    };

    preventScreenCapture();
  }, [toast, navigate, user]);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800 dark:text-white transition-colors duration-200">
      <div className="container py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <DashboardHeader />
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
          
          {user?.email === "olivedataetsula@gmail.com" && (
            <div className="mb-8">
              <OwnerDashboard />
            </div>
          )}

          <GroupAgenda />
          <DashboardStats />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-4 space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4 text-primary">New Group</h2>
                <GroupCreationForm />
              </div>
              <div>
                <ContributionCalendar />
              </div>
              <div>
                <MemberLeaderboard />
              </div>
            </div>

            <div className="md:col-span-8">
              <h2 className="text-xl font-semibold mb-4 text-primary">Recent Contributions</h2>
              <ContributionsList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
