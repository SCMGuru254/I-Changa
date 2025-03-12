
import { createContext, useContext, useState } from "react";

type AuthContextType = {
  user: any | null;
  profile: any | null;
  signOut: () => Promise<void>;
};

// Create a default context with mock values
const AuthContext = createContext<AuthContextType>({
  user: { id: "mock-user-id" }, // Provide a mock user instead of null
  profile: { id: "mock-profile-id" },
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Create a mock user and profile
  const [user] = useState<any>({ id: "mock-user-id" });
  const [profile] = useState<any>({ id: "mock-profile-id" });

  // Mock signOut function
  const signOut = async () => {
    console.log("Sign out clicked - authentication disabled for now");
  };

  return (
    <AuthContext.Provider value={{ user, profile, signOut }}>
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
