
import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  profile: any | null;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
};

// Create a context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  signOut: async () => {},
  isAuthenticated: false,
  isLoading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // For now, we'll use a demo user that actually works with RLS policies
  useEffect(() => {
    // Set up authentication state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event);
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
        
        if (event === 'SIGNED_IN') {
          toast({
            title: "Signed in successfully",
            description: "Welcome back!",
          });
        }
        
        if (event === 'SIGNED_OUT') {
          toast({
            title: "Signed out",
            description: "You have been signed out.",
          });
        }
      }
    );
    
    // Initial auth check
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session ? "Logged in" : "Not logged in");
      
      if (session) {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      } else {
        // Auto sign in for demo purposes
        signInDemo();
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Auto sign in for demo purposes
  const signInDemo = async () => {
    try {
      console.log("Attempting demo sign-in");
      // Sign in with demo credentials
      const { data, error } = await supabase.auth.signInWithPassword({
        email: "demo@example.com",
        password: "password123"
      });
      
      if (error) {
        console.error("Sign-in error:", error);
        // If sign in fails, try to sign up
        console.log("Signing up demo user instead");
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: "demo@example.com",
          password: "password123",
          options: {
            data: {
              full_name: "Demo User"
            }
          }
        });
        
        if (signUpError) {
          console.error("Sign-up error:", signUpError);
          toast({
            title: "Authentication Error",
            description: signUpError.message,
            variant: "destructive",
          });
          throw signUpError;
        }
        
        // We have a new user
        console.log("Demo user created:", signUpData.user);
        toast({
          title: "Demo Account Created",
          description: "You can now use all features of the app.",
        });
      } else {
        // We have signed in successfully
        console.log("Demo user signed in:", data.user);
        toast({
          title: "Demo Sign-in Successful",
          description: "You can now use all features of the app.",
        });
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setIsLoading(false);
    }
  };
  
  const signOut = async () => {
    try {
      console.log("Signing out");
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
      toast({
        title: "Signed Out",
        description: "You have been signed out successfully.",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        session, 
        profile, 
        signOut, 
        isAuthenticated: !!user,
        isLoading 
      }}
    >
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
