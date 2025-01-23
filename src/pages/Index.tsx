import { useEffect } from "react";
import { ContributionForm } from "@/components/ContributionForm";
import { ContributionsList } from "@/components/ContributionsList";
import { DashboardStats } from "@/components/DashboardStats";
import { ContributionCalendar } from "@/components/ContributionCalendar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();

  useEffect(() => {
    // Anti-screenshot measures
    const preventScreenCapture = () => {
      // Disable keyboard shortcuts
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

      // Add visual watermark
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
  }, [toast]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="container py-8">
        <div className="max-w-6xl mx-auto">
          <DashboardHeader />
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