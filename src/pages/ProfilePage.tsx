
import { UserProfile } from "@/components/profile/UserProfile";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Header } from "@/components/layout/Header";

import { PaymentMethods } from "@/components/profile/PaymentMethods";

export default function ProfilePage() {
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Header />
        <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

        <div className="space-y-8">
          <UserProfile />
          <PaymentMethods />
        </div>
      </div>
    </DashboardLayout>
  );
}
