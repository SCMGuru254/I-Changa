
import { SystemStatus } from "./SystemStatus";
import { QuickActions } from "./QuickActions";
import { GroupAgenda } from "../GroupAgenda";
import { DashboardStats } from "../DashboardStats";
import { GroupsList } from "./GroupsList";
import { ContributionsList } from "../ContributionsList";
import { GamificationDashboard } from '../gamification/GamificationDashboard';
import { NotificationCenter } from "./NotificationCenter";
import { RecentActivity } from "./RecentActivity";

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentActivity />
        <NotificationCenter />
      </div>
      <GroupsList />
      
      <div>
        <h2 className="text-2xl font-semibold mb-4">Recent Contributions</h2>
        <ContributionsList />
      </div>
    </div>
  );
}
