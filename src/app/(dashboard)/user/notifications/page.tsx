"use client";

import { useEffect, useState } from "react";
import { 
  Bell, 
  Check, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  AlertTriangle,
  MailOpen,
  Filter,
  MoreHorizontal,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/axios";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { Loading } from "@/components/shared/Loading";
import { PageHeader } from "@/components/dashboard/PageHeader";

const iconMap: Record<string, any> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: AlertCircle,
  enrollment_success: CheckCircle2,
  progress_update: Info,
  quiz_completed: CheckCircle2,
  learning_path_generated: Info,
  course_published: Info,
  review_submitted: Info,
  admin_announcement: Bell,
  course_approval: CheckCircle2,
  account_security: AlertCircle,
};

const colorMap: Record<string, string> = {
  info: "text-blue-500 bg-blue-500/10",
  success: "text-emerald-500 bg-emerald-500/10",
  warning: "text-amber-500 bg-amber-500/10",
  error: "text-destructive bg-destructive/10",
  enrollment_success: "text-emerald-500 bg-emerald-500/10",
  admin_announcement: "text-primary bg-primary/10",
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get("/notifications?limit=50");
      setNotifications(data.data.notifications);
      setUnreadCount(data.data.unreadCount);
    } catch (error) {
      toast.error("Failed to load notifications");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      toast.error("Failed to update notification");
    }
  };

  const markAllRead = async () => {
    try {
      await api.patch("/notifications/mark-all-read");
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error("Action failed");
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      toast.success("Notification deleted");
    } catch (error) {
      toast.error("Failed to delete notification");
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader 
        title="Notifications" 
        subtitle="Stay informed about your course progress and platform updates."
        actions={
          <>
            <Button variant="outline" size="sm" className="font-bold text-xs h-9">
               <Filter className="h-3.5 w-3.5 mr-2" /> Filter
            </Button>
            <Button variant="outline" size="sm" className="font-bold text-xs h-9">
               <Settings className="h-3.5 w-3.5 mr-2" /> Settings
            </Button>
            {unreadCount > 0 && (
              <Button onClick={markAllRead} size="sm" className="font-bold text-xs h-9 px-4">
                <MailOpen className="h-3.5 w-3.5 mr-2" /> Mark all read
              </Button>
            )}
          </>
        }
      />

      <div className="max-w-4xl mx-auto space-y-4">
        {notifications.length === 0 ? (
          <div className="lms-card p-24 bg-muted/20 border-dashed flex flex-col items-center justify-center text-center gap-4">
             <div className="h-16 w-16 bg-card rounded-full flex items-center justify-center border border-border">
                <Bell className="h-8 w-8 text-muted-foreground/30" />
             </div>
             <div className="space-y-1">
                <h3 className="font-bold text-lg">Inbox Zero</h3>
                <p className="text-sm text-muted-foreground max-w-xs font-medium">You don't have any notifications at the moment. We'll let you know when something important happens.</p>
             </div>
          </div>
        ) : (
          notifications.map((n) => {
            const Icon = iconMap[n.type] || Info;
            const colorClass = colorMap[n.type] || "text-muted-foreground bg-muted";

            return (
              <div 
                key={n.id} 
                className={cn(
                  "lms-card p-6 flex items-start gap-5 transition-all",
                  !n.isRead ? "border-primary/20 bg-primary/[0.02] shadow-sm ring-1 ring-primary/5" : "opacity-80"
                )}
              >
                 <div className={cn("p-2.5 rounded-xl shrink-0 border border-border/20", colorClass)}>
                    <Icon className="h-4 w-4" />
                 </div>
                 <div className="flex-1 space-y-1.5 min-w-0">
                    <div className="flex items-center justify-between gap-4">
                       <div className="flex items-center gap-2">
                          <h3 className={cn("font-bold text-sm truncate", !n.isRead ? "text-foreground" : "text-muted-foreground")}>
                             {n.title}
                          </h3>
                          {!n.isRead && (
                             <Badge className="h-4 px-1.5 text-[8px] uppercase font-bold tracking-widest">New</Badge>
                          )}
                       </div>
                       <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest shrink-0">
                          {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                       </span>
                    </div>
                    <p className="text-xs text-muted-foreground font-medium leading-relaxed max-w-3xl">
                       {n.message}
                    </p>
                    <div className="pt-3 flex items-center gap-4">
                       {!n.isRead && (
                          <button 
                            onClick={() => markAsRead(n.id)}
                            className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-1.5 hover:underline"
                          >
                             <Check className="h-3 w-3" /> Mark Read
                          </button>
                       )}
                       <button 
                         onClick={() => deleteNotification(n.id)}
                         className="text-[10px] font-bold uppercase tracking-widest text-destructive/70 flex items-center gap-1.5 hover:text-destructive hover:underline"
                       >
                          <Trash2 className="h-3 w-3" /> Delete
                       </button>
                    </div>
                 </div>
                 <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground/50 hover:text-foreground">
                    <MoreHorizontal className="h-4 w-4" />
                 </Button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
