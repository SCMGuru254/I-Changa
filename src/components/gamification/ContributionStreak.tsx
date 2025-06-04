import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Calendar } from 'lucide-react';

export function ContributionStreak() {
  const currentStreak = 5; // This would come from actual data
  const longestStreak = 12; // This would come from actual data
  const nextMilestone = 10;
  
  const streakProgress = (currentStreak / nextMilestone) * 100;

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
          🔥 Keep your streak alive! Contribute within the next 24 hours to maintain your progress.
        </div>
      </div>
    </Card>
  );
}
