
import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Calendar, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function ContributionStreak() {
  const { user } = useAuth();

  const { data: streakData, isLoading } = useQuery({
    queryKey: ['contributionStreak', user?.id],
    queryFn: async () => {
      if (!user?.id) return { currentStreak: 0, longestStreak: 0 };

      // Get user's contributions ordered by date
      const { data: contributions, error } = await supabase
        .from('contributions')
        .select('created_at')
        .eq('contributor_id', user.id)
        .eq('status', 'confirmed')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching contributions for streak:', error);
        return { currentStreak: 0, longestStreak: 0 };
      }

      if (!contributions || contributions.length === 0) {
        return { currentStreak: 0, longestStreak: 0 };
      }

      // Calculate streaks
      const dates = contributions.map(c => new Date(c.created_at).toDateString());
      const uniqueDates = [...new Set(dates)].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 1;

      // Calculate current streak (from most recent date backwards)
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();

      if (uniqueDates[0] === today || uniqueDates[0] === yesterday) {
        currentStreak = 1;
        
        for (let i = 1; i < uniqueDates.length; i++) {
          const prevDate = new Date(uniqueDates[i - 1]);
          const currDate = new Date(uniqueDates[i]);
          const diffDays = Math.floor((prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24));
          
          if (diffDays === 1) {
            currentStreak++;
          } else {
            break;
          }
        }
      }

      // Calculate longest streak
      for (let i = 1; i < uniqueDates.length; i++) {
        const prevDate = new Date(uniqueDates[i - 1]);
        const currDate = new Date(uniqueDates[i]);
        const diffDays = Math.floor((prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }
      longestStreak = Math.max(longestStreak, tempStreak);

      return { currentStreak, longestStreak };
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const currentStreak = streakData?.currentStreak || 0;
  const longestStreak = streakData?.longestStreak || 0;
  const nextMilestone = Math.ceil((currentStreak + 1) / 5) * 5; // Next multiple of 5
  
  const streakProgress = nextMilestone > 0 ? (currentStreak / nextMilestone) * 100 : 0;

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <Calendar className="w-6 h-6 text-orange-500" />
            <h3 className="text-xl font-semibold">Contribution Streak</h3>
          </div>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <Calendar className="w-6 h-6 text-orange-500" />
          <h3 className="text-xl font-semibold">Contribution Streak</h3>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-3xl font-bold text-orange-600">{currentStreak}</div>
            <div className="text-sm text-gray-600">Current Streak</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-3xl font-bold text-purple-600">{longestStreak}</div>
            <div className="text-sm text-gray-600">Longest Streak</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Next Milestone: {nextMilestone} days</span>
            <span>{currentStreak}/{nextMilestone}</span>
          </div>
          <Progress value={streakProgress} className="h-2" />
        </div>

        <div className="text-sm text-gray-600">
          {currentStreak > 0 ? (
            <>🔥 Great job! Keep your streak alive by contributing within the next 24 hours.</>
          ) : (
            <>📅 Start contributing regularly to build your contribution streak!</>
          )}
        </div>
      </div>
    </Card>
  );
}
