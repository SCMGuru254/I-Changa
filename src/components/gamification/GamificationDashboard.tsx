import React from 'react';
import { AchievementSystem } from './AchievementSystem';
import { ContributionStreak } from './ContributionStreak';
import { RewardsLeaderboard } from './RewardsLeaderboard';

export function GamificationDashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Your Progress</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ContributionStreak />
        <RewardsLeaderboard />
      </div>
      
      <AchievementSystem />
      
      <div className="p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">💡 Pro Tips</h3>
        <ul className="text-sm space-y-2">
          <li>• Contribute early in the month to earn the Early Bird badge</li>
          <li>• Maintain your streak by contributing regularly</li>
          <li>• Complete achievements to earn bonus points</li>
          <li>• Rise through the ranks to unlock special rewards</li>
        </ul>
      </div>
    </div>
  );
}
