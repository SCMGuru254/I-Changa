import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ManualEntryFormProps {
  formData: {
    contributorName: string;
    phoneNumber: string;
    amount: string;
    transactionId: string;
    paymentMethod: string;
  };
  setFormData: (data: any) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

import { OCRScanner } from "@/components/OCRScanner";
import { Separator } from "@/components/ui/separator";
import { Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ManualEntryForm({
  formData,
  setFormData,
  handleSubmit,
  isSubmitting,
}: ManualEntryFormProps) {
  const { toast } = useToast();

  const handleShare = async () => {
    const text = `Received ${formData.amount} from ${formData.contributorName}. Ref: ${formData.transactionId}. - via iChanga`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Contribution Receipt',
          text: text,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      // Fallback to WhatsApp
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    }
    toast({ title: "Shared!", description: "Receipt link opened." });
  };
  const handleScanComplete = (data: { text: string; amount?: number; date?: Date; foundName?: string }) => {
    setFormData({
      ...formData,
      amount: data.amount ? data.amount.toString() : formData.amount,
      // If we found a name, use it, otherwise keep current
      contributorName: data.foundName || formData.contributorName,
      // Store the raw text as a note or description if needed, or just log it
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-muted/30 p-4 rounded-lg border">
        <OCRScanner onScanComplete={handleScanComplete} />
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or enter details manually</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="paymentMethod">Payment Method</Label>
          <Select
            value={formData.paymentMethod}
            onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mpesa">M-Pesa</SelectItem>
              <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
              <SelectItem value="paypal">PayPal</SelectItem>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

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

        <div className="flex gap-2">
          <Button type="submit" className="flex-1" disabled={isSubmitting}>
            {isSubmitting ? "Recording..." : "Record Contribution"}
          </Button>
          {formData.amount && formData.contributorName && (
            <Button type="button" variant="outline" size="icon" onClick={handleShare}>
              <Share2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}