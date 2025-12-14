
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Contribution } from "@/types";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Simulated API call
const fetchContributions = async (): Promise<Contribution[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Dummy data for demonstration
  return [
    {
      id: "1",
      amount: 1000,
      contributorName: "John Doe",
      phoneNumber: "+254712345678",
      date: "2024-02-20",
      transactionId: "QWE123456",
      groupId: "1",
    },
    {
      id: "2",
      amount: 2000,
      contributorName: "Jane Smith",
      phoneNumber: "+254723456789",
      date: "2024-02-19",
      transactionId: "ASD789012",
      groupId: "1",
    },
  ];
};

import { DisputeDialog } from "@/components/contribution/DisputeDialog";
import { AlertTriangle } from "lucide-react";

export function ContributionsList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [disputeOpen, setDisputeOpen] = useState(false);
  const [selectedContribution, setSelectedContribution] = useState<{ id: string, amount: number } | null>(null);

  const { data: contributions, isLoading, error } = useQuery({
    queryKey: ['contributions'],
    queryFn: fetchContributions,
  });

  const isAdmin = true; // Replace with actual admin check

  const handleDispute = (contribution: { id: string, amount: number }) => {
    setSelectedContribution(contribution);
    setDisputeOpen(true);
  };

  // Replace Supabase logic with placeholder functions
  const handleApproval = async (contributionId: string, isApproved: boolean) => {
    try {
      // Placeholder logic for approval
      console.log(`Contribution ${contributionId} has been ${isApproved ? 'approved' : 'rejected'}.`);

      toast({
        title: 'Approval Updated',
        description: `Contribution has been ${isApproved ? 'approved' : 'rejected'}.`,
        // variant: 'success', // variant 'success' does not exist in default shadcn
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update approval status.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6 text-center text-red-500">
        <p>Error loading contributions. Please try again later.</p>
      </Card>
    );
  }

  if (!contributions?.length) {
    return (
      <Card className="p-6 text-center text-muted-foreground">
        <p>No contributions found.</p>
      </Card>
    );
  }

  const filteredContributions = contributions.filter(
    (contribution) =>
      contribution.contributorName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      contribution.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search by name or transaction ID..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />

      <div className="space-y-4">
        {filteredContributions.map((contribution) => (
          <Card key={contribution.id} className="p-4 hover:shadow-md transition-shadow relative group">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{contribution.contributorName}</h3>
                <p className="text-sm text-muted-foreground">{contribution.phoneNumber}</p>
                <p className="text-sm text-muted-foreground">
                  Transaction ID: {isAdmin ? contribution.transactionId : 'Hidden'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-primary">
                  KES {contribution.amount.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Date(contribution.date).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => handleDispute({ id: contribution.id, amount: contribution.amount })}
              >
                <AlertTriangle className="h-4 w-4 mr-1" />
                Dispute
              </Button>

              {isAdmin && (
                <>
                  <Button size="sm" onClick={() => handleApproval(contribution.id, true)}>Approve</Button>
                  <Button size="sm" onClick={() => handleApproval(contribution.id, false)} variant="destructive">
                    Reject
                  </Button>
                </>
              )}
            </div>
          </Card>
        ))}
      </div>

      {selectedContribution && (
        <DisputeDialog
          isOpen={disputeOpen}
          onClose={() => setDisputeOpen(false)}
          contributionId={selectedContribution.id}
          currentAmount={selectedContribution.amount}
        />
      )}
    </div>
  );
}
