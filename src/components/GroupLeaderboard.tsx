
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Trophy, Users, Target } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface LeaderboardGroup {
  id: string;
  name: string;
  total_contributions: number;
  member_count: number;
  target_amount: number;
  creator_name: string;
}

export function GroupLeaderboard() {
  const [groups, setGroups] = useState<LeaderboardGroup[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboardData = async () => {
    try {
      console.log('Fetching groups for leaderboard...');
      
      // First get all groups with creator info
      const { data: groupsData, error: groupsError } = await supabase
        .from('groups')
        .select(`
          id,
          name,
          target_amount,
          profiles:creator_id(full_name)
        `)
        .order('created_at', { ascending: false });

      if (groupsError) {
        console.error('Error fetching groups:', groupsError);
        throw groupsError;
      }

      console.log('Groups fetched:', groupsData);

      // Calculate contributions and member count for each group
      const enrichedGroups = await Promise.all(
        (groupsData || []).map(async (group) => {
          // Get total contributions for this group
          const { data: contributions, error: contribError } = await supabase
            .from('contributions')
            .select('amount')
            .eq('group_id', group.id);

          if (contribError) {
            console.error('Error fetching contributions for group', group.id, contribError);
          }

          const totalContributions = contributions?.reduce((sum, contrib) => sum + Number(contrib.amount), 0) || 0;

          // Get member count for this group
          const { count: memberCount, error: memberError } = await supabase
            .from('group_members')
            .select('*', { count: 'exact' })
            .eq('group_id', group.id);

          if (memberError) {
            console.error('Error fetching member count for group', group.id, memberError);
          }

          return {
            id: group.id,
            name: group.name,
            total_contributions: totalContributions,
            member_count: memberCount || 0,
            target_amount: Number(group.target_amount) || 0,
            creator_name: group.profiles?.full_name || 'Unknown'
          };
        })
      );

      // Sort by total contributions (descending)
      const sortedGroups = enrichedGroups.sort((a, b) => b.total_contributions - a.total_contributions);
      
      console.log('Leaderboard data processed:', sortedGroups);
      setGroups(sortedGroups);
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  if (loading) {
    return (
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Group Leaderboard
        </h3>
        <p className="text-center text-muted-foreground py-8">Loading leaderboard...</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Trophy className="h-5 w-5 text-yellow-500" />
        Group Leaderboard
      </h3>
      
      {groups.length === 0 ? (
        <div className="text-center py-8">
          <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No groups found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map((group, index) => {
            const progressPercentage = group.target_amount > 0 
              ? Math.min((group.total_contributions / group.target_amount) * 100, 100) 
              : 0;
            
            return (
              <div key={group.id} className="flex items-center p-4 rounded-lg border bg-card">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold mr-4">
                  {index + 1}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{group.name}</h4>
                    <span className="text-sm font-bold text-primary">
                      KES {group.total_contributions.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {group.member_count} members
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      Target: KES {group.target_amount.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-muted-foreground">
                      Created by {group.creator_name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {progressPercentage.toFixed(1)}% complete
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
