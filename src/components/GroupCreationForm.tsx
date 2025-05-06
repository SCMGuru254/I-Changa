
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export function GroupCreationForm({ onSuccess }: { onSuccess?: () => void }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    targetAmount: "",
    endDate: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Don't proceed if already loading
    if (formLoading || isLoading) return;
    
    if (!isAuthenticated || !user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a group",
        variant: "destructive",
      });
      return;
    }

    if (!formData.name || !formData.description || !formData.targetAmount || !formData.endDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setFormLoading(true);
    try {
      console.log("Creating group with user ID:", user.id);
      
      // First, create the group
      const { data: group, error: groupError } = await supabase
        .from("groups")
        .insert({
          name: formData.name,
          description: formData.description,
          target_amount: parseFloat(formData.targetAmount),
          end_date: formData.endDate,
          creator_id: user.id,
        })
        .select()
        .single();

      if (groupError) {
        console.error("Error creating group:", groupError);
        throw groupError;
      }

      console.log("Group created successfully:", group);

      // Add creator as admin member
      const { error: memberError } = await supabase
        .from("group_members")
        .insert({
          group_id: group.id,
          member_id: user.id,
          role: "admin",
        });

      if (memberError) {
        console.error("Error adding member:", memberError);
        throw memberError;
      }

      toast({
        title: "Success!",
        description: "Group created successfully!",
      });

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }

      // Navigate to the group page
      navigate(`/group/${group.id}`, { replace: true });
    } catch (error: any) {
      console.error("Error in group creation:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create group",
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  // Show loading state if auth is still loading
  if (isLoading) {
    return (
      <Card className="p-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading authentication...</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Group Name</Label>
          <Input
            id="name"
            placeholder="Enter group name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Purpose/Description</Label>
          <Textarea
            id="description"
            placeholder="Describe the purpose of this group"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="targetAmount">Target Amount (KES)</Label>
          <Input
            id="targetAmount"
            type="number"
            placeholder="Enter target amount"
            value={formData.targetAmount}
            onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={formLoading || !isAuthenticated}>
          {formLoading ? "Creating..." : "Create Group"}
        </Button>
      </form>
    </Card>
  );
}
