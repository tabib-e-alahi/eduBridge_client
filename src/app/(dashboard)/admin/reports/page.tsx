"use client";

import { useState } from "react";
import { useAdminReports, useUpdateReportStatus } from "@/hooks/useAdminData";
import { Loading } from "@/components/shared/Loading";
import { ErrorState } from "@/components/shared/ErrorState";
import { 
  ShieldAlert, 
  Search, 
  Filter,
  MoreVertical,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Eye,
  Flag
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export default function AdminReportsPage() {
  const { data: reportsData, isLoading, isError, refetch } = useAdminReports();
  const updateStatusMutation = useUpdateReportStatus();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  if (isLoading) return <Loading />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;

  const reports = reportsData?.data || [];

  const filteredReports = reports.filter((report) => {
    const matchesSearch = report.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          report.reporter?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'OPEN': return <Badge className="bg-amber-500/10 text-amber-600 border-none font-black text-[9px] uppercase tracking-widest px-2"><Clock className="h-3 w-3 mr-1" /> Open</Badge>;
      case 'IN_REVIEW': return <Badge className="bg-blue-500/10 text-blue-600 border-none font-black text-[9px] uppercase tracking-widest px-2"><Eye className="h-3 w-3 mr-1" /> Reviewing</Badge>;
      case 'RESOLVED': return <Badge className="bg-emerald-500/10 text-emerald-600 border-none font-black text-[9px] uppercase tracking-widest px-2"><CheckCircle2 className="h-3 w-3 mr-1" /> Resolved</Badge>;
      case 'REJECTED': return <Badge className="bg-muted text-muted-foreground border-none font-black text-[9px] uppercase tracking-widest px-2"><XCircle className="h-3 w-3 mr-1" /> Dismissed</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTargetIcon = (type: string) => {
    return <Flag className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-foreground flex items-center gap-3">
             Moderation <ShieldAlert className="h-8 w-8 text-rose-500" />
          </h1>
          <p className="text-muted-foreground font-medium text-lg">Review and act upon community reports and flagged content.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-muted/30 p-4 rounded-[1rem] border border-muted-foreground/10">
         <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search reports..." 
              className="pl-10 h-11 rounded-[0.75rem] border-none bg-background shadow-none" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
         <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto">
            <div className="flex bg-background rounded-[0.75rem] p-1 border border-muted-foreground/10 min-w-max">
               {["ALL", "OPEN", "IN_REVIEW", "RESOLVED", "REJECTED"].map((filter) => (
                 <Button 
                   key={filter}
                   variant={statusFilter === filter ? 'secondary' : 'ghost'} 
                   size="sm" 
                   className="rounded-[0.5rem] font-bold text-[10px] uppercase px-4 h-9"
                   onClick={() => setStatusFilter(filter)}
                 >
                    {filter.replace('_', ' ')}
                 </Button>
               ))}
            </div>
            <Button variant="outline" size="icon" className="h-11 w-11 rounded-[0.75rem] bg-background border-none shrink-0"><Filter className="h-4 w-4" /></Button>
         </div>
      </div>

      <div className="grid gap-6">
        {filteredReports.map((report) => (
          <div key={report.id} className="saas-card group bg-card border-muted-foreground/10 hover:border-rose-500/30 transition-all shadow-sm">
            <div className="flex flex-col md:flex-row items-start justify-between gap-6">
              
              <div className="space-y-4 flex-1">
                 <div className="flex items-center gap-3">
                    {getStatusBadge(report.status)}
                    <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest">
                       {report.targetType}
                    </Badge>
                    <span className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                       <Clock className="h-3 w-3" /> {new Date(report.createdAt).toLocaleString()}
                    </span>
                 </div>
                 
                 <div>
                    <h3 className="text-lg font-black text-foreground mb-1">{report.reason}</h3>
                    <p className="text-sm text-muted-foreground font-medium max-w-3xl">
                       {report.description || "No additional details provided by the reporter."}
                    </p>
                 </div>

                 <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl border border-muted-foreground/10 inline-flex">
                    <Avatar className="h-8 w-8 rounded-lg">
                       <AvatarImage src={report.reporter?.image} />
                       <AvatarFallback className="text-[10px] font-black bg-primary/10 text-primary">{report.reporter?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                       <span className="text-xs font-bold leading-tight">Reported by {report.reporter?.name}</span>
                       <span className="text-[10px] font-medium text-muted-foreground">{report.reporter?.email}</span>
                    </div>
                 </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
                <Button 
                   variant="outline"
                   className="flex-1 md:flex-none font-black rounded-[0.75rem] h-11 px-6 shadow-sm"
                >
                   View Target Content
                </Button>
                <DropdownMenu>
                   <DropdownMenuTrigger asChild>
                      <Button variant="secondary" className="h-11 px-4 rounded-[0.75rem] font-black gap-2">
                         Take Action <MoreVertical className="h-4 w-4" />
                      </Button>
                   </DropdownMenuTrigger>
                   <DropdownMenuContent align="end" className="w-56 p-2 rounded-[0.75rem] font-bold">
                      <DropdownMenuLabel className="px-2 py-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">Update Status</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      
                      {report.status !== 'IN_REVIEW' && (
                         <DropdownMenuItem 
                           className="gap-2 cursor-pointer text-blue-600 focus:text-blue-600"
                           onClick={() => updateStatusMutation.mutate({ id: report.id, status: 'IN_REVIEW' })}
                         >
                            <Eye className="h-4 w-4" /> Mark as Reviewing
                         </DropdownMenuItem>
                      )}
                      
                      {report.status !== 'RESOLVED' && (
                         <DropdownMenuItem 
                           className="gap-2 cursor-pointer text-emerald-600 focus:text-emerald-600"
                           onClick={() => updateStatusMutation.mutate({ id: report.id, status: 'RESOLVED' })}
                         >
                            <CheckCircle2 className="h-4 w-4" /> Resolve & Close
                         </DropdownMenuItem>
                      )}

                      {report.status !== 'REJECTED' && (
                         <DropdownMenuItem 
                           className="gap-2 cursor-pointer text-muted-foreground focus:text-muted-foreground"
                           onClick={() => updateStatusMutation.mutate({ id: report.id, status: 'REJECTED' })}
                         >
                            <XCircle className="h-4 w-4" /> Dismiss Report
                         </DropdownMenuItem>
                      )}

                      <DropdownMenuSeparator />
                      <DropdownMenuLabel className="px-2 py-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">Punitive Actions</DropdownMenuLabel>
                      <DropdownMenuItem className="gap-2 cursor-pointer text-rose-600 focus:text-rose-600">
                         <AlertTriangle className="h-4 w-4" /> Suspend Target User
                      </DropdownMenuItem>
                   </DropdownMenuContent>
                </DropdownMenu>
              </div>

            </div>
          </div>
        ))}

        {filteredReports.length === 0 && (
           <div className="py-24 text-center saas-card bg-transparent border-dashed border-2 flex flex-col items-center gap-4 border-muted-foreground/20">
              <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 mb-2">
                 <ShieldAlert className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-black text-foreground/80 tracking-tight">Queue Clear.</h3>
              <p className="text-muted-foreground max-w-sm mx-auto font-medium">
                 No reports match your current filters. The platform is safe and sound!
              </p>
           </div>
        )}
      </div>
    </div>
  );
}
