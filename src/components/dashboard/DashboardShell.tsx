"use client";

import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardTopbar } from "./DashboardTopbar";
import { useAuth } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loading } from "@/components/shared/Loading";

interface DashboardShellProps {
  children: React.ReactNode;
  role: "USER" | "ADMIN" | "MANAGER";
}

export function DashboardShell({ children, role }: DashboardShellProps) {
  const { data: session, isPending } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
      return;
    }

    if (session?.user) {
      const user = session.user as any;
      
      // Handle Pending Approval for Instructors
      if (user.status === "PENDING_APPROVAL" && window.location.pathname !== "/pending-approval") {
        router.push("/pending-approval");
        return;
      }

      // Role-based redirection guard
      const userRole = user.role; // STUDENT, MANAGER, ADMIN, INSTRUCTOR
      const currentPath = window.location.pathname;

      if (userRole === "STUDENT" && !currentPath.startsWith("/user")) {
        router.push("/user");
      } else if ((userRole === "MANAGER" || userRole === "INSTRUCTOR") && !currentPath.startsWith("/manager")) {
        router.push("/manager");
      } else if (userRole === "ADMIN" && !currentPath.startsWith("/admin")) {
        router.push("/admin");
      }
    }
  }, [session, isPending, router, role]);

  if (isPending) return <Loading />;
  if (!session) return null;

  return (
    <div className="flex min-h-screen bg-background overflow-hidden">
      {/* Sidebar - Desktop Only */}
      <DashboardSidebar role={role} className="hidden lg:flex" />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen">
        <DashboardTopbar role={role} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto p-4 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
