import { ContributionForm } from "@/components/ContributionForm";
import { ContributionsList } from "@/components/ContributionsList";
import { DashboardStats } from "@/components/DashboardStats";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            M-Pesa Contribution Tracker
          </h1>

          <DashboardStats />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <h2 className="text-xl font-semibold mb-4">New Contribution</h2>
              <ContributionForm />
            </div>

            <div className="md:col-span-2">
              <h2 className="text-xl font-semibold mb-4">Recent Contributions</h2>
              <ContributionsList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;