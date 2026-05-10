"use client";

import { Search, Bell, User as UserIcon, Menu, Settings, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/shared/ModeToggle";
import { NotificationBell } from "@/components/shared/NotificationBell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DashboardSidebar } from "./DashboardSidebar";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface TopbarProps {
  role: "USER" | "ADMIN" | "MANAGER";
}

export function DashboardTopbar({ role }: TopbarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/auth/login");
        },
      },
    });
  };

  return (
    <header className="h-20 border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-4 md:px-8">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Trigger */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[280px] border-none">
              <DashboardSidebar role={role} />
            </SheetContent>
          </Sheet>
        </div>

        {/* Search area */}
        <div className="flex-1 max-w-md hidden sm:block">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search platform..." 
              className="pl-10 h-10 bg-muted/40 border-none focus-visible:ring-1 focus-visible:ring-primary/20 rounded-xl transition-all hover:bg-muted/60"
            />
          </div>
        </div>
      </div>

      {/* Action area */}
      <div className="flex items-center gap-2 md:gap-4">
        <NotificationBell />
        <ModeToggle />
        <div className="h-6 w-px bg-border mx-1 md:mx-2" />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-11 w-11 rounded-xl p-0 hover:bg-muted/50 transition-all">
              <Avatar className="h-9 w-9 border-2 border-background shadow-sm">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary/10 text-primary font-bold">JD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 mt-2 p-2 rounded-2xl shadow-xl border-border" align="end">
            <DropdownMenuLabel className="p-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-border">
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">JD</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-sm font-bold">John Doe</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Account Profile</p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="p-1">
              <DropdownMenuItem className="rounded-lg h-10 gap-3 cursor-pointer">
                <UserIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">My Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg h-10 gap-3 cursor-pointer">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Settings</span>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleLogout}
              className="text-destructive rounded-lg h-10 gap-3 cursor-pointer focus:bg-destructive/10 focus:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm font-bold">Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
