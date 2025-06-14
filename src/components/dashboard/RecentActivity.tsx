
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface Activity {
  id: string;
  type: 'contribution' | 'member_joined' | 'group_created' | 'payment';
  user: {
    name: string;
    avatar?: string;
  };
  description: string;
  amount?: number;
  timestamp: Date;
  groupName?: string;
}

export function RecentActivity() {
  const activities: Activity[] = [
    {
      id: '1',
      type: 'contribution',
      user: { name: 'John Doe' },
      description: 'made a contribution',
      amount: 5000,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      groupName: 'Family Savings',
    },
    {
      id: '2',
      type: 'member_joined',
      user: { name: 'Sarah Wilson' },
      description: 'joined the group',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      groupName: 'Office Chama',
    },
    {
      id: '3',
      type: 'group_created',
      user: { name: 'Mike Johnson' },
      description: 'created a new group',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      groupName: 'Emergency Fund',
    },
  ];

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'contribution':
        return '💰';
      case 'member_joined':
        return '👋';
      case 'group_created':
        return '🎯';
      case 'payment':
        return '💸';
      default:
        return '📝';
    }
  };

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'contribution':
        return 'bg-green-100 text-green-800';
      case 'member_joined':
        return 'bg-blue-100 text-blue-800';
      case 'group_created':
        return 'bg-purple-100 text-purple-800';
      case 'payment':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={activity.user.avatar} />
              <AvatarFallback>
                {activity.user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{getActivityIcon(activity.type)}</span>
                <span className="font-medium text-sm">{activity.user.name}</span>
                <span className="text-sm text-muted-foreground">
                  {activity.description}
                </span>
                {activity.amount && (
                  <Badge variant="secondary">
                    KES {activity.amount.toLocaleString()}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {activity.groupName && (
                  <Badge className={getActivityColor(activity.type)}>
                    {activity.groupName}
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
