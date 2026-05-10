"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/shared/ModeToggle";
import { NotificationBell } from "@/components/shared/NotificationBell";

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Premium Distraction-Free Header */}
      <header className="h-14 border-b bg-card px-4 md:px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/user/courses">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="w-px h-6 bg-border mx-1 hidden sm:block" />
          <div className="flex items-center gap-2 group cursor-pointer">
             <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center transition-transform group-hover:rotate-3">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
             </div>
             <span className="font-black tracking-tight hidden sm:block">EduBridge AI</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <NotificationBell />
          <div className="w-px h-6 bg-border mx-1" />
          <ModeToggle />
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
