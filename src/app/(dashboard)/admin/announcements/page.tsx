"use client";

import { useState } from "react";
import {
  Megaphone, Send, Sparkles, Bell, Info, AlertTriangle, CheckCircle2, Loader2, History
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useCreateAnnouncement } from "@/hooks/useAdminData";
import { cn } from "@/lib/utils";

const TYPE_OPTIONS = [
  { value: "info", label: "Informational", icon: Info, color: "border-blue-500 text-blue-500 bg-blue-500/5" },
  { value: "success", label: "Success", icon: CheckCircle2, color: "border-emerald-500 text-emerald-500 bg-emerald-500/5" },
  { value: "warning", label: "Warning", icon: AlertTriangle, color: "border-amber-500 text-amber-500 bg-amber-500/5" },
];

export default function AdminAnnouncementsPage() {
  const createAnnouncement = useCreateAnnouncement();
  const [form, setForm] = useState({ title: "", message: "", type: "info" });
  const [history, setHistory] = useState<{ title: string; message: string; type: string; sentAt: string }[]>([]);

  const handleSend = () => {
    if (!form.title.trim() || !form.message.trim()) return;
    createAnnouncement.mutate(form, {
      onSuccess: () => {
        setHistory((prev) => [{ ...form, sentAt: new Date().toISOString() }, ...prev]);
        setForm({ title: "", message: "", type: "info" });
      },
    });
  };

  const selectedType = TYPE_OPTIONS.find((t) => t.value === form.type) || TYPE_OPTIONS[0];

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-10 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
          Broadcast Center <Megaphone className="h-8 w-8 text-primary" />
        </h1>
        <p className="text-muted-foreground font-medium text-lg">
          Send platform-wide announcements to all enrolled users instantly.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Compose Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="saas-card p-6 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <h2 className="font-bold text-lg">Compose Announcement</h2>
            </div>

            <div className="space-y-2">
              <Label className="font-bold">Announcement Type</Label>
              <div className="grid grid-cols-3 gap-3">
                {TYPE_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setForm({ ...form, type: opt.value })}
                      className={cn(
                        "p-3 rounded-xl border-2 text-sm font-bold flex flex-col items-center gap-2 transition-all",
                        form.type === opt.value ? opt.color + " border-2" : "border-border bg-muted/20 text-muted-foreground hover:bg-muted/40"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-bold">Title</Label>
              <Input
                placeholder="e.g. Platform Maintenance Notice"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-bold">Message</Label>
              <Textarea
                placeholder="Write your announcement message here..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="resize-none min-h-[120px]"
              />
              <p className="text-xs text-muted-foreground font-medium text-right">{form.message.length} / 500 chars</p>
            </div>

            <Button
              className="w-full h-12 font-bold gap-2 text-base"
              onClick={handleSend}
              disabled={createAnnouncement.isPending || !form.title.trim() || !form.message.trim()}
            >
              {createAnnouncement.isPending ? (
                <><Loader2 className="h-5 w-5 animate-spin" /> Sending...</>
              ) : (
                <><Send className="h-5 w-5" /> Broadcast to All Users</>
              )}
            </Button>
          </div>
        </div>

        {/* Preview + Info */}
        <div className="space-y-6">
          <div className="saas-card p-5 space-y-4">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" /> Preview
            </h3>
            <div className={cn("p-4 rounded-xl border-2", form.type ? TYPE_OPTIONS.find(t => t.value === form.type)?.color : "border-border")}>
              <div className="flex items-start gap-3">
                {selectedType && <selectedType.icon className="h-5 w-5 shrink-0 mt-0.5" />}
                <div>
                  <p className="font-bold text-sm">{form.title || "Announcement Title"}</p>
                  <p className="text-xs text-muted-foreground mt-1">{form.message || "Your announcement message will appear here."}</p>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest text-center">
              This appears in every user's notification inbox
            </p>
          </div>

          <div className="saas-card p-5 space-y-2">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <Info className="h-4 w-4 text-muted-foreground" /> Reach
            </h3>
            <p className="text-xs text-muted-foreground font-medium leading-relaxed">
              Announcements are delivered to <strong className="text-foreground">all registered users</strong> in real time. Use this responsibly for critical platform updates only.
            </p>
          </div>
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <History className="h-5 w-5 text-muted-foreground" /> Sent This Session
          </h2>
          <div className="saas-card p-0 overflow-hidden divide-y">
            {history.map((item, i) => {
              const cfg = TYPE_OPTIONS.find((t) => t.value === item.type);
              const Icon = cfg?.icon || Info;
              return (
                <div key={i} className="p-4 flex items-start gap-4 hover:bg-muted/10">
                  <Icon className={cn("h-5 w-5 shrink-0 mt-0.5", cfg?.color?.split(" ")[0])} />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <p className="font-bold text-sm truncate">{item.title}</p>
                      <Badge variant="outline" className={cn("text-[10px] font-bold shrink-0", cfg?.color)}>
                        {cfg?.label}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{item.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
