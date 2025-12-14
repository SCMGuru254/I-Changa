
import { Home, PlusCircle, User, FileText } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function BottomNav() {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    const navItems = [
        { icon: Home, label: "Home", path: "/dashboard" },
        { icon: PlusCircle, label: "Add", path: "/group/quick-add" }, // We might need to handle this route or logic
        { icon: FileText, label: "Guide", path: "/guide" },
        { icon: User, label: "Profile", path: "/profile" },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 lg:hidden z-50 pb-safe">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => (
                    <Link
                        key={item.label}
                        to={item.path}
                        className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive(item.path)
                                ? "text-primary font-medium"
                                : "text-muted-foreground hover:text-gray-900 dark:hover:text-gray-50"
                            }`}
                    >
                        <item.icon className={`h-6 w-6 ${isActive(item.path) ? "stroke-[2.5px]" : "stroke-2"}`} />
                        <span className="text-[10px]">{item.label}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
