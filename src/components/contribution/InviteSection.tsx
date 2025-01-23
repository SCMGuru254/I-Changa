import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Share2, Mail, Facebook, Phone } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

interface InviteSectionProps {
  inviteEmail: string;
  setInviteEmail: (email: string) => void;
}

export function InviteSection({ inviteEmail, setInviteEmail }: InviteSectionProps) {
  const { toast } = useToast();
  const [inviteCount, setInviteCount] = useState(0);
  const [lastInviteTime, setLastInviteTime] = useState(0);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic spam prevention
    const now = Date.now();
    if (now - lastInviteTime < 60000) { // 1 minute cooldown
      toast({
        title: "Please wait",
        description: "Please wait a minute before sending another invitation",
        variant: "destructive",
      });
      return;
    }

    if (inviteCount >= 10) { // Daily limit
      toast({
        title: "Daily limit reached",
        description: "You've reached the maximum number of invites for today",
        variant: "destructive",
      });
      return;
    }

    if (!inviteEmail) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteEmail)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setInviteCount(prev => prev + 1);
    setLastInviteTime(now);

    toast({
      title: "Invitation Sent!",
      description: `An invitation has been sent to ${inviteEmail}. New members get a special 5% discount on their first contribution!`,
    });
    setInviteEmail("");
  };

  const handleSocialInvite = (platform: string) => {
    const message = `Join our contribution group on iChanga! New members get a special 5% discount on their first contribution.`;
    
    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(message)}`);
        break;
      case 'contacts':
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
                <Share2 className="w-4 h-4 mr-2" />
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
  );
}