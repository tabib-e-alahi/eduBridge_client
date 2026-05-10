"use client";

import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
  color?: "primary" | "success" | "warning";
}

export function ProgressBar({
  value,
  max = 100,
  showLabel = false,
  className,
  size = "md",
  color = "primary",
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeClasses = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  const colorClasses = {
    primary: "bg-primary",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
  };

  return (
    <div className={cn("w-full space-y-2", className)}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <span>Progress</span>
          <span className={cn(percentage === 100 ? "text-emerald-500" : "text-foreground")}>
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div className={cn("w-full bg-muted rounded-full overflow-hidden", sizeClasses[size])}>
        <div
          className={cn(
            "h-full transition-all duration-500 ease-out rounded-full shadow-sm",
            colorClasses[color]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
