"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  BookOpen, 
  MessageSquare, 
  Award, 
  Settings,
  HelpCircle,
  LogOut,
  Command,
  PlayCircle,
  FileText,
  Map,
  Users,
  Megaphone,
  Sparkles,
  DollarSign,
  Star,
  Video,
  UserCircle,
  PenTool
} from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import type { LucideIcon } from "lucide-react";
import type { Role } from "@/types";

interface SidebarProps {
  role: Role;
  className?: string;
}

interface SidebarLink {
  label: string;
  icon: LucideIcon;
  href: string;
  badge?: "AI";
  dividerBefore?: boolean;
}

export function DashboardSidebar({ role, className }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  };

  const studentLinks: SidebarLink[] = [
    { label: "Overview", icon: LayoutDashboard, href: "/user" },
    { label: "My Courses", icon: BookOpen, href: "/user/courses" },
    { label: "Live Sessions", icon: PlayCircle, href: "/user/classes" },
    { label: "Assignments", icon: FileText, href: "/user/assignments" },
    { label: "AI Learning Path", icon: Map, href: "/user/roadmaps" },
    { label: "AI Mentor", icon: MessageSquare, href: "/user/tutor" },
    { label: "Certificates", icon: Award, href: "/user/certificates" },
  ];

  const instructorLinks: SidebarLink[] = [
    { label: "Studio", icon: LayoutDashboard, href: "/manager" },
    { label: "Courses", icon: BookOpen, href: "/manager/courses" },
    { label: "AI Studio", icon: Sparkles, href: "/manager/ai-tools", badge: "AI" },
    { label: "Earnings", icon: DollarSign, href: "/manager/earnings" },
    { label: "Students", icon: Users, href: "/manager/students" },
    { label: "Assignments", icon: FileText, href: "/manager/assignments" },
    { label: "Live Classes", icon: Video, href: "/manager/classes" },
    { label: "Reviews", icon: Star, href: "/manager/reviews" },
    { label: "Announcements", icon: Megaphone, href: "/manager/announcements" },
    { label: "My Profile", icon: UserCircle, href: "/manager/profile" },
    { label: "Messages", icon: MessageSquare, href: "/manager/messages", dividerBefore: true },
    { label: "Blog", icon: PenTool, href: "/manager/blog" },
  ];

  const adminLinks: SidebarLink[] = [
    { label: "System", icon: LayoutDashboard, href: "/admin" },
    { label: "Users", icon: Users, href: "/admin/users" },
    { label: "Instructors", icon: Award, href: "/admin/instructors" },
    { label: "Courses", icon: BookOpen, href: "/admin/courses" },
    { label: "Support Tickets", icon: HelpCircle, href: "/admin/support" },
    { label: "Broadcast", icon: Megaphone, href: "/admin/announcements" },
    { label: "Analytics", icon: FileText, href: "/admin/analytics" },
    { label: "Settings", icon: Settings, href: "/admin/settings" },
  ];

  const currentLinks =
    role === "ADMIN"
      ? adminLinks
      : role === "MANAGER" || role === "INSTRUCTOR"
        ? instructorLinks
        : studentLinks;

  const brandHref =
    role === "ADMIN" ? "/admin" : role === "MANAGER" || role === "INSTRUCTOR" ? "/manager" : "/user";

  return (
    <aside className={cn("w-[280px] border-r border-border bg-card flex flex-col h-screen sticky top-0 z-50", className)}>
      {/* Brand */}
      <div className="h-20 flex items-center px-6 border-b border-border">
        <Link href={brandHref} className="flex items-center gap-3 font-bold text-xl tracking-tight">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <Command className="h-6 w-6" />
          </div>
          <span>EduBridge</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1.5">
        <p className="px-3 pb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Main Menu</p>
        {currentLinks.map((item) => {
          const isActive = pathname === item.href;
          return (
            <div key={item.href}>
              {item.dividerBefore && <div className="my-3 border-t border-border" />}
              <Link
                href={item.href}
                className={cn(
                  "sidebar-item",
                  isActive ? "sidebar-item-active" : "sidebar-item-inactive"
                )}
              >
                <item.icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                <span>{item.label}</span>
                {item.badge === "AI" && (
                  <span className="ml-auto rounded-full bg-violet-500/15 px-1.5 py-0.5 text-[9px] font-bold text-violet-600">
                    AI
                  </span>
                )}
              </Link>
            </div>
          );
        })}

      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-border space-y-1.5">
        <Link
          href={role === "ADMIN" ? "/admin/profile" : role === "MANAGER" ? "/manager/profile" : "/user/profile"}
          className={cn(
            "sidebar-item",
            pathname === "/user/profile" ? "sidebar-item-active" : "sidebar-item-inactive"
          )}
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
        <button 
          onClick={handleLogout}
          className="sidebar-item sidebar-item-inactive w-full text-left text-destructive hover:bg-destructive/5 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
