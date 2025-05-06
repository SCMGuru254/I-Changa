
import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

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
  
  // For now, we'll use a demo user that actually works with RLS policies
  useEffect(() => {
    // Auto sign in for demo purposes
    const signInDemo = async () => {
      try {
        // Sign in with demo credentials
        const { data, error } = await supabase.auth.signInWithPassword({
          email: "demo@example.com",
          password: "password123"
        });
        
        if (error) {
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
          
          if (signUpError) throw signUpError;
          
          // We have a new user
          setUser(signUpData.user);
          setSession(signUpData.session);
        } else {
          // We have an existing user
          setUser(data.user);
          setSession(data.session);
        }
      } catch (error) {
        console.error("Authentication error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Set up authentication state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );
    
    // Initial auth check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
        setUser(session?.user ?? null);
      } else {
        // Auto sign in for demo
        signInDemo();
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
    } catch (error) {
      console.error("Error signing out:", error);
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
