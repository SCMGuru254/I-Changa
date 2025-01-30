import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GroupCreationForm } from "@/components/GroupCreationForm";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function QuickActions() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <Sheet>
        <SheetTrigger asChild>
          <Button className="w-full flex items-center gap-2">
            <Plus className="h-4 w-4" />
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
            <GroupCreationForm />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}