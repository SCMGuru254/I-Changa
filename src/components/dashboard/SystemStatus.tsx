import { CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

export function SystemStatus() {
  return (
    <Card className="p-6 mb-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
      <h2 className="text-lg font-semibold mb-4">System Status</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span>Authentication: Active</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span>Database: Connected</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span>UI Components: Loaded</span>
        </div>
      </div>
    </Card>
  );
}