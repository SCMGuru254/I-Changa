
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/react-query";
import { Toaster } from "@/components/ui/toaster";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import GroupPage from "./pages/GroupPage";
import UserGuide from "./pages/UserGuide";
import { Route, Routes, Navigate } from "react-router-dom";
import { OfflineDetection } from "./components/OfflineDetection";
import { useAuth } from "./contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { DashboardLayout } from "./components/layout/DashboardLayout"; 
import { MainContent } from "./components/dashboard/MainContent";
import { Sidebar } from "./components/dashboard/Sidebar";

// Route guard for authenticated routes
const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading authentication...</p>
      </div>
    );
  }
  
  return user ? <>{children}</> : <Navigate to="/onboarding" replace />;
};

function Dashboard() {
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <MainContent />
          <Sidebar />
        </div>
      </div>
    </DashboardLayout>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/onboarding" replace />} />
      <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/group/:groupId" element={<RequireAuth><GroupPage /></RequireAuth>} />
      <Route path="/guide" element={<UserGuide />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <OfflineDetection />
          <AppRoutes />
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
