
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, TrendingUp, Users, Plus } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { Activity as ActivityType, ActivityMetadata } from "@/types";

export function RecentActivity() {
  const { user } = useAuth();

  const { data: activities = [], isLoading } = useQuery({
    queryKey: ['recentActivities', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('activities')
        .select(`
          *,
          groups(name)
        `)
        .or(`user_id.eq.${user.id},group_id.in.(${await getUserGroupIds()})`)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching activities:', error);
        return [];
      }

      return data || [];
    },
    enabled: !!user?.id,
    staleTime: 30 * 1000, // 30 seconds
  });

  const getUserGroupIds = async () => {
    const { data } = await supabase
      .from('group_members')
      .select('group_id')
      .eq('member_id', user?.id);
    
    return data?.map(g => g.group_id).join(',') || '';
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'contribution':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'member_joined':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'group_created':
        return <Plus className="h-4 w-4 text-purple-500" />;
      case 'task_completed':
        return <Activity className="h-4 w-4 text-orange-500" />;
      case 'message_sent':
        return <Activity className="h-4 w-4 text-cyan-500" />;
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

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return '1 day ago';
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  // Helper function to safely parse metadata
  const parseMetadata = (metadata: any): ActivityMetadata => {
    if (!metadata) return {};
    if (typeof metadata === 'string') {
      try {
        return JSON.parse(metadata);
      } catch {
        return {};
      }
    }
    return metadata as ActivityMetadata;
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Recent Activity</h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      </Card>
    );
  }

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
          {activities.map((activity) => {
            const metadata = parseMetadata(activity.metadata);
            return (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                <div className="mt-1">
                  {getActivityIcon(activity.activity_type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{activity.title}</p>
                  {activity.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {activity.description}
                    </p>
                  )}
                  {metadata.amount && (
                    <p className="text-sm text-green-600 font-semibold">
                      +KES {metadata.amount.toLocaleString()}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatTimestamp(activity.created_at)}
                  </p>
                </div>
                <Badge variant={getBadgeVariant(activity.activity_type)}>
                  {activity.activity_type.replace('_', ' ')}
                </Badge>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
