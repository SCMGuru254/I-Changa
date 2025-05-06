
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Wifi, WifiOff } from "lucide-react";

export function OfflineDetection() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Enable cache persistence through the query client
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "You are online",
        description: "Data will sync with the server",
        action: <Wifi className="h-4 w-4" />,
      });
      // Refetch data when back online
      queryClient.invalidateQueries();
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "You are offline",
        description: "The app will continue to work with cached data",
        variant: "destructive",
        action: <WifiOff className="h-4 w-4" />,
      });
    };

    // Set initial state
    setIsOnline(navigator.onLine);
    
    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check connection status on mount
    if (!navigator.onLine) {
      handleOffline();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [queryClient, toast]);

  return (
    <div className={`fixed top-0 right-0 m-4 z-50 ${isOnline ? 'hidden' : 'block'}`}>
      {!isOnline && (
        <div className="bg-destructive text-destructive-foreground px-4 py-2 rounded-md flex items-center gap-2">
          <WifiOff className="h-4 w-4" />
          <span>Offline Mode</span>
        </div>
      )}
    </div>
  );
}
