import { Card } from "@/components/ui/card";
import { Pin } from "lucide-react";

export function GroupAgenda() {
  // In a real app, this would come from your backend
  const groupInfo = {
    name: "Medical Fund",
    agenda: "Supporting our colleague John's medical expenses for his upcoming surgery. Target: KES 100,000. Timeline: 2 months.",
    image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742", // Updated to use an appropriate medical-themed image
    admin: "Sarah Kamau",
    lastUpdated: "2024-02-20",
  };

  return (
    <Card className="p-6 mb-8 relative overflow-hidden">
      <div className="absolute top-4 right-4">
        <Pin className="h-5 w-5 text-primary" />
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <img
            src={groupInfo.image}
            alt="Medical facility representing our fund's purpose"
            className="rounded-lg w-full h-48 object-cover"
          />
        </div>
        
        <div className="md:w-2/3">
          <div className="flex items-center gap-2 mb-4">
            <AppLogo className="h-8 w-8" />
            <h2 className="text-2xl font-semibold text-primary">{groupInfo.name}</h2>
          </div>
          <p className="text-gray-600 mb-4 leading-relaxed">{groupInfo.agenda}</p>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Group Admin: {groupInfo.admin}</span>
            <span>Last updated: {new Date(groupInfo.lastUpdated).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

// Simple logo component using the existing design system
function AppLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-primary rounded-lg p-2 text-white font-bold ${className}`}>
      iC
    </div>
  );
}