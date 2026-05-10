"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BookOpen, 
  Clock, 
  CheckSquare, 
  MessageSquare, 
  Award, 
  Settings,
  HelpCircle,
  LogOut,
  Command,
  PlayCircle,
  FileText,
  Map,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { hasPermission, Permission, PERMISSIONS } from "@/lib/permissions";

interface SidebarProps {
  role: "USER" | "ADMIN" | "MANAGER";
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();

  const studentLinks = [
    { label: "Overview", icon: LayoutDashboard, href: "/user" },
    { label: "My Courses", icon: BookOpen, href: "/user/courses" },
    { label: "Live Sessions", icon: PlayCircle, href: "/user/classes" },
    { label: "Assignments", icon: FileText, href: "/user/assignments" },
    { label: "AI Learning Path", icon: Map, href: "/user/roadmaps" },
    { label: "AI Mentor", icon: MessageSquare, href: "/user/tutor" },
    { label: "Certificates", icon: Award, href: "/user/certificates" },
  ];

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col h-screen sticky top-0 z-50">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-border">
        <Link href="/user" className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white">
            <Command className="h-5 w-5" />
          </div>
          <span>EduBridge</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        <p className="px-3 pb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Main Menu</p>
        {studentLinks.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "sidebar-item",
                isActive ? "sidebar-item-active" : "sidebar-item-inactive"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}

        {role === "MANAGER" && (
           <>
              <div className="pt-6 px-3 pb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Management</div>
              <Link href="/manager" className={cn("sidebar-item", pathname.startsWith("/manager") ? "sidebar-item-active" : "sidebar-item-inactive")}>
                <Users className="h-4 w-4" />
                Instructor Panel
              </Link>
           </>
        )}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-border space-y-1">
        <Link
          href="/user/profile"
          className={cn(
            "sidebar-item",
            pathname === "/user/profile" ? "sidebar-item-active" : "sidebar-item-inactive"
          )}
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
        <Link
          href="/support"
          className="sidebar-item sidebar-item-inactive"
        >
          <HelpCircle className="h-4 w-4" />
          Support
        </Link>
        <button className="sidebar-item sidebar-item-inactive w-full text-left text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-500/10">
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
