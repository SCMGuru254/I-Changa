import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculateTransactionFee, getLoyaltyDiscount } from "@/utils/pricingUtils";
import { ManualEntryForm } from "./contribution/ManualEntryForm";
import { MpesaMessageInput } from "./contribution/MpesaMessageInput";
import { InviteSection } from "./contribution/InviteSection";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function ContributionForm() {
  const { groupId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    contributorName: "",
    phoneNumber: "",
    amount: "",
    transactionId: "",
  });
  const [mpesaMessage, setMpesaMessage] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !groupId) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('contributions')
        .insert([
          {
            group_id: groupId,
            contributor_id: user.id,
            amount: parseFloat(formData.amount),
            transaction_id: formData.transactionId,
          }
        ]);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Contribution recorded successfully",
      });

      setFormData({
        contributorName: "",
        phoneNumber: "",
        amount: "",
        transactionId: "",
      });
      setMpesaMessage("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
            isSubmitting={isSubmitting}
          />
        </TabsContent>

        <TabsContent value="mpesa">
          <MpesaMessageInput
            mpesaMessage={mpesaMessage}
            setMpesaMessage={setMpesaMessage}
            setFormData={setFormData}
            memberCount={15}
            membershipDays={200}
          />
        </TabsContent>
      </Tabs>

      <InviteSection
        inviteEmail={inviteEmail}
        setInviteEmail={setInviteEmail}
      />
    </Card>
  );
}