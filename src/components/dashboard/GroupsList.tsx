import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

export function GroupsList() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: userGroups, isLoading: groupsLoading } = useQuery({
    queryKey: ['userGroups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('groups')
        .select(`
          id,
          name,
          description,
          target_amount,
          end_date,
          status,
          group_members!inner(role)
        `)
        .eq('group_members.member_id', user?.id);

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Your Groups</h2>
      {groupsLoading ? (
        <Card className="p-6">
          <p className="text-center text-muted-foreground">Loading groups...</p>
        </Card>
      ) : userGroups?.length ? (
        <div className="grid gap-4">
          {userGroups.map((group) => (
            <Card 
              key={group.id} 
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/group/${group.id}`)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">{group.name}</h3>
                  <p className="text-muted-foreground">{group.description}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">Target: KES {group.target_amount?.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">
                    Ends: {new Date(group.end_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-6">
          <p className="text-center text-muted-foreground">
            You haven't joined any groups yet. Create one to get started!
          </p>
        </Card>
      )}
    </div>
  );
}