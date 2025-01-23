import { useToast } from "@/hooks/use-toast";

export function DashboardHeader() {
  const { toast } = useToast();

  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold text-primary mb-2">
        iChanga
      </h1>
      <p className="text-gray-600">
        Simplified Group Contributions with M-Pesa Integration
      </p>
      <p className="text-sm text-gray-500 mt-2">
        Secure • Fast • Reliable
      </p>
    </div>
  );
}