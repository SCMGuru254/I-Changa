
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { DatePicker } from "@/components/ui/date-picker";
import { format, addMonths } from "date-fns";

interface GroupCreationFormProps {
  onSuccess?: () => void;
}

export function GroupCreationForm({ onSuccess }: GroupCreationFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    targetAmount: 0,
    endDate: addMonths(new Date(), 3),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "targetAmount" ? parseFloat(value) || 0 : value,
    });
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData({
        ...formData,
        endDate: date,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You need to be signed in to create a group",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("Creating group with data:", formData);
      console.log("Current user:", user);
      
      // Insert the group - Fixed property name from created_by to creator_id
      const { data: group, error: groupError } = await supabase
        .from("groups")
        .insert({
          name: formData.name,
          description: formData.description,
          target_amount: formData.targetAmount,
          end_date: formData.endDate.toISOString(),
          creator_id: user.id,
          status: "active",
        })
        .select('id')
        .single();
      
      if (groupError) {
        throw groupError;
      }
      
      // Add the creator as an admin member
      const { error: memberError } = await supabase
        .from("group_members")
        .insert({
          group_id: group.id,
          member_id: user.id,
          role: "admin",
          joined_at: new Date().toISOString(),
        });
      
      if (memberError) {
        throw memberError;
      }
      
      toast({
        title: "Group Created",
        description: `${formData.name} has been successfully created.`,
      });
      
      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['userGroups'] });
      
      // Reset form
      setFormData({
        name: "",
        description: "",
        targetAmount: 0,
        endDate: addMonths(new Date(), 3),
      });
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error creating group:", error);
      toast({
        title: "Error creating group",
        description: error.message || "Failed to create group. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Group Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="e.g., Family Savings"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="What is this group for?"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="targetAmount">Target Amount (KES)</Label>
        <Input
          id="targetAmount"
          name="targetAmount"
          type="number"
          min="1"
          placeholder="50000"
          value={formData.targetAmount || ""}
          onChange={handleChange}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="endDate">End Date</Label>
        <DatePicker
          date={formData.endDate}
          setDate={handleDateChange}
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating...
          </>
        ) : (
          "Create Group"
        )}
      </Button>
    </form>
  );
}
