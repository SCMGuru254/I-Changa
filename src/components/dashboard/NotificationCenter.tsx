
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: string;
  read: boolean;
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New Contribution',
      message: 'John Doe contributed KES 5,000 to Family Savings',
      type: 'success',
      timestamp: '2 hours ago',
      read: false,
    },
    {
      id: '2',
      title: 'Payment Due',
      message: 'Monthly contribution deadline is tomorrow',
      type: 'warning',
      timestamp: '1 day ago',
      read: false,
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Badge variant="destructive">{unreadCount}</Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            Mark all read
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <EmptyState
            icon={<Bell className="h-8 w-8" />}
            title="No Notifications"
            description="You're all caught up! New notifications will appear here when there's activity in your groups."
          />
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 rounded-lg border transition-colors ${
                notification.read ? 'bg-muted/20' : 'bg-card hover:bg-accent/50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{notification.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {notification.timestamp}
                  </p>
                </div>
                <div className="flex gap-1">
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markAsRead(notification.id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        
        {notifications.length > 0 && (
          <div className="pt-2 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllNotifications}
              className="w-full text-muted-foreground hover:text-foreground"
            >
              Clear All Notifications
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
