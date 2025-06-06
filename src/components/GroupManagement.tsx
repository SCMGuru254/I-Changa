
import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LogOut, FileDown } from "lucide-react";
import generatePDF from "react-to-pdf";
import { 
  calculateRevenue, 
  calculateTotalContributed, 
  isTargetReached, 
  formatCurrency 
} from "@/utils/contributionUtils";

interface GroupManagementProps {
  groupId: string;
  isAdmin: boolean;
  isTreasurer: boolean;
  targetAmount: number;
  endDate: string;
  contributions: Array<{
    amount: number;
    memberCount: number;
    contributorName: string;
    date: string;
  }>;
}

export function GroupManagement({ 
  groupId, 
  isAdmin, 
  isTreasurer, 
  targetAmount,
  endDate,
  contributions 
}: GroupManagementProps) {
  const { toast } = useToast();
  const [isLeaving, setIsLeaving] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleLeaveGroup = async () => {
    setIsLeaving(true);
    try {
      // Here you would implement the API call to remove the member from the group
      toast({
        title: "Success",
        description: "You have left the group successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to leave the group. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLeaving(false);
    }
  };

  const handleExportPDF = async () => {
    const totalContributed = calculateTotalContributed(contributions);
    const targetReached = isTargetReached(totalContributed, targetAmount);
    const completed = targetReached || new Date() >= new Date(endDate);

    if (!completed) {
      toast({
        title: "Cannot Export Yet",
        description: "Contributions are still ongoing. Export will be available when target is reached or end date is passed.",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);

    const options = {
      filename: `group-${groupId}-contributions.pdf`,
      page: { margin: 20 }
    };

    try {
      const getTargetElement = () => reportRef.current;
      await generatePDF(getTargetElement, options);

      toast({
        title: "Success",
        description: "Report has been exported successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const totalContributed = calculateTotalContributed(contributions);
  const revenue = calculateRevenue(contributions);
  const progress = (totalContributed / targetAmount) * 100;
  const targetReached = isTargetReached(totalContributed, targetAmount);

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Button
            variant="destructive"
            onClick={handleLeaveGroup}
            disabled={isLeaving || isAdmin}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            {isLeaving ? "Leaving..." : "Leave Group"}
          </Button>

          {(isAdmin || isTreasurer) && (
            <Button
              variant="outline"
              onClick={handleExportPDF}
              disabled={isExporting}
              className="flex items-center gap-2"
            >
              <FileDown className="h-4 w-4" />
              {isExporting ? "Exporting..." : "Export Report"}
            </Button>
          )}
        </div>

        {isAdmin && (
          <p className="text-sm text-muted-foreground">
            As an admin, you cannot leave the group. Please assign another admin first.
          </p>
        )}

        <div className="mt-4">
          <h3 className="font-medium text-lg">Contribution Summary</h3>
          <div className="mt-2 space-y-2">
            <div className="flex justify-between">
              <span>Total Contributed:</span>
              <span className="font-medium">{formatCurrency(totalContributed)}</span>
            </div>
            <div className="flex justify-between">
              <span>Target Amount:</span>
              <span className="font-medium">{formatCurrency(targetAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Progress:</span>
              <span className={`font-medium ${targetReached ? 'text-green-600' : ''}`}>
                {progress.toFixed(0)}%
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded">
              <div
                className="h-2 bg-primary rounded"
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Hidden element for PDF export */}
        <div ref={reportRef} className="hidden">
          <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Group Contributions Report</h1>
            <div className="mb-4">
              <p>Total Contributed: {formatCurrency(totalContributed)}</p>
              <p>Target Amount: {formatCurrency(targetAmount)}</p>
              <p>Total Revenue Generated: {formatCurrency(revenue)}</p>
              {targetReached && <p className="text-green-600 font-bold">Target Successfully Reached!</p>}
            </div>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2">Contributor</th>
                  <th className="border p-2">Amount</th>
                  <th className="border p-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {contributions.map((contribution, index) => (
                  <tr key={index}>
                    <td className="border p-2">{contribution.contributorName}</td>
                    <td className="border p-2">{formatCurrency(contribution.amount)}</td>
                    <td className="border p-2">{new Date(contribution.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Card>
  );
}
