import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PDFExport } from './PDFExport';
import { useEffect, useState } from "react";

interface GroupDetailsProps {
  group: any;
  isAdmin: boolean;
}

export function GroupDetails({ group, isAdmin }: GroupDetailsProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    if (group && group.total_contributions >= group.target_amount) {
      setShowReport(true);
    }
  }, [group]);

  const handleLeaveGroup = async () => {
    if (!user || !group?.id) return;

    try {
      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', group.id)
        .eq('member_id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "You have left the group successfully",
      });
      
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">{group.name}</h2>
      <p className="text-muted-foreground mb-4">{group.description}</p>
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold">Target Amount:</p>
          <p className="text-xl text-primary">
            KES {group.target_amount?.toLocaleString() || '0'}
          </p>
        </div>
        <Button
          variant="destructive"
          onClick={handleLeaveGroup}
          disabled={isAdmin}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Leave Group
        </Button>
      </div>
      {showReport && group && (
        <PDFExport
          summary={{
            totalAmount: group.total_contributions,
            targetAmount: group.target_amount,
            contributorsCount: group.member_count,
            startDate: group.created_at,
            endDate: new Date().toISOString(),
            groupName: group.name,
            contributions: group.contributions || [],
          }}
        />
      )}
    </Card>
  );
}
