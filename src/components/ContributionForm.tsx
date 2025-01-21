import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";

export function ContributionForm() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    contributorName: "",
    phoneNumber: "",
    amount: "",
    transactionId: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.contributorName || !formData.phoneNumber || !formData.amount || !formData.transactionId) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    // TODO: Add actual submission logic
    toast({
      title: "Success!",
      description: "Contribution recorded successfully",
    });

    // Reset form
    setFormData({
      contributorName: "",
      phoneNumber: "",
      amount: "",
      transactionId: "",
    });
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="contributorName">Contributor Name</Label>
          <Input
            id="contributorName"
            value={formData.contributorName}
            onChange={(e) =>
              setFormData({ ...formData, contributorName: e.target.value })
            }
            placeholder="Enter contributor name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            value={formData.phoneNumber}
            onChange={(e) =>
              setFormData({ ...formData, phoneNumber: e.target.value })
            }
            placeholder="Enter phone number"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Amount (KES)</Label>
          <Input
            id="amount"
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            placeholder="Enter amount"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="transactionId">M-Pesa Transaction ID</Label>
          <Input
            id="transactionId"
            value={formData.transactionId}
            onChange={(e) =>
              setFormData({ ...formData, transactionId: e.target.value })
            }
            placeholder="Enter M-Pesa transaction ID"
          />
        </div>

        <Button type="submit" className="w-full">
          Record Contribution
        </Button>
      </form>
    </Card>
  );
}