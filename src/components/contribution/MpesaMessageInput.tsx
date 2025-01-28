import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { calculateTransactionFee, getLoyaltyDiscount } from "@/utils/pricingUtils";

interface MpesaMessageInputProps {
  mpesaMessage: string;
  setMpesaMessage: (message: string) => void;
  setFormData: (data: any) => void;
  onParse: (message: string) => void;
  memberCount: number;
  membershipDays: number;
}

export function MpesaMessageInput({
  mpesaMessage,
  setMpesaMessage,
  onParse,
  memberCount,
  membershipDays,
}: MpesaMessageInputProps) {
  const { toast } = useToast();

  const handleMpesaMessageParse = () => {
    if (!mpesaMessage.trim()) {
      toast({
        title: "Error",
        description: "Please paste an M-Pesa message first",
        variant: "destructive",
      });
      return;
    }

    onParse(mpesaMessage);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="mpesaMessage">Paste M-Pesa Message</Label>
        <Textarea
          id="mpesaMessage"
          value={mpesaMessage}
          onChange={(e) => setMpesaMessage(e.target.value)}
          placeholder="Example: TAJ1RBVSYF Confirmed. You have received Ksh1,000.00 from JOHN DOE 0722000000 on 19/1/24 at 4:37 PM"
          className="min-h-[100px]"
        />
      </div>
      <Button onClick={handleMpesaMessageParse} className="w-full">
        Parse Message
      </Button>
    </div>
  );
}