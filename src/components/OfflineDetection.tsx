
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export function OfflineDetection() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Enable cache persistence (implemented through the query client)
    const onlineStatus = () => {
      if (navigator.onLine) {
        toast({
          title: "You are online",
          description: "Data will sync with the server",
        });
        // Refetch data when back online
        queryClient.invalidateQueries();
      } else {
        toast({
          title: "You are offline",
          description: "The app will continue to work with cached data",
          variant: "destructive",
        });
      }
    };

    window.addEventListener('online', onlineStatus);
    window.addEventListener('offline', onlineStatus);

    return () => {
      window.removeEventListener('online', onlineStatus);
      window.removeEventListener('offline', onlineStatus);
    };
  }, [queryClient, toast]);

  return null;
}
