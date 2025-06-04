import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Award, Medal } from 'lucide-react';

interface Member {
  id: string;
  name: string;
  points: number;
  streak: number;
  rank: number;
  avatar: string;
}

export function RewardsLeaderboard() {
  const members: Member[] = [
    {
      id: '1',
      name: 'John Doe',
      points: 1200,
      streak: 8,
      rank: 1,
      avatar: '/placeholder.svg',
    },
    {
      id: '2',
      name: 'Jane Smith',
      points: 950,
      streak: 5,
      rank: 2,
      avatar: '/placeholder.svg',
    },
    {
      id: '3',
      name: 'Mike Johnson',
      points: 800,
      streak: 4,
      rank: 3,
      avatar: '/placeholder.svg',
    },
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Award className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return null;
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-6">Top Contributors</h3>
      <div className="space-y-4">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center space-x-4 p-4 rounded-lg bg-gradient-to-r from-white to-gray-50 border"
          >
            <div className="flex-shrink-0">
              {getRankIcon(member.rank)}
            </div>
            <img
              src={member.avatar}
              alt={member.name}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <h4 className="font-semibold">{member.name}</h4>
              <div className="flex space-x-2 text-sm text-gray-600">
                <span>{member.points} points</span>
                <span>•</span>
                <span>{member.streak} day streak</span>
              </div>
            </div>
            <Badge variant="default" className="ml-2">
              #{member.rank}
            </Badge>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
        <h4 className="font-semibold mb-2">Monthly Rewards</h4>
        <ul className="text-sm space-y-2">
          <li className="flex items-center space-x-2">
            <Crown className="w-4 h-4 text-yellow-500" />
            <span>1st Place: Free Month Subscription</span>
          </li>
          <li className="flex items-center space-x-2">
            <Award className="w-4 h-4 text-gray-400" />
            <span>2nd Place: 50% Off Next Month</span>
          </li>
          <li className="flex items-center space-x-2">
            <Medal className="w-4 h-4 text-amber-600" />
            <span>3rd Place: 25% Off Next Month</span>
          </li>
        </ul>
      </div>
    </Card>
  );
}
