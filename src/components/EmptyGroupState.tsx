
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { GroupCreationForm } from "@/components/GroupCreationForm";
import { Plus } from "lucide-react";

export function EmptyGroupState() {
  const navigate = useNavigate();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
  const handleGroupCreationSuccess = () => {
    setIsSheetOpen(false);
  };
  
  return (
    <Card className="p-6 text-center">
      <p className="text-muted-foreground mb-4">
        You haven't joined any groups yet. Create one to get started!
      </p>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button className="flex items-center gap-2" onClick={() => setIsSheetOpen(true)}>
            <Plus className="h-4 w-4" />
            Create Group
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Create New Group</SheetTitle>
            <SheetDescription>
              Set up a new contribution group and invite members
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <GroupCreationForm onSuccess={handleGroupCreationSuccess} />
          </div>
        </SheetContent>
      </Sheet>
    </Card>
  );
}
