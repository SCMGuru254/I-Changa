import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { parseMpesaMessage } from "@/utils/mpesaParser";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculateTransactionFee, getLoyaltyDiscount } from "@/utils/pricingUtils";
import { Share2, Mail, Facebook, Phone, WhatsApp } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const memberCount = 15; // Example: group has 15 members
  const membershipDays = 200; // Example: member has been active for 200 days

  const handleMpesaMessageParse = () => {
    const parsedMessage = parseMpesaMessage(mpesaMessage);
    if (parsedMessage) {
      setFormData({
        contributorName: parsedMessage.contributorName,
        phoneNumber: parsedMessage.phoneNumber,
        amount: parsedMessage.amount.toString(),
        transactionId: parsedMessage.transactionId,
      });

      // Calculate and show the transaction fee with loyalty discount
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

    // Store contribution locally if offline
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

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Invitation Sent!",
      description: `An invitation has been sent to ${inviteEmail}. New members get a special 5% discount on their first contribution!`,
    });
    setInviteEmail("");
  };

  const handleSocialInvite = (platform: string) => {
    const message = `Join our contribution group! New members get a special 5% discount on their first contribution.`;
    
    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(message)}`);
        break;
      case 'contacts':
        // This will only work if the Web Contact Picker API is supported
        if ('contacts' in navigator && 'ContactsManager' in window) {
          // @ts-ignore - TypeScript doesn't recognize the Contact Picker API yet
          navigator.contacts.select(['email', 'tel'])
            .then((contacts) => {
              if (contacts.length > 0) {
                toast({
                  title: "Contacts Selected",
                  description: `${contacts.length} contact(s) selected for invitation`,
                });
              }
            })
            .catch(() => {
              toast({
                title: "Error",
                description: "Could not access contacts. Please try another method.",
                variant: "destructive",
              });
            });
        } else {
          toast({
            title: "Not Supported",
            description: "Contact picker is not supported on this device.",
            variant: "destructive",
          });
        }
        break;
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
        </TabsContent>

        <TabsContent value="mpesa">
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
        </TabsContent>
      </Tabs>

      <div className="mt-8 pt-4 border-t">
        <h3 className="text-lg font-semibold mb-4">Invite Members</h3>
        <form onSubmit={handleInvite} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="inviteEmail">Email Address</Label>
            <Input
              id="inviteEmail"
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="Enter email address to invite"
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" variant="outline" className="flex-1">
              <Mail className="w-4 h-4 mr-2" />
              Send Email Invitation
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Share2 className="w-4 h-4 mr-2" />
                  More Options
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleSocialInvite('whatsapp')}>
                  <WhatsApp className="w-4 h-4 mr-2" />
                  Share via WhatsApp
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSocialInvite('facebook')}>
                  <Facebook className="w-4 h-4 mr-2" />
                  Share on Facebook
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSocialInvite('contacts')}>
                  <Phone className="w-4 h-4 mr-2" />
                  Add from Contacts
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </form>
      </div>

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
