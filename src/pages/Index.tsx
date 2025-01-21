import { ContributionForm } from "@/components/ContributionForm";
import { ContributionsList } from "@/components/ContributionsList";
import { DashboardStats } from "@/components/DashboardStats";

const Index = () => {
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <h2 className="text-xl font-semibold mb-4 text-primary">New Contribution</h2>
              <ContributionForm />
            </div>

            <div className="md:col-span-2">
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