"use client";

import { useState } from "react";
import { useAdminAuditLogs } from "@/hooks/useAdminData";
import { Loading } from "@/components/shared/Loading";
import { ErrorState } from "@/components/shared/ErrorState";
import { 
  TerminalSquare, 
  Search, 
  Filter,
  Fingerprint,
  Calendar,
  MonitorSmartphone,
  ChevronRight,
  Database
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export default function AdminAuditLogsPage() {
  const { data: logsData, isLoading, isError, refetch } = useAdminAuditLogs();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [entityFilter, setEntityFilter] = useState("ALL");

  if (isLoading) return <Loading />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;

  const logs = logsData?.data || [];

  const filteredLogs = logs.filter((log) => {
    const searchMatch = 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actor?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const entityMatch = entityFilter === "ALL" || log.entityType === entityFilter;
    return searchMatch && entityMatch;
  });

  // Extract unique entities for filter
  const uniqueEntities = ["ALL", ...Array.from(new Set(logs.map(l => l.entityType)))];

  const getActionColor = (action: string) => {
    if (action.includes('UPDATE_ROLE') || action.includes('UPDATE_STATUS')) return 'text-blue-500 bg-blue-500/10';
    if (action.includes('REJECT') || action.includes('BLOCKED')) return 'text-rose-500 bg-rose-500/10';
    if (action.includes('RESOLVE') || action.includes('ACTIVE')) return 'text-emerald-500 bg-emerald-500/10';
    return 'text-primary bg-primary/10';
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col justify-between items-start gap-2">
        <h1 className="text-4xl font-black tracking-tight text-foreground flex items-center gap-3">
           System Trace <TerminalSquare className="h-8 w-8 text-primary" />
        </h1>
        <p className="text-muted-foreground font-medium text-lg">Immutable audit trail of all administrative and automated actions.</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-muted/30 p-4 rounded-[1rem] border border-muted-foreground/10">
         <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search actions, actors, or emails..." 
              className="pl-10 h-11 rounded-[0.75rem] border-none bg-background shadow-none font-mono text-sm" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
         <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto">
            <div className="flex bg-background rounded-[0.75rem] p-1 border border-muted-foreground/10 min-w-max">
               {uniqueEntities.slice(0, 5).map((filter: any) => (
                 <Button 
                   key={filter}
                   variant={entityFilter === filter ? 'secondary' : 'ghost'} 
                   size="sm" 
                   className="rounded-[0.5rem] font-bold text-[10px] uppercase px-4 h-9 font-mono"
                   onClick={() => setEntityFilter(filter)}
                 >
                    {filter}
                 </Button>
               ))}
            </div>
            <Button variant="outline" size="icon" className="h-11 w-11 rounded-[0.75rem] bg-background border-none shrink-0"><Filter className="h-4 w-4" /></Button>
         </div>
      </div>

      <div className="saas-card p-0 overflow-hidden shadow-xl border-none bg-card/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-sm">
            <thead className="bg-muted/80 border-b text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-6 py-5">Timestamp</th>
                <th className="px-6 py-5">Actor (Admin)</th>
                <th className="px-6 py-5">Action</th>
                <th className="px-6 py-5">Target Entity</th>
                <th className="px-6 py-5">Trace Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted-foreground/10">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="group hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1 text-muted-foreground font-medium">
                       <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {new Date(log.createdAt).toLocaleDateString()}</span>
                       <span className="text-[10px] opacity-70">{new Date(log.createdAt).toLocaleTimeString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     {log.actor ? (
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 rounded-[0.5rem] border border-muted-foreground/20">
                            <AvatarFallback className="font-black text-[10px] bg-primary/10 text-primary">{log.actor.name?.charAt(0) || 'A'}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                             <span className="font-bold text-foreground text-xs leading-tight">{log.actor.name}</span>
                             <span className="text-[9px] text-muted-foreground uppercase">{log.actor.role}</span>
                          </div>
                        </div>
                     ) : (
                        <span className="text-muted-foreground text-xs font-bold italic">SYSTEM</span>
                     )}
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={cn("border-none font-bold text-[9px] uppercase tracking-widest px-2 py-1", getActionColor(log.action))}>
                       {log.action.replace(/_/g, ' ')}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-2">
                        <Database className="h-3 w-3 text-muted-foreground" />
                        <span className="font-bold text-xs">{log.entityType}</span>
                        <ChevronRight className="h-3 w-3 text-muted-foreground/40" />
                        <span className="text-[10px] text-muted-foreground truncate max-w-[100px]" title={log.entityId}>{log.entityId}</span>
                     </div>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                     <div className="flex flex-col gap-2">
                        <span className="text-xs font-medium text-foreground truncate" title={log.metadata}>
                           {log.metadata || "-"}
                        </span>
                        {(log.ipAddress || log.userAgent) && (
                           <div className="flex flex-wrap items-center gap-3 text-[9px] text-muted-foreground opacity-60">
                              {log.ipAddress && <span className="flex items-center gap-1"><Fingerprint className="h-3 w-3" /> {log.ipAddress}</span>}
                              {log.userAgent && <span className="flex items-center gap-1"><MonitorSmartphone className="h-3 w-3" /> {log.userAgent.substring(0, 15)}...</span>}
                           </div>
                        )}
                     </div>
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-muted-foreground font-black uppercase tracking-widest opacity-40">
                    No system logs match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
