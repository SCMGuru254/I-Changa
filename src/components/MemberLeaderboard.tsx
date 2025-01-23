import { Card } from "@/components/ui/card";
import { Member } from "@/types";
import { Crown, Trophy, Medal } from "lucide-react";

// Dummy data for demonstration
const dummyMembers: Member[] = [
  {
    id: "1",
    name: "John Doe",
    phoneNumber: "+254712345678",
    role: "admin",
    joinedAt: "2024-01-01",
    totalContributions: 25000,
  },
  {
    id: "2",
    name: "Jane Smith",
    phoneNumber: "+254723456789",
    role: "treasurer",
    joinedAt: "2024-01-15",
    totalContributions: 20000,
  },
  {
    id: "3",
    name: "Alice Johnson",
    phoneNumber: "+254734567890",
    role: "member",
    joinedAt: "2024-02-01",
    totalContributions: 15000,
  },
];

export function MemberLeaderboard() {
  const sortedMembers = [...dummyMembers].sort(
    (a, b) => b.totalContributions - a.totalContributions
  );

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 1:
        return <Trophy className="h-6 w-6 text-gray-400" />;
      case 2:
        return <Medal className="h-6 w-6 text-amber-600" />;
      default:
        return null;
    }
  };

  const getRoleBadgeColor = (role: MemberRole) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "treasurer":
        return "bg-blue-100 text-blue-800";
      case "member":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4 text-primary">Top Contributors</h2>
      <div className="space-y-4">
        {sortedMembers.map((member, index) => (
          <div
            key={member.id}
            className="flex items-center justify-between p-3 bg-background rounded-lg hover:bg-accent/10 transition-colors"
          >
            <div className="flex items-center gap-3">
              {getRankIcon(index)}
              <div>
                <h3 className="font-medium">{member.name}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${getRoleBadgeColor(member.role)}`}>
                  {member.role}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-primary">
                KES {member.totalContributions.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">
                Member since {new Date(member.joinedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}