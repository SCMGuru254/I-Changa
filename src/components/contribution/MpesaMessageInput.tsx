import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { parseMpesaMessage } from "@/utils/mpesaParser";
import { calculateTransactionFee, getLoyaltyDiscount } from "@/utils/pricingUtils";

interface MpesaMessageInputProps {
  mpesaMessage: string;
  setMpesaMessage: (message: string) => void;
  setFormData: (data: any) => void;
  memberCount: number;
  membershipDays: number;
}

export function MpesaMessageInput({
  mpesaMessage,
  setMpesaMessage,
  setFormData,
  memberCount,
  membershipDays,
}: MpesaMessageInputProps) {
  const { toast } = useToast();

  const handleMpesaMessageParse = () => {
    const parsedMessage = parseMpesaMessage(mpesaMessage);
    if (parsedMessage) {
      setFormData({
        contributorName: parsedMessage.contributorName,
        phoneNumber: parsedMessage.phoneNumber,
        amount: parsedMessage.amount.toString(),
        transactionId: parsedMessage.transactionId,
      });

      const baseAmount = parseFloat(parsedMessage.amount.toString());
      const baseFee = calculateTransactionFee(baseAmount, memberCount);
      const loyaltyDiscount = getLoyaltyDiscount(membershipDays);
      const finalFee = baseFee * (1 - loyaltyDiscount);

      toast({
        title: "Success!",
        description: `M-Pesa message parsed successfully. Transaction fee: KES ${finalFee.toFixed(2)} ${loyaltyDiscount > 0 ? `(Including ${loyaltyDiscount * 100}% loyalty discount)` : ''}`,
      });
    } else {
      toast({
        title: "Error",
        description: "Could not parse M-Pesa message. Please check the format.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="mpesaMessage">Paste M-Pesa Message</Label>
        <Textarea
          id="mpesaMessage"
          value={mpesaMessage}
          onChange={(e) => setMpesaMessage(e.target.value)}
          placeholder="Paste your M-Pesa message here..."
          className="min-h-[100px]"
        />
      </div>
      <Button onClick={handleMpesaMessageParse} className="w-full">
        Parse Message
      </Button>
    </div>
  );
}