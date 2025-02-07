
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  user: User | null;
  profile: any | null;
  signOut: () => Promise<void>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  signOut: async () => {},
  isLoading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error("Profile fetch error:", error);
        return null;
      }
      return data;
    } catch (error) {
      console.error("Profile fetch exception:", error);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session fetch error:", error);
          return;
        }
        
        if (session?.user && mounted) {
          setUser(session.user);
          const profileData = await fetchProfile(session.user.id);
          if (mounted && profileData) {
            setProfile(profileData);
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        try {
          if (session?.user) {
            setUser(session.user);
            const profileData = await fetchProfile(session.user.id);
            if (mounted && profileData) {
              setProfile(profileData);
            }
          } else {
            setUser(null);
            setProfile(null);
          }
        } catch (error) {
          console.error("Auth state change error:", error);
        } finally {
          if (mounted) {
            setIsLoading(false);
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      toast({
        title: "Signed out successfully",
        description: "You have been logged out.",
      });
    } catch (error) {
      console.error("Sign out error:", error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
