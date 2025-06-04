import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Award, Target, Zap } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  points: number;
  isUnlocked: boolean;
}

export function AchievementSystem() {
  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'Early Bird',
      description: 'First to contribute this month',
      icon: <Trophy className="w-6 h-6 text-yellow-500" />,
      points: 100,
      isUnlocked: true,
    },
    {
      id: '2',
      title: 'Consistency King',
      description: 'Contributed for 3 months straight',
      icon: <Star className="w-6 h-6 text-blue-500" />,
      points: 300,
      isUnlocked: false,
    },
    {
      id: '3',
      title: 'Group Champion',
      description: 'Highest contributor in the group',
      icon: <Award className="w-6 h-6 text-purple-500" />,
      points: 500,
      isUnlocked: false,
    },
    {
      id: '4',
      title: 'Goal Setter',
      description: 'Reached group target ahead of schedule',
      icon: <Target className="w-6 h-6 text-green-500" />,
      points: 200,
      isUnlocked: false,
    },
    {
      id: '5',
      title: 'Quick Response',
      description: 'Contributed within 24h of reminder',
      icon: <Zap className="w-6 h-6 text-orange-500" />,
      points: 150,
      isUnlocked: true,
    },
  ];

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Your Achievements</h3>
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="font-bold">250 Points</span>
          </div>
        </div>
        
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
              {achievement.icon}
              <div className="flex-1">
                <h4 className="font-semibold">{achievement.title}</h4>
                <p className="text-sm text-gray-600">{achievement.description}</p>
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
      </div>
    </Card>
  );
}
