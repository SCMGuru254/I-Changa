import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculateTransactionFee, getLoyaltyDiscount } from "@/utils/pricingUtils";
import { ManualEntryForm } from "./contribution/ManualEntryForm";
import { MpesaMessageInput } from "./contribution/MpesaMessageInput";
import { InviteSection } from "./contribution/InviteSection";

export function ContributionForm() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    contributorName: "",
    phoneNumber: "",
    amount: "",
    transactionId: "",
  });
  const [mpesaMessage, setMpesaMessage] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [offlineContributions, setOfflineContributions] = useState(() => {
    const saved = localStorage.getItem('offlineContributions');
    return saved ? JSON.parse(saved) : [];
  });

  // Simulated values - in a real app these would come from your backend
  const memberCount = 15;
  const membershipDays = 200;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.contributorName || !formData.phoneNumber || !formData.amount || !formData.transactionId) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(formData.amount);
    const baseFee = calculateTransactionFee(amount, memberCount);
    const loyaltyDiscount = getLoyaltyDiscount(membershipDays);
    const finalFee = baseFee * (1 - loyaltyDiscount);

    if (!navigator.onLine) {
      const newContribution = {
        ...formData,
        timestamp: new Date().toISOString(),
        fee: finalFee,
      };
      const updatedContributions = [...offlineContributions, newContribution];
      setOfflineContributions(updatedContributions);
      localStorage.setItem('offlineContributions', JSON.stringify(updatedContributions));
      
      toast({
        title: "Saved Offline",
        description: "Contribution saved locally. Will sync when online.",
      });
    } else {
      toast({
        title: "Success!",
        description: `Contribution recorded successfully. Transaction fee: KES ${finalFee.toFixed(2)} ${loyaltyDiscount > 0 ? `(Including ${loyaltyDiscount * 100}% loyalty discount)` : ''}`,
      });
    }

    setFormData({
      contributorName: "",
      phoneNumber: "",
      amount: "",
      transactionId: "",
    });
    setMpesaMessage("");
  };

  return (
    <Card className="p-6">
      <Tabs defaultValue="manual" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          <TabsTrigger value="mpesa">M-Pesa Message</TabsTrigger>
        </TabsList>

        <TabsContent value="manual">
          <ManualEntryForm
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
          />
        </TabsContent>

        <TabsContent value="mpesa">
          <MpesaMessageInput
            mpesaMessage={mpesaMessage}
            setMpesaMessage={setMpesaMessage}
            setFormData={setFormData}
            memberCount={memberCount}
            membershipDays={membershipDays}
          />
        </TabsContent>
      </Tabs>

      <InviteSection
        inviteEmail={inviteEmail}
        setInviteEmail={setInviteEmail}
      />

      {!navigator.onLine && offlineContributions.length > 0 && (
        <div className="mt-4 p-4 bg-yellow-50 rounded-md">
          <p className="text-yellow-800">
            You're offline. {offlineContributions.length} contribution(s) will sync when you're back online.
          </p>
        </div>
      )}
    </Card>
  );
}