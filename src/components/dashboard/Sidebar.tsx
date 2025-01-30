import { MemberLeaderboard } from "../MemberLeaderboard";
import { ContributionForm } from "../ContributionForm";

export function Sidebar() {
  return (
    <div className="lg:col-span-4 space-y-8">
      <MemberLeaderboard />
      <div>
        <h2 className="text-2xl font-semibold mb-4">Quick Contribution</h2>
        <ContributionForm />
      </div>
    </div>
  );
}