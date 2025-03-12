
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function EmptyGroupState() {
  const navigate = useNavigate();
  
  return (
    <Card className="p-6 text-center">
      <p className="text-muted-foreground mb-4">
        You haven't joined any groups yet. Create one to get started!
      </p>
      <Button onClick={() => navigate('/onboarding')}>Create Group</Button>
    </Card>
  );
}
