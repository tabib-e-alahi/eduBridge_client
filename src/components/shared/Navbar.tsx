"use client";

import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, X, LayoutDashboard, User as UserIcon, LogOut, Settings, Bell, BookOpen } from "lucide-react";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NotificationBell } from "./NotificationBell";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

import { useAuth, authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function Navbar() {
  const { data: session, isPending } = useAuth();
  const isLoggedIn = !!session;
  const role = (session?.user as any)?.role || "USER";
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { name: "Courses", href: "/courses" },
    { name: "Mentors", href: "/mentors" },
    { name: "AI Tutor", href: "/ai-tutor" },
    { name: "Pricing", href: "/pricing" },
    { name: "Resources", href: "/blog" },
  ];

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled ? "py-3 bg-background/80 backdrop-blur-lg border-b border-border shadow-sm" : "py-5 bg-transparent"
    )}>
      <div className="container mx-auto px-4 md:px-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-2.5 transition-transform hover:scale-[1.02] active:scale-95">
              <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                <BookOpen className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-foreground">
                EduBridge<span className="text-primary">AI</span>
              </span>
            </Link>
            
            <div className="hidden gap-7 lg:flex items-center">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-[14px] font-medium transition-colors hover:text-primary",
                    pathname === link.href ? "text-primary font-semibold" : "text-muted-foreground"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
              <ModeToggle />
              <div className="w-[1px] h-4 bg-border mx-2" />
              {!isLoggedIn ? (
                <div className="flex items-center gap-3">
                  <Link href="/login">
                    <Button variant="ghost" className="font-semibold text-sm hover:bg-primary/5 hover:text-primary px-5">
                      Log in
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 shadow-md shadow-primary/20 rounded-lg px-6 h-10">
                      Join Free
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <NotificationBell />
                  <DropdownMenu>
                    <DropdownMenuTrigger className="relative h-10 w-10 rounded-full border border-border overflow-hidden transition-all hover:ring-2 hover:ring-primary/20 outline-none">
                      <Avatar className="h-full w-full">
                        <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || "User"} />
                        <AvatarFallback className="font-bold text-xs bg-muted text-muted-foreground">{session?.user?.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64 rounded-xl p-2 mt-4 border-border shadow-xl" align="end">
                      <DropdownMenuGroup>
                        <DropdownMenuLabel className="p-4">
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-bold leading-none">{session?.user?.name}</p>
                            <p className="text-xs text-muted-foreground mt-1 capitalize">{role.toLowerCase()} Account</p>
                          </div>
                        </DropdownMenuLabel>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <div className="p-1 space-y-1">
                        <DropdownMenuItem asChild className="rounded-lg p-2.5 font-medium cursor-pointer transition-colors focus:bg-primary/5 focus:text-primary">
                          <Link href="/user/profile" className="flex items-center gap-3">
                            <UserIcon className="h-4 w-4" />
                            My Profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="rounded-lg p-2.5 font-medium cursor-pointer transition-colors focus:bg-primary/5 focus:text-primary">
                          <Link href={role === "ADMIN" ? "/admin" : role === "MANAGER" || role === "INSTRUCTOR" ? "/manager" : "/user"} className="flex items-center gap-3">
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="rounded-lg p-2.5 font-medium cursor-pointer transition-colors focus:bg-primary/5 focus:text-primary">
                          <Link href="/settings" className="flex items-center gap-3">
                            <Settings className="h-4 w-4" />
                            Settings
                          </Link>
                        </DropdownMenuItem>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={async () => {
                          await authClient.signOut();
                          router.push("/login");
                        }} 
                        className="rounded-lg p-2.5 font-medium text-destructive cursor-pointer transition-colors focus:bg-destructive/5 focus:text-destructive"
                      >
                        <div className="flex items-center gap-3">
                          <LogOut className="h-4 w-4" />
                          Sign out
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden flex items-center gap-3">
              <ModeToggle />
              
              {isLoggedIn && (
                <>
                  <NotificationBell />
                  <DropdownMenu>
                    <DropdownMenuTrigger className="relative h-9 w-9 rounded-full border border-border overflow-hidden transition-all hover:ring-2 hover:ring-primary/20 outline-none">
                      <Avatar className="h-full w-full">
                        <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || "User"} />
                        <AvatarFallback className="font-bold text-xs bg-muted text-muted-foreground">{session?.user?.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 rounded-xl p-2 mt-4 border-border shadow-xl" align="end">
                      <DropdownMenuGroup>
                        <DropdownMenuLabel className="p-3">
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-bold leading-none">{session?.user?.name}</p>
                            <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-widest">{role} Account</p>
                          </div>
                        </DropdownMenuLabel>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <div className="p-1 space-y-1">
                        <DropdownMenuItem asChild className="rounded-lg p-2.5 font-medium cursor-pointer focus:bg-primary/5 focus:text-primary">
                          <Link href="/user/profile" className="flex items-center gap-3">
                            <UserIcon className="h-4 w-4" />
                            Profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="rounded-lg p-2.5 font-medium cursor-pointer focus:bg-primary/5 focus:text-primary">
                          <Link href={role === "ADMIN" ? "/admin" : role === "MANAGER" || role === "INSTRUCTOR" ? "/manager" : "/user"} className="flex items-center gap-3">
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                          </Link>
                        </DropdownMenuItem>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={async () => {
                          await authClient.signOut();
                          router.push("/login");
                        }} 
                        className="rounded-lg p-2.5 font-medium text-destructive cursor-pointer focus:bg-destructive/5 focus:text-destructive"
                      >
                        <div className="flex items-center gap-3">
                          <LogOut className="h-4 w-4" />
                          Sign out
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-lg hover:bg-muted/50 border border-border">
                    <Menu className="h-5 w-5 text-foreground" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:w-[350px] border-l border-border p-0 bg-background">
                  <div className="flex flex-col h-full">
                    <div className="p-6 border-b border-border flex items-center justify-between">
                      <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                          <BookOpen className="text-primary-foreground w-4 h-4" />
                        </div>
                        <span className="text-lg font-bold tracking-tight">EduBridge AI</span>
                      </Link>
                    </div>
                    
                    <nav className="flex-1 p-6 space-y-2">
                      {links.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={cn(
                            "flex items-center h-12 px-4 rounded-lg text-base font-semibold transition-all",
                            pathname === link.href 
                              ? "bg-primary/10 text-primary" 
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                        >
                          {link.name}
                        </Link>
                      ))}
                    </nav>

                    <div className="p-6 border-t border-border space-y-3">
                      {!isLoggedIn ? (
                        <>
                          <Link href="/login" className="block">
                            <Button variant="outline" className="w-full h-12 rounded-lg font-bold">Log in</Button>
                          </Link>
                          <Link href="/register" className="block">
                            <Button className="w-full h-12 rounded-lg font-bold bg-primary text-primary-foreground">Join for Free</Button>
                          </Link>
                        </>
                      ) : (
                        <Button 
                          variant="outline" 
                          onClick={async () => {
                            await authClient.signOut();
                            router.push("/login");
                          }}
                          className="w-full h-12 rounded-lg font-bold border-destructive/20 text-destructive hover:bg-destructive/5"
                        >
                          Sign out
                        </Button>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
