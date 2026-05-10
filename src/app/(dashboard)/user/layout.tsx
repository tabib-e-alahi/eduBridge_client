import { DashboardShell } from "@/components/dashboard/DashboardShell";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell role="USER">{children}</DashboardShell>;
}
