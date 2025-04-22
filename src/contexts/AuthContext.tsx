
import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

type AuthContextType = {
  user: any | null;
  profile: any | null;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
};

// Create a context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  signOut: async () => {},
  isAuthenticated: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // In a real app, this would fetch the actual user session
  // For now, we'll use a mock user with a proper UUID format
  const [user] = useState<any>({ 
    id: "123e4567-e89b-12d3-a456-426614174000", // Valid UUID format
    email: "demo@example.com" 
  });
  const [profile] = useState<any>({ 
    id: "123e4567-e89b-12d3-a456-426614174000", 
    full_name: "Demo User" 
  });
  const [isAuthenticated] = useState(true);

  // Mock signOut function
  const signOut = async () => {
    console.log("Sign out clicked - authentication disabled for now");
  };

  return (
    <AuthContext.Provider value={{ user, profile, signOut, isAuthenticated }}>
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
