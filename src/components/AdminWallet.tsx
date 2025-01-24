import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Wallet, ArrowDownToLine } from "lucide-react";

export function AdminWallet() {
  const { toast } = useToast();
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  
  // In a real app, these would come from your backend
  const walletBalance = 2500; // Total accumulated fees
  const pendingFees = 150; // Fees from recent transactions
  
  const handleWithdraw = async () => {
    setIsWithdrawing(true);
    try {
      // Here you would implement the actual M-Pesa withdrawal
      // For now, we'll just show a success message
      toast({
        title: "Withdrawal Initiated",
        description: "Your withdrawal request has been processed. You'll receive an M-Pesa message shortly.",
      });
    } catch (error) {
      toast({
        title: "Withdrawal Failed",
        description: "Please try again later or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Admin Wallet
        </h2>
        <Button
          variant="outline"
          onClick={handleWithdraw}
          disabled={isWithdrawing || walletBalance === 0}
          className="flex items-center gap-2"
        >
          <ArrowDownToLine className="h-4 w-4" />
          {isWithdrawing ? "Processing..." : "Withdraw to M-Pesa"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-secondary/10 rounded-lg">
          <p className="text-sm text-muted-foreground">Available Balance</p>
          <p className="text-2xl font-bold text-primary">
            KES {walletBalance.toLocaleString()}
          </p>
        </div>
        
        <div className="p-4 bg-secondary/10 rounded-lg">
          <p className="text-sm text-muted-foreground">Pending Fees</p>
          <p className="text-2xl font-bold text-secondary">
            KES {pendingFees.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mt-6 text-sm text-muted-foreground">
        <p>• Withdrawals are processed via M-Pesa within 24 hours</p>
        <p>• Minimum withdrawal amount: KES 100</p>
        <p>• Transaction fees are automatically added to your wallet</p>
      </div>
    </Card>
  );
}