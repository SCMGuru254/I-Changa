
import { InsightsDashboard } from "@/components/insights/InsightsDashboard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Header } from "@/components/layout/Header";

export default function InsightsPage() {
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <Header />
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary">Analytics & Insights</h1>
          <p className="text-muted-foreground mt-2">
            Track your contribution patterns and group performance
          </p>
        </div>
        <InsightsDashboard />
      </div>
    </DashboardLayout>
  );
}
