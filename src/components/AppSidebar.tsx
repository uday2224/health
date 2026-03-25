import { useLocation, Link } from "react-router-dom";
import { TezLogo } from "@/components/TezLogo";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Calendar, FileText, CreditCard, User, Stethoscope,
  Briefcase, MapPin, DollarSign, Users, ShieldCheck, Settings, Package,
  Activity, ChevronLeft, ChevronRight, LogOut
} from "lucide-react";
import { useState } from "react";

const patientLinks = [
  { to: "/patient/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/patient/book-nurse", label: "Book Nurse", icon: Stethoscope },
  { to: "/patient/my-bookings", label: "My Bookings", icon: Calendar },
  { to: "/patient/prescriptions", label: "Prescriptions", icon: FileText },
  { to: "/patient/subscriptions", label: "Plans", icon: Package },
  { to: "/patient/payments", label: "Payments", icon: CreditCard },
  { to: "/patient/profile", label: "Profile", icon: User },
];

const nurseLinks = [
  { to: "/nurse/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/nurse/jobs", label: "Job Board", icon: Briefcase },
  { to: "/nurse/earnings", label: "Earnings", icon: DollarSign },
  { to: "/nurse/profile", label: "Profile", icon: User },
];

const adminLinks = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/nurses", label: "Nurses", icon: ShieldCheck },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/bookings", label: "Bookings", icon: Calendar },
  { to: "/admin/payments", label: "Revenue", icon: DollarSign },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

function getLinks(role: string) {
  if (role === "nurse") return nurseLinks;
  if (role === "admin") return adminLinks;
  return patientLinks;
}

interface AppSidebarProps {
  role: string;
  userName: string;
}

export function AppSidebar({ role, userName }: AppSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const links = getLinks(role);

  return (
    <aside className={cn(
      "hidden md:flex flex-col h-screen bg-card border-r border-border transition-all duration-300 sticky top-0",
      collapsed ? "w-16" : "w-60"
    )}>
      <div className="flex items-center justify-between p-4 border-b border-border">
        <TezLogo collapsed={collapsed} />
        <button onClick={() => setCollapsed(!collapsed)} className="text-muted-foreground hover:text-foreground transition-colors">
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
        {links.map((link) => {
          const active = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground border-l-2 border-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <link.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold shrink-0">
            {userName.charAt(0)}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{userName}</p>
              <p className="text-xs text-muted-foreground capitalize">{role}</p>
            </div>
          )}
        </div>
        <Link to="/" className={cn(
          "flex items-center gap-3 px-3 py-2 mt-2 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors",
        )}>
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </Link>
      </div>
    </aside>
  );
}
