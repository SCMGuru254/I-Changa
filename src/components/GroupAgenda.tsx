import { Card } from "@/components/ui/card";
import { Pin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export function GroupAgenda() {
  const { data: groups, isLoading } = useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('groups')
        .select(`
          *,
          profiles:creator_id (
            full_name
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <Card className="p-6 mb-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </Card>
    );
  }

  if (!groups || groups.length === 0) {
    return (
      <Card className="p-6 mb-8">
        <p className="text-center text-muted-foreground">No groups found. Create your first group!</p>
      </Card>
    );
  }

  // Display the most recent group
  const latestGroup = groups[0];
  
  return (
    <Card className="p-6 mb-8 relative overflow-hidden">
      <div className="absolute top-4 right-4">
        <Pin className="h-5 w-5 text-primary" />
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <img
            src="/lovable-uploads/4713051a-d1b2-4b5b-90e3-6df1a428dd07.png"
            alt="Group representation"
            className="rounded-lg w-full h-48 object-contain bg-gray-50"
          />
        </div>
        
        <div className="md:w-2/3">
          <div className="flex items-center gap-2 mb-4">
            <AppLogo className="h-8 w-8" />
            <h2 className="text-2xl font-semibold text-primary">{latestGroup.name}</h2>
          </div>
          <p className="text-gray-600 mb-4 leading-relaxed">{latestGroup.description}</p>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Target Amount: KES {latestGroup.target_amount?.toLocaleString()}</span>
            <span>End Date: {new Date(latestGroup.end_date).toLocaleDateString()}</span>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            <span>Created by: {latestGroup.profiles?.full_name || 'Unknown'}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

function AppLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-primary rounded-lg p-2 text-white font-bold ${className}`}>
      iC
    </div>
  );
}