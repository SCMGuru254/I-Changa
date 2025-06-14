
import { UserProfile } from "@/components/profile/UserProfile";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Header } from "@/components/layout/Header";

export default function ProfilePage() {
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <Header />
        <UserProfile />
      </div>
    </DashboardLayout>
  );
}
