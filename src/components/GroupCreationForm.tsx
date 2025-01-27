import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function GroupCreationForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    targetAmount: "",
    endDate: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data: group, error } = await supabase
        .from("groups")
        .insert([
          {
            name: formData.name,
            description: formData.description,
            target_amount: parseFloat(formData.targetAmount),
            end_date: formData.endDate,
            creator_id: user.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Add creator as admin member
      const { error: memberError } = await supabase
        .from("group_members")
        .insert([
          {
            group_id: group.id,
            member_id: user.id,
            role: "admin",
          },
        ]);

      if (memberError) throw memberError;

      toast({
        title: "Success!",
        description: "Group created successfully. Share link copied to clipboard!",
      });

      // Copy share link to clipboard
      const shareLink = `${window.location.origin}/join/${group.share_token}`;
      await navigator.clipboard.writeText(shareLink);

      navigate(`/group/${group.id}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Create New Group</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            placeholder="Group Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>
        <div>
          <Input
            type="number"
            placeholder="Target Amount (KES)"
            value={formData.targetAmount}
            onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
            required
          />
        </div>
        <div>
          <Input
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Group"}
        </Button>
      </form>
    </Card>
  );
}