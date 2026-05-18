"use client";

import { useState } from "react";
import {
  TicketCheck, Search, Filter, ChevronDown, AlertCircle, CheckCircle2,
  Clock, MessageSquare, User, Calendar, XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAdminSupportTickets, useUpdateSupportTicketStatus, SupportTicket } from "@/hooks/useAdminData";
import { Loading } from "@/components/shared/Loading";
import { ErrorState } from "@/components/shared/ErrorState";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS = ["OPEN", "IN_REVIEW", "RESOLVED", "REJECTED"];

const statusConfig: Record<string, { label: string; icon: any; className: string }> = {
  OPEN: { label: "Open", icon: AlertCircle, className: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
  IN_REVIEW: { label: "In Review", icon: Clock, className: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
  RESOLVED: { label: "Resolved", icon: CheckCircle2, className: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
  REJECTED: { label: "Rejected", icon: XCircle, className: "text-rose-500 bg-rose-500/10 border-rose-500/20" },
};

function parseTicket(description: string) {
  try {
    // Tickets from support.service.ts store: "NAME | EMAIL | SUBJECT | MESSAGE"
    const parts = description.split(" | ");
    if (parts.length >= 4) {
      return { name: parts[0], email: parts[1], subject: parts[2], message: parts.slice(3).join(" | ") };
    }
    return { name: "Anonymous", email: "", subject: "Support Request", message: description };
  } catch {
    return { name: "Anonymous", email: "", subject: "Support Request", message: description };
  }
}

export default function AdminSupportPage() {
  const { data, isLoading, isError, refetch } = useAdminSupportTickets();
  const updateStatus = useUpdateSupportTicketStatus();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  if (isLoading) return <Loading />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;

  const tickets: SupportTicket[] = (data?.data || []).filter(
    (t: SupportTicket) => t.targetType === "SUPPORT_TICKET"
  );

  const filtered = tickets.filter((t) => {
    const parsed = parseTicket(t.description);
    const searchMatch =
      parsed.subject.toLowerCase().includes(search.toLowerCase()) ||
      parsed.name.toLowerCase().includes(search.toLowerCase()) ||
      t.reporter?.name?.toLowerCase().includes(search.toLowerCase());
    const statusMatch = statusFilter === "ALL" || t.status === statusFilter;
    return searchMatch && statusMatch;
  });

  const counts = STATUS_OPTIONS.reduce((acc, s) => {
    acc[s] = tickets.filter((t) => t.status === s).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
          Support Center <TicketCheck className="h-8 w-8 text-primary" />
        </h1>
        <p className="text-muted-foreground font-medium text-lg">
          Manage student support tickets and resolve platform issues.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATUS_OPTIONS.map((s) => {
          const cfg = statusConfig[s];
          const Icon = cfg.icon;
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(statusFilter === s ? "ALL" : s)}
              className={cn(
                "saas-card p-4 text-left transition-all hover:scale-[1.02]",
                statusFilter === s ? "ring-2 ring-primary" : ""
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={cn("h-5 w-5", cfg.className.split(" ")[0])} />
                <span className="text-2xl font-black">{counts[s] || 0}</span>
              </div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{cfg.label}</p>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tickets by subject or user..."
            className="pl-10 h-11 rounded-[0.75rem]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["ALL", ...STATUS_OPTIONS].map((s) => (
            <Button
              key={s}
              variant={statusFilter === s ? "default" : "outline"}
              size="sm"
              className="h-11 font-bold text-[10px] uppercase tracking-widest rounded-[0.625rem]"
              onClick={() => setStatusFilter(s)}
            >
              {s === "ALL" ? "All Tickets" : statusConfig[s].label}
            </Button>
          ))}
        </div>
      </div>

      {/* Ticket List */}
      <div className="saas-card p-0 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-24 text-center">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
            <p className="font-bold text-lg">No tickets found</p>
            <p className="text-muted-foreground text-sm mt-1">All clear! No matching support tickets.</p>
          </div>
        ) : (
          <div className="divide-y">
            {filtered.map((ticket) => {
              const parsed = parseTicket(ticket.description);
              const cfg = statusConfig[ticket.status] || statusConfig.OPEN;
              const StatusIcon = cfg.icon;
              return (
                <div key={ticket.id} className="p-5 hover:bg-muted/10 transition-colors">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex gap-4 items-start flex-1 min-w-0">
                      <Avatar className="h-10 w-10 shrink-0 border">
                        <AvatarFallback className="font-bold text-xs bg-primary/10 text-primary">
                          {(ticket.reporter?.name || parsed.name)?.charAt(0) || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <Badge className={cn("border font-bold text-[10px] uppercase tracking-widest gap-1", cfg.className)}>
                            <StatusIcon className="h-3 w-3" /> {cfg.label}
                          </Badge>
                        </div>
                        <h3 className="font-bold text-base truncate">{parsed.subject}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">{parsed.message}</p>
                        <div className="flex flex-wrap gap-4 mt-2 text-xs text-muted-foreground font-medium">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {ticket.reporter?.name || parsed.name}
                          </span>
                          {parsed.email && <span>{parsed.email}</span>}
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(ticket.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="h-9 font-bold gap-1.5 rounded-[0.5rem]">
                            Update Status <ChevronDown className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          {STATUS_OPTIONS.map((s) => (
                            <DropdownMenuItem
                              key={s}
                              onClick={() => updateStatus.mutate({ id: ticket.id, status: s })}
                              disabled={ticket.status === s || updateStatus.isPending}
                              className="font-bold text-sm"
                            >
                              {statusConfig[s].label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
