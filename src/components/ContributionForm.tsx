
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ManualEntryForm } from "./contribution/ManualEntryForm";
import { MpesaMessageInput } from "./contribution/MpesaMessageInput";
import { InviteSection } from "./contribution/InviteSection";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { parseMpesaMessage } from "@/utils/mpesaParser";
import { useOffline } from '@/hooks/use-offline';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ContributionForm() {
  const { groupId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    contributorName: "",
    phoneNumber: "",
    amount: "",
    transactionId: "",
    confirmationMessage: "",
    screenshot: null as File | null,
  });
  const [mpesaMessage, setMpesaMessage] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isOffline = useOffline();

  const handleOfflineSubmit = () => {
    const offlineContributions = JSON.parse(localStorage.getItem('offlineContributions') || '[]');
    offlineContributions.push({
      group_id: groupId,
      contributor_id: user?.id,
      amount: parseFloat(formData.amount),
      transaction_id: formData.transactionId,
    });
    localStorage.setItem('offlineContributions', JSON.stringify(offlineContributions));
    toast({
      title: 'Offline Mode',
      description: 'Contribution saved locally. It will sync when you are back online.',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !groupId) return;

    if (isOffline) {
      handleOfflineSubmit();
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
          },
        ]);

      if (error) throw error;

      toast({
        title: 'Success!',
        description: 'Contribution recorded successfully.',
      });

      setFormData({
        contributorName: "",
        phoneNumber: "",
        amount: "",
        transactionId: "",
        confirmationMessage: "",
        screenshot: null,
      });
      setMpesaMessage("");
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMpesaMessageParse = (message: string) => {
    const parsedMessage = parseMpesaMessage(message);
    if (parsedMessage) {
      setFormData({
        ...formData,
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

  const handleManualConfirmation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !groupId) return;

    setIsSubmitting(true);
    try {
      // For now, we'll store manual confirmations as regular contributions with a note
      const { error } = await supabase
        .from('contributions')
        .insert({
          group_id: groupId,
          contributor_id: user.id,
          amount: 0, // Set to 0 for manual confirmations pending admin review
          transaction_id: `MANUAL_${Date.now()}`,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: 'Confirmation Submitted',
        description: 'Your manual confirmation has been submitted for admin review.',
      });
      
      setFormData({
        ...formData,
        confirmationMessage: "",
        screenshot: null,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to submit manual confirmation.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!isOffline) {
      const offlineContributions = JSON.parse(localStorage.getItem('offlineContributions') || '[]');
      if (offlineContributions.length > 0) {
        offlineContributions.forEach(async (contribution: any) => {
          try {
            const { error } = await supabase.from('contributions').insert([contribution]);
            if (!error) {
              toast({
                title: 'Sync Success',
                description: 'Offline contributions synced successfully.',
              });
            }
          } catch (error) {
            console.error('Error syncing offline contributions:', error);
          }
        });
        localStorage.removeItem('offlineContributions');
      }
    }
  }, [isOffline, toast]);

  return (
    <Card className="p-6">
      <Tabs defaultValue="manual" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          <TabsTrigger value="mpesa">M-Pesa Message</TabsTrigger>
          <TabsTrigger value="confirmation">Manual Confirmation</TabsTrigger>
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

        <TabsContent value="confirmation">
          <form onSubmit={handleManualConfirmation} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="confirmation-message">Confirmation Message</Label>
              <Textarea
                id="confirmation-message"
                placeholder="Paste M-Pesa confirmation message here..."
                value={formData.confirmationMessage}
                onChange={(e) => setFormData({ ...formData, confirmationMessage: e.target.value })}
                rows={4}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="screenshot">Screenshot (Optional)</Label>
              <Input
                id="screenshot"
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, screenshot: e.target.files?.[0] || null })}
              />
            </div>
            
            <Button type="submit" disabled={isSubmitting || !formData.confirmationMessage.trim()}>
              {isSubmitting ? "Submitting..." : "Submit Confirmation"}
            </Button>
          </form>
        </TabsContent>
      </Tabs>

      <InviteSection
        inviteEmail={inviteEmail}
        setInviteEmail={setInviteEmail}
      />
    </Card>
  );
}
