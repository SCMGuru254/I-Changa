import { Card } from "@/components/ui/card";
import { Pin } from "lucide-react";

export function GroupAgenda() {
  // In a real app, this would come from your backend
  const groupInfo = {
    name: "Medical Fund",
    agenda: "Supporting our colleague John's medical expenses for his upcoming surgery. Target: KES 100,000. Timeline: 2 months.",
    image: "/placeholder.svg", // Using the existing placeholder image
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
            alt="Group purpose illustration"
            className="rounded-lg w-full h-48 object-cover"
          />
        </div>
        
        <div className="md:w-2/3">
          <h2 className="text-2xl font-semibold text-primary mb-2">{groupInfo.name}</h2>
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