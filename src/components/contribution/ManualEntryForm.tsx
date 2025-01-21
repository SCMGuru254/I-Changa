import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ManualEntryFormProps {
  formData: {
    contributorName: string;
    phoneNumber: string;
    amount: string;
    transactionId: string;
  };
  setFormData: (data: any) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

export function ManualEntryForm({
  formData,
  setFormData,
  handleSubmit,
}: ManualEntryFormProps) {
  return (
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
  );
}