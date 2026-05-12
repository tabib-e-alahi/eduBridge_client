"use client";

import { Bell, Check, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get("/notifications?limit=5");
      setNotifications(data.data.notifications);
      setUnreadCount(data.data.unreadCount);
    } catch (error) {
      console.error("Failed to fetch notifications");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Optional: Poll every 2 minutes
    const interval = setInterval(fetchNotifications, 120000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      toast.error("Failed to mark as read");
    }
  };

  const markAllRead = async () => {
    try {
      await api.patch("/notifications/mark-all-read");
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error("Failed to mark all as read");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full">
          <Bell className="h-5 w-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b bg-muted/30">
          <h3 className="font-bold text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-[10px] font-bold uppercase tracking-wider"
              onClick={markAllRead}
            >
              Mark all read
            </Button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {isLoading && notifications.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <p className="text-sm font-medium">No notifications yet</p>
              <p className="text-xs text-muted-foreground">We'll notify you when something important happens.</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={cn(
                  "p-4 border-b last:border-0 transition-colors hover:bg-muted/50 cursor-default relative group",
                  !n.isRead && "bg-primary/5"
                )}
              >
                {!n.isRead && (
                  <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary" />
                )}
                <div className="space-y-1 pr-6">
                  <p className="text-xs font-bold leading-tight">{n.title}</p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                    {n.message}
                  </p>
                  <p className="text-[10px] text-muted-foreground/60 font-medium">
                    {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                  </p>
                </div>
                {!n.isRead && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-4 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => markAsRead(n.id)}
                  >
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
        <div className="p-2 border-t text-center">
          <Link href="/user/notifications" className="text-[11px] font-bold text-primary hover:underline">
            View all notifications
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
