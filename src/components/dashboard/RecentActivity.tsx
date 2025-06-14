
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, TrendingUp, Users, Plus } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

interface ActivityItem {
  id: string;
  type: 'contribution' | 'member_joined' | 'group_created';
  message: string;
  timestamp: string;
  amount?: number;
}

export function RecentActivity() {
  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'contribution',
      message: 'Sarah contributed to Family Savings',
      timestamp: '2 hours ago',
      amount: 5000,
    },
    {
      id: '2',
      type: 'member_joined',
      message: 'Mike joined Office Lunch Fund',
      timestamp: '5 hours ago',
    },
    {
      id: '3',
      type: 'group_created',
      message: 'Created new group: Weekend Trip',
      timestamp: '1 day ago',
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'contribution':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'member_joined':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'group_created':
        return <Plus className="h-4 w-4 text-purple-500" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'contribution':
        return 'default';
      case 'member_joined':
        return 'secondary';
      case 'group_created':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Recent Activity</h3>
      </div>

      {activities.length === 0 ? (
        <EmptyState
          icon={<Activity className="h-8 w-8" />}
          title="No Recent Activity"
          description="Your group activities will appear here once members start contributing and interacting."
        />
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
              <div className="mt-1">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{activity.message}</p>
                {activity.amount && (
                  <p className="text-sm text-green-600 font-semibold">
                    +KES {activity.amount.toLocaleString()}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {activity.timestamp}
                </p>
              </div>
              <Badge variant={getBadgeVariant(activity.type)}>
                {activity.type.replace('_', ' ')}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
