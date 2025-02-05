import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import GroupPage from "./pages/GroupPage";
import UserGuide from "./pages/UserGuide";
import { Loader2 } from "lucide-react";

function App() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={user ? <Navigate to="/dashboard" /> : <Onboarding />} 
        />
        <Route 
          path="/dashboard" 
          element={user ? <Index /> : <Navigate to="/auth" />} 
        />
        <Route 
          path="/auth" 
          element={!user ? <Auth /> : <Navigate to="/dashboard" />} 
        />
        <Route 
          path="/group/:id" 
          element={user ? <GroupPage /> : <Navigate to="/auth" />} 
        />
        <Route 
          path="/guide" 
          element={user ? <UserGuide /> : <Navigate to="/auth" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;