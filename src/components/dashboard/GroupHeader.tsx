import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface GroupHeaderProps {
  name: string;
  description: string;
  targetAmount: number;
  isAdmin: boolean;
  onLeave: () => void;
}

export function GroupHeader({ name, description, targetAmount, isAdmin, onLeave }: GroupHeaderProps) {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">{name}</h2>
      <p className="text-muted-foreground mb-4">{description}</p>
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold">Target Amount:</p>
          <p className="text-xl text-primary">
            KES {targetAmount?.toLocaleString()}
          </p>
        </div>
        <Button
          variant="destructive"
          onClick={onLeave}
          disabled={isAdmin}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Leave Group
        </Button>
      </div>
    </Card>
  );
}