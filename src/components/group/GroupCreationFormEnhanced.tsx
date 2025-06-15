
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { DatePicker } from "@/components/ui/date-picker";
import { useProfileEnsurance } from "@/hooks/useProfileEnsurance";
import { GroupFormData, getInitialFormData } from "@/types/GroupFormData";
import { verifyUserProfile, createGroup, addUserAsAdmin } from "@/utils/groupCreationService";
import { validationService } from "@/utils/validationService";
import { useErrorHandler } from "@/utils/errorHandlingService";
import { emailNotificationService } from "@/utils/emailNotificationService";

interface GroupCreationFormEnhancedProps {
  onSuccess?: () => void;
}

export function GroupCreationFormEnhanced({ onSuccess }: GroupCreationFormEnhancedProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<GroupFormData>(getInitialFormData());
  const { handleError, handleSuccess } = useErrorHandler({
    component: 'GroupCreationFormEnhanced',
    action: 'create_group',
    userId: user?.id
  });

  useProfileEnsurance();

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

  const validateForm = (): boolean => {
    const nameValidation = validationService.validateGroupName(formData.name);
    const targetValidation = validationService.validateTargetAmount(formData.targetAmount);
    const dateValidation = validationService.validateEndDate(formData.endDate);

    const allErrors = [
      ...nameValidation.errors,
      ...targetValidation.errors,
      ...dateValidation.errors
    ];

    if (allErrors.length > 0) {
      handleError(new Error(allErrors[0]));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      handleError(new Error("You need to be signed in to create a group"));
      return;
    }

    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("Creating group with data:", formData);
      console.log("Current user:", user);
      
      await verifyUserProfile(user.id);
      const group = await createGroup(formData, user.id);
      await addUserAsAdmin(group.id, user.id);
      
      // Log group creation activity
      await emailNotificationService.sendNotification({
        recipientId: user.id,
        recipientEmail: user.email || '',
        type: 'group_created',
        subject: 'Group Created Successfully',
        title: 'New Group Created',
        message: `Your group "${formData.name}" has been created successfully`,
        groupId: group.id,
        metadata: { groupName: formData.name, targetAmount: formData.targetAmount }
      });
      
      handleSuccess(`${formData.name} has been successfully created.`);
      queryClient.invalidateQueries({ queryKey: ['userGroups'] });
      
      setFormData(getInitialFormData());
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error creating group:", error);
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Group Name *</Label>
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
        <Label htmlFor="description">Description *</Label>
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
        <Label htmlFor="targetAmount">Target Amount (KES) *</Label>
        <Input
          id="targetAmount"
          name="targetAmount"
          type="number"
          min="1"
          max="10000000"
          placeholder="50000"
          value={formData.targetAmount || ""}
          onChange={handleChange}
          required
        />
        <p className="text-xs text-muted-foreground mt-1">
          Maximum: KES 10,000,000
        </p>
      </div>
      
      <div>
        <Label htmlFor="endDate">End Date *</Label>
        <DatePicker
          date={formData.endDate}
          setDate={handleDateChange}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Must be a future date
        </p>
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
