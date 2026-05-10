"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  variant?: "blue" | "emerald" | "amber" | "rose" | "primary";
}

export function StatCard({ title, value, subtitle, icon: Icon, variant = "primary" }: StatCardProps) {
  const variants = {
    blue: "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
    amber: "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
    rose: "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
    primary: "bg-primary/5 text-primary border-primary/10 dark:bg-primary/10 dark:text-primary dark:border-primary/20",
  };

  return (
    <div className="lms-card p-5 space-y-4">
      <div className="flex items-center gap-3">
        <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center border", variants[variant])}>
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-widest text-[10px]">{title}</h3>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold tracking-tight">{value}</span>
        <span className="text-xs text-muted-foreground font-medium">{subtitle}</span>
      </div>
    </div>
  );
}
