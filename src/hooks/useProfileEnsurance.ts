
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export function useProfileEnsurance() {
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const ensureUserProfile = async () => {
      if (!user) return;
      
      console.log("Checking if user profile exists for:", user.id);
      
      // Check if profile exists
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .single();
      
      if (profileError && profileError.code === 'PGRST116') {
        // Profile doesn't exist, create it
        console.log("Profile doesn't exist, creating one for user:", user.id);
        
        const { error: insertError } = await supabase
          .from("profiles")
          .insert({
            id: user.id,
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            phone_number: user.phone || null
          });
          
        if (insertError) {
          console.error("Error creating profile:", insertError);
          toast({
            title: "Profile Creation Error",
            description: "Failed to create user profile. Please try again.",
            variant: "destructive",
          });
        } else {
          console.log("Profile created successfully");
        }
      } else if (profile) {
        console.log("Profile already exists:", profile);
      } else if (profileError) {
        console.error("Error checking profile:", profileError);
      }
    };

    ensureUserProfile();
  }, [user, toast]);
}
