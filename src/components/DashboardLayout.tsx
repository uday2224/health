import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { BottomTabBar } from "@/components/BottomTabBar";
import { currentUser } from "@/lib/mock-data";

interface DashboardLayoutProps {
  role?: string;
}

export function DashboardLayout({ role }: DashboardLayoutProps) {
  const userRole = role || currentUser.role;

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar role={userRole} userName={currentUser.name} />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 pb-20 md:pb-0">
          <Outlet />
        </main>
        {userRole !== "admin" && <BottomTabBar role={userRole} />}
      </div>
    </div>
  );
}
