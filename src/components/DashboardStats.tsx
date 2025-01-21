import { Card } from "@/components/ui/card";

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card className="p-6">
        <h3 className="text-sm font-medium text-gray-500">Total Contributions</h3>
        <p className="text-2xl font-bold text-secondary">KES 45,000</p>
        <p className="text-sm text-gray-500">From 12 contributors</p>
      </Card>
      
      <Card className="p-6">
        <h3 className="text-sm font-medium text-gray-500">This Month</h3>
        <p className="text-2xl font-bold text-primary">KES 15,000</p>
        <p className="text-sm text-gray-500">5 new contributions</p>
      </Card>
      
      <Card className="p-6">
        <h3 className="text-sm font-medium text-gray-500">Target Progress</h3>
        <p className="text-2xl font-bold text-accent">45%</p>
        <p className="text-sm text-gray-500">Target: KES 100,000</p>
      </Card>
    </div>
  );
}