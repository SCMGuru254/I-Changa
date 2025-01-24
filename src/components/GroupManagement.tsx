import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LogOut, FileDown } from "lucide-react";
import generatePDF from "react-to-pdf";
import { calculateRevenue } from "@/utils/pricingUtils";

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
    const totalContributed = contributions.reduce((sum, c) => sum + c.amount, 0);
    const totalRevenue = calculateRevenue(contributions);
    const isComplete = totalContributed >= targetAmount || new Date() >= new Date(endDate);

    if (!isComplete) {
      toast({
        title: "Cannot Export Yet",
        description: "Contributions are still ongoing. Export will be available when target is reached or end date is passed.",
        variant: "destructive",
      });
      return;
    }

    const options = {
      filename: `group-${groupId}-contributions.pdf`,
      page: { margin: 20 }
    };

    try {
      const reportContent = () => (
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-6">Group Contributions Report</h1>
          <div className="mb-4">
            <p>Total Contributed: KES {totalContributed.toLocaleString()}</p>
            <p>Target Amount: KES {targetAmount.toLocaleString()}</p>
            <p>Total Revenue Generated: KES {totalRevenue.toLocaleString()}</p>
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
                  <td className="border p-2">KES {contribution.amount.toLocaleString()}</td>
                  <td className="border p-2">{new Date(contribution.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

      await generatePDF(reportContent, options);

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
    }
  };

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
              className="flex items-center gap-2"
            >
              <FileDown className="h-4 w-4" />
              Export Report
            </Button>
          )}
        </div>

        {isAdmin && (
          <p className="text-sm text-muted-foreground">
            As an admin, you cannot leave the group. Please assign another admin first.
          </p>
        )}
      </div>
    </Card>
  );
}