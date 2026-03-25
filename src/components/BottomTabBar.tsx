import { useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Calendar, Stethoscope, CreditCard, User,
  Briefcase, DollarSign
} from "lucide-react";

const patientTabs = [
  { to: "/patient/dashboard", label: "Home", icon: LayoutDashboard },
  { to: "/patient/my-bookings", label: "Bookings", icon: Calendar },
  { to: "/patient/book-nurse", label: "Book", icon: Stethoscope },
  { to: "/patient/payments", label: "Payments", icon: CreditCard },
  { to: "/patient/profile", label: "Profile", icon: User },
];

const nurseTabs = [
  { to: "/nurse/dashboard", label: "Home", icon: LayoutDashboard },
  { to: "/nurse/jobs", label: "Jobs", icon: Briefcase },
  { to: "/nurse/earnings", label: "Earnings", icon: DollarSign },
  { to: "/nurse/profile", label: "Profile", icon: User },
];

export function BottomTabBar({ role }: { role: string }) {
  const location = useLocation();
  const tabs = role === "nurse" ? nurseTabs : patientTabs;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 safe-area-bottom">
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => {
          const active = location.pathname === tab.to;
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1 min-w-[3rem] transition-colors",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              <tab.icon className={cn("w-5 h-5", active && "fill-primary/10")} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
