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

interface InviteSectionProps {
  inviteEmail: string;
  setInviteEmail: (email: string) => void;
}

export function InviteSection({ inviteEmail, setInviteEmail }: InviteSectionProps) {
  const { toast } = useToast();

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