
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Mail, 
  Phone, 
  Link as LinkIcon, 
  Share2, 
  Copy,
  Send,
  UserPlus
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { inviteService } from "@/utils/inviteService";

interface InviteMembersProps {
  groupId: string;
  groupName: string;
  inviterName: string;
  isAdmin: boolean;
}

export function InviteMembers({ groupId, groupName, inviterName, isAdmin }: InviteMembersProps) {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Email invite state
  const [email, setEmail] = useState("");
  const [emailRole, setEmailRole] = useState("member");
  
  // Phone invite state
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneRole, setPhoneRole] = useState("member");
  
  // Invite link state
  const [inviteLink, setInviteLink] = useState("");

  const handleEmailInvite = async () => {
    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await inviteService.sendEmailInvite({
        groupId,
        inviterName,
        groupName,
        email: email.trim(),
        role: emailRole
      });

      if (result.success) {
        toast({
          title: "Invitation Sent!",
          description: `Email invitation sent to ${email}`,
        });
        setEmail("");
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to send email invitation",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send email invitation",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneInvite = async () => {
    if (!phoneNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter a phone number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await inviteService.sendPhoneInvite({
        groupId,
        inviterName,
        groupName,
        phoneNumber: phoneNumber.trim(),
        role: phoneRole
      });

      if (result.success) {
        toast({
          title: "Invitation Sent!",
          description: `Phone invitation sent to ${phoneNumber}`,
        });
        setPhoneNumber("");
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to send phone invitation",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send phone invitation",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = async () => {
    setIsLoading(true);
    try {
      const result = await inviteService.copyInviteLink(groupId);
      
      if (result.success) {
        setInviteLink(result.link || "");
        toast({
          title: "Link Copied!",
          description: "Invite link copied to clipboard",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to copy invite link",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy invite link",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareLink = async () => {
    try {
      const result = await inviteService.generateInviteLink(groupId);
      
      if (navigator.share) {
        await navigator.share({
          title: `Join ${groupName}`,
          text: `You've been invited to join ${groupName} on iChanga!`,
          url: result,
        });
      } else {
        // Fallback to copy
        await handleCopyLink();
      }
    } catch (error) {
      console.error('Share error:', error);
      toast({
        title: "Error",
        description: "Failed to share invite link",
        variant: "destructive",
      });
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Invite Members
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Invite Members to {groupName}</DialogTitle>
          <DialogDescription>
            Choose how you'd like to invite new members to your group.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="phone">Phone</TabsTrigger>
            <TabsTrigger value="link">Link</TabsTrigger>
          </TabsList>
          
          <TabsContent value="email" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="emailRole">Role</Label>
              <Select value={emailRole} onValueChange={setEmailRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="treasurer">Treasurer</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={handleEmailInvite} 
              disabled={isLoading || !email.trim()}
              className="w-full"
            >
              <Mail className="h-4 w-4 mr-2" />
              {isLoading ? "Sending..." : "Send Email Invite"}
            </Button>
          </TabsContent>
          
          <TabsContent value="phone" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+254700000000"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phoneRole">Role</Label>
              <Select value={phoneRole} onValueChange={setPhoneRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="treasurer">Treasurer</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={handlePhoneInvite} 
              disabled={isLoading || !phoneNumber.trim()}
              className="w-full"
            >
              <Phone className="h-4 w-4 mr-2" />
              {isLoading ? "Sending..." : "Send Phone Invite"}
            </Button>
          </TabsContent>
          
          <TabsContent value="link" className="space-y-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Generate a link that anyone can use to join your group.
              </p>
              
              {inviteLink && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm font-mono break-all">{inviteLink}</p>
                </div>
              )}
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleCopyLink} 
                  disabled={isLoading}
                  variant="outline"
                  className="flex-1"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </Button>
                
                <Button 
                  onClick={handleShareLink} 
                  disabled={isLoading}
                  variant="outline"
                  className="flex-1"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
