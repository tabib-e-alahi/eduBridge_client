"use client";

import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardTopbar } from "./DashboardTopbar";
import { useAuth } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loading } from "@/components/shared/Loading";
import type { Role } from "@/types";

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const { data: session, isPending } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirection logic removed - handled by proxy.ts safeguard
  }, [session, isPending, router]);

  if (isPending) return <Loading />;
  if (!session) return null;

  // Role comes from the authenticated session (source of truth).
  const sessionRole = (((session.user as unknown as { role?: Role })?.role) ?? "STUDENT") as Role;

  return (
    <div className="flex min-h-screen bg-background overflow-hidden">
      {/* Sidebar - Desktop Only */}
      <DashboardSidebar role={sessionRole} className="hidden lg:flex" />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen">
        <DashboardTopbar role={sessionRole} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto p-4 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
