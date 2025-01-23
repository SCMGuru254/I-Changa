import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Users, Target } from "lucide-react";

export function DashboardStats() {
  // In a real app, these would come from your backend
  const stats = {
    totalContributions: 45000,
    contributorsCount: 12,
    monthlyContributions: 15000,
    monthlyContributors: 5,
    targetAmount: 100000,
    progressPercentage: 45
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card className="p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Total Contributions</h3>
            <p className="text-2xl font-bold text-secondary">KES {stats.totalContributions.toLocaleString()}</p>
            <p className="text-sm text-gray-500">From {stats.contributorsCount} contributors</p>
          </div>
          <TrendingUp className="text-secondary h-8 w-8" />
        </div>
      </Card>
      
      <Card className="p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-500">This Month</h3>
            <p className="text-2xl font-bold text-primary">KES {stats.monthlyContributions.toLocaleString()}</p>
            <p className="text-sm text-gray-500">{stats.monthlyContributors} new contributions</p>
          </div>
          <Users className="text-primary h-8 w-8" />
        </div>
      </Card>
      
      <Card className="p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Target Progress</h3>
            <p className="text-2xl font-bold text-accent">{stats.progressPercentage}%</p>
            <p className="text-sm text-gray-500">Target: KES {stats.targetAmount.toLocaleString()}</p>
          </div>
          <Target className="text-accent h-8 w-8" />
        </div>
        <Progress value={stats.progressPercentage} className="h-2" />
      </Card>
    </div>
  );
}