
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Award, Target, Zap, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { EmptyState } from '@/components/ui/empty-state';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string | null;
  points: number;
  isUnlocked: boolean;
  earned_at?: string;
}

export function AchievementSystem() {
  const { user } = useAuth();

  // Fetch achievements and user's earned achievements
  const { data: achievementsData, isLoading } = useQuery({
    queryKey: ['achievements', user?.id],
    queryFn: async () => {
      if (!user?.id) return { achievements: [], userAchievements: [], totalPoints: 0 };

      // Fetch all achievements
      const { data: achievements, error: achievementsError } = await supabase
        .from('achievements')
        .select('*')
        .order('points', { ascending: false });

      if (achievementsError) {
        console.error('Error fetching achievements:', achievementsError);
        return { achievements: [], userAchievements: [], totalPoints: 0 };
      }

      // Fetch user's earned achievements
      const { data: userAchievements, error: userAchievementsError } = await supabase
        .from('user_achievements')
        .select(`
          *,
          achievements(*)
        `)
        .eq('user_id', user.id);

      if (userAchievementsError) {
        console.error('Error fetching user achievements:', userAchievementsError);
        return { achievements: achievements || [], userAchievements: [], totalPoints: 0 };
      }

      // Calculate total points
      const totalPoints = (userAchievements || []).reduce((sum, ua) => 
        sum + (ua.achievements?.points || 0), 0
      );

      // Map achievements with unlock status
      const achievementsWithStatus = (achievements || []).map(achievement => ({
        ...achievement,
        isUnlocked: (userAchievements || []).some(ua => ua.achievement_id === achievement.id),
        earned_at: (userAchievements || []).find(ua => ua.achievement_id === achievement.id)?.earned_at
      }));

      return {
        achievements: achievementsWithStatus,
        userAchievements: userAchievements || [],
        totalPoints
      };
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const getIconComponent = (iconText: string | null) => {
    // For now, we'll use predefined icons based on the achievement name
    if (!iconText) return <Trophy className="w-6 h-6 text-yellow-500" />;
    
    switch (iconText) {
      case '🎯':
        return <Target className="w-6 h-6 text-green-500" />;
      case '👥':
        return <Star className="w-6 h-6 text-blue-500" />;
      case '🔥':
        return <Zap className="w-6 h-6 text-orange-500" />;
      case '🏆':
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case '✋':
        return <Award className="w-6 h-6 text-purple-500" />;
      default:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Your Achievements</h3>
            <div className="flex items-center space-x-2">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          </div>
        </div>
      </Card>
    );
  }

  const { achievements = [], totalPoints = 0 } = achievementsData || {};

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Your Achievements</h3>
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="font-bold">{totalPoints} Points</span>
          </div>
        </div>
        
        {achievements.length === 0 ? (
          <EmptyState
            icon={<Trophy className="h-8 w-8" />}
            title="No Achievements Yet"
            description="Start contributing to groups and completing tasks to earn your first achievements!"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`flex items-center space-x-4 p-4 rounded-lg border ${
                  achievement.isUnlocked
                    ? 'bg-gradient-to-r from-green-50 to-blue-50 border-green-200'
                    : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                {getIconComponent(achievement.icon)}
                <div className="flex-1">
                  <h4 className="font-semibold">{achievement.name}</h4>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                  {achievement.isUnlocked && achievement.earned_at && (
                    <p className="text-xs text-green-600 mt-1">
                      Earned {new Date(achievement.earned_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end">
                  <Badge variant={achievement.isUnlocked ? 'default' : 'secondary'}>
                    {achievement.points} pts
                  </Badge>
                  {achievement.isUnlocked && (
                    <span className="text-xs text-green-600 mt-1">Unlocked!</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
