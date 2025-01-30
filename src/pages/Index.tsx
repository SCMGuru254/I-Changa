import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/layout/Header";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MainContent } from "@/components/dashboard/MainContent";
import { Sidebar } from "@/components/dashboard/Sidebar";

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    toast({
      title: "Welcome back!",
      description: "You are successfully logged in.",
    });
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <Header />
      <div className="container py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <MainContent />
            <Sidebar />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;