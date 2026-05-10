"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface RightPanelCardProps {
  title: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
}

export function RightPanelCard({ title, icon: Icon, children, className, headerAction }: RightPanelCardProps) {
  return (
    <div className={cn("lms-card p-6 space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 text-primary" />}
          {title}
        </h3>
        {headerAction}
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}
