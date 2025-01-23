import { useEffect } from "react";
import { ContributionForm } from "@/components/ContributionForm";
import { ContributionsList } from "@/components/ContributionsList";
import { DashboardStats } from "@/components/DashboardStats";
import { ContributionCalendar } from "@/components/ContributionCalendar";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();

  useEffect(() => {
    // Anti-screenshot measures
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

      // Disable right-click
      document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        toast({
          title: "Action Prevented",
          description: "Right-click is disabled for security reasons.",
          variant: "destructive",
        });
      });
    };

    preventScreenCapture();
  }, [toast]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="container py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary mb-2">
              iChanga
            </h1>
            <p className="text-gray-600">
              Simplified Group Contributions with M-Pesa Integration
            </p>
          </div>

          <DashboardStats />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-4">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-primary">New Contribution</h2>
                  <ContributionForm />
                </div>
                <div>
                  <ContributionCalendar />
                </div>
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