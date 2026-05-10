"use client";

import { useState } from "react";
import { useAdminDashboard } from "@/hooks/useDashboard";
import { Loading } from "@/components/shared/Loading";
import { ErrorState } from "@/components/shared/ErrorState";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Filter, 
  Activity, 
  Zap, 
  Brain, 
  MessageSquare, 
  FileQuestion, 
  Eye,
  Terminal
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminAILogsPage() {
  const { data, isLoading, isError, refetch } = useAdminDashboard();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");

  if (isLoading) return <Loading />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;

  // Mock logs for demonstration
  const logs = [
    { id: "1", type: "LEARNING_PATH", user: "John Doe", status: "SUCCESS", model: "Gemini 1.5 Flash", date: new Date().toISOString() },
    { id: "2", type: "CHAT", user: "Jane Smith", status: "SUCCESS", model: "Gemini 1.5 Flash", date: new Date().toISOString() },
    { id: "3", type: "QUIZ", user: "Mike Ross", status: "FAILED", model: "Gemini 1.5 Flash", date: new Date().toISOString() },
    { id: "4", type: "RECOMMENDATION", user: "Harvey Specter", status: "SUCCESS", model: "Gemini 1.5 Flash", date: new Date().toISOString() },
    { id: "5", type: "PROGRESS", user: "Rachel Zane", status: "SUCCESS", model: "Gemini 1.5 Flash", date: new Date().toISOString() },
  ];

  const getIcon = (type: string) => {
     switch(type) {
        case 'LEARNING_PATH': return <Zap className="h-4 w-4 text-amber-500" />;
        case 'CHAT': return <MessageSquare className="h-4 w-4 text-blue-500" />;
        case 'QUIZ': return <FileQuestion className="h-4 w-4 text-emerald-500" />;
        case 'RECOMMENDATION': return <Brain className="h-4 w-4 text-purple-500" />;
        default: return <Activity className="h-4 w-4 text-primary" />;
     }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Request Logs</h1>
          <p className="text-muted-foreground">Monitor AI model performance, usage trends, and request statuses.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="gap-2">
              <Terminal className="h-4 w-4" /> Export Logs
           </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
         <Card className="border-none shadow-sm bg-primary/5 border-primary/10">
            <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">98.5%</div>
               <p className="text-xs text-muted-foreground">+2.1% from yesterday</p>
            </CardContent>
         </Card>
         <Card className="border-none shadow-sm bg-emerald-500/5 border-emerald-500/10">
            <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium">Avg Latency</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">1.2s</div>
               <p className="text-xs text-muted-foreground">-0.4s improvement</p>
            </CardContent>
         </Card>
         <Card className="border-none shadow-sm bg-amber-500/5 border-amber-500/10">
            <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium">Total Tokens</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">452k</div>
               <p className="text-xs text-muted-foreground">Approx $0.12 cost</p>
            </CardContent>
         </Card>
      </div>

      <Card className="border-none shadow-sm bg-card">
        <CardHeader className="pb-4">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="relative w-full md:w-80">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                 <Input 
                   placeholder="Search logs by user or model..." 
                   className="pl-10" 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                 />
              </div>
              <div className="flex items-center gap-4 w-full md:w-auto">
                 <Select value={typeFilter} onValueChange={(val) => setTypeFilter(val ?? "ALL")}>
                    <SelectTrigger className="w-[180px]">
                       <SelectValue placeholder="All Request Types" />
                    </SelectTrigger>
                    <SelectContent>
                       <SelectItem value="ALL">All Request Types</SelectItem>
                       <SelectItem value="LEARNING_PATH">Learning Path</SelectItem>
                       <SelectItem value="CHAT">AI Chat Tutor</SelectItem>
                       <SelectItem value="QUIZ">Quiz Generation</SelectItem>
                       <SelectItem value="RECOMMENDATION">Recommendations</SelectItem>
                    </SelectContent>
                 </Select>
                 <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
              </div>
           </div>
        </CardHeader>
        <CardContent>
           <div className="rounded-xl border overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-2 font-medium">
                           {getIcon(log.type)}
                           <span className="text-xs uppercase tracking-wider">{log.type.replace('_', ' ')}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm font-bold">{log.user}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{log.model}</TableCell>
                      <TableCell>
                         <Badge variant={log.status === 'SUCCESS' ? 'secondary' : 'destructive'} className={log.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-600 border-none text-[10px]' : 'text-[10px]'}>
                            {log.status}
                         </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                         {new Date(log.date).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                         <Button variant="ghost" size="sm" className="gap-2">
                            <Eye className="h-4 w-4" /> Details
                         </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
