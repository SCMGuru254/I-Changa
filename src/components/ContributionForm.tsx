import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ManualEntryForm } from "./contribution/ManualEntryForm";
import { MpesaMessageInput } from "./contribution/MpesaMessageInput";
import { InviteSection } from "./contribution/InviteSection";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { parseMpesaMessage } from "@/utils/mpesaParser";

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
    if (!user || !groupId) {
      toast({
        title: "Error",
        description: "You must be logged in to make a contribution",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.amount || !formData.transactionId) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
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
      console.error("Error submitting contribution:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMpesaMessageParse = (message: string) => {
    if (!message.trim()) {
      toast({
        title: "Error",
        description: "Please enter an M-Pesa message",
        variant: "destructive",
      });
      return;
    }

    const parsedMessage = parseMpesaMessage(message);
    if (parsedMessage) {
      setFormData({
        contributorName: parsedMessage.contributorName,
        phoneNumber: parsedMessage.phoneNumber,
        amount: parsedMessage.amount.toString(),
        transactionId: parsedMessage.transactionId,
      });
      toast({
        title: "Success",
        description: "M-Pesa message parsed successfully",
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
            onParse={handleMpesaMessageParse}
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