import { Home, PlusCircle, User, FileText, BarChart3 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { icon: Home, label: "Home", path: "/dashboard" },
    { icon: BarChart3, label: "Insights", path: "/insights" },
    { icon: PlusCircle, label: "Groups", path: "/dashboard", isCreate: true },
    { icon: FileText, label: "Guide", path: "/guide" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border lg:hidden z-50 safe-area-inset-bottom">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center flex-1 h-full py-2 transition-colors",
              item.isCreate && "relative",
              isActive(item.path) && !item.isCreate
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {item.isCreate ? (
              <div className="absolute -top-4 bg-primary rounded-full p-3 shadow-lg border-4 border-background">
                <item.icon className="h-5 w-5 text-primary-foreground" />
              </div>
            ) : (
              <item.icon className={cn(
                "h-5 w-5 mb-1",
                isActive(item.path) ? "stroke-[2.5px]" : "stroke-2"
              )} />
            )}
            <span className={cn(
              "text-[10px] font-medium",
              item.isCreate && "mt-4"
            )}>
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
