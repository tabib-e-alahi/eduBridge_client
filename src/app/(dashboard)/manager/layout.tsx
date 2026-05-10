import { DashboardShell } from "@/components/dashboard/DashboardShell";

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell role="MANAGER">{children}</DashboardShell>;
}
