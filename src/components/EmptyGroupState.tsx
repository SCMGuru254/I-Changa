
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GroupCreationForm } from "@/components/GroupCreationForm";
import { useState } from "react";
import { PlusCircle } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useQueryClient } from "@tanstack/react-query";

export function EmptyGroupState() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const queryClient = useQueryClient();
  
  const handleSheetOpenChange = (open: boolean) => {
    setIsSheetOpen(open);
  };
  
  const handleGroupCreationSuccess = () => {
    setIsSheetOpen(false);
    // Invalidate queries to refresh the data
    queryClient.invalidateQueries({ queryKey: ['userGroups'] });
  };

  return (
    <Card className="p-8 text-center space-y-6">
      <div>
        <img 
          src="/lovable-uploads/5b74b201-662c-4821-b518-2ea917f97d36.png" 
          alt="No Groups" 
          className="w-32 h-32 mx-auto opacity-75"
        />
        <h2 className="text-2xl font-bold mt-4">No Groups Yet</h2>
        <p className="text-muted-foreground mt-2">
          Create your first savings group to get started
        </p>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={handleSheetOpenChange}>
        <SheetTrigger asChild>
          <Button className="flex items-center gap-2">
            <PlusCircle className="w-4 h-4" />
            Create New Group
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
