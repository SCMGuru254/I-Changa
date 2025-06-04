import { SystemStatus } from "./SystemStatus";
import { QuickActions } from "./QuickActions";
import { GroupAgenda } from "../GroupAgenda";
import { DashboardStats } from "../DashboardStats";
import { GroupsList } from "./GroupsList";
import { ContributionsList } from "../ContributionsList";
import { GamificationDashboard } from '../gamification/GamificationDashboard';

export function MainContent() {
  return (
    <div className="lg:col-span-8 space-y-8">
      <SystemStatus />
      <QuickActions />
      <GroupAgenda />
      <div className="space-y-6">
        <DashboardStats />
        <GamificationDashboard />
      </div>
      <GroupsList />
      
      <div>
        <h2 className="text-2xl font-semibold mb-4">Recent Contributions</h2>
        <ContributionsList />
      </div>
    </div>
  );
}