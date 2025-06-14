
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WifiOff, Wifi, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export function OfflineDetection() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineNotice, setShowOfflineNotice] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineNotice(false);
      toast({
        title: "Back Online",
        description: "Your connection has been restored.",
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineNotice(true);
      toast({
        title: "Connection Lost",
        description: "You're currently offline. Some features may be limited.",
        variant: "destructive",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  const retryConnection = () => {
    if (navigator.onLine) {
      setIsOnline(true);
      setShowOfflineNotice(false);
      toast({
        title: "Connection Restored",
        description: "You're back online!",
      });
    } else {
      toast({
        title: "Still Offline",
        description: "Please check your internet connection.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {/* Status Badge */}
      <div className="fixed top-4 right-4 z-50">
        <Badge
          variant={isOnline ? "default" : "destructive"}
          className="flex items-center gap-2"
        >
          {isOnline ? (
            <Wifi className="h-3 w-3" />
          ) : (
            <WifiOff className="h-3 w-3" />
          )}
          {isOnline ? "Online" : "Offline"}
        </Badge>
      </div>

      {/* Offline Notice */}
      <AnimatePresence>
        {showOfflineNotice && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed top-16 left-4 right-4 z-40"
          >
            <Card className="p-4 bg-destructive/10 border-destructive/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <WifiOff className="h-5 w-5 text-destructive" />
                  <div>
                    <h4 className="font-semibold text-sm">You're Offline</h4>
                    <p className="text-sm text-muted-foreground">
                      Some features may be limited while offline
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={retryConnection}
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Retry
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowOfflineNotice(false)}
                  >
                    ×
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
