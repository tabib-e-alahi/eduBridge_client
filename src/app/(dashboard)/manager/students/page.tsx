"use client";

import { useState } from "react";
import { useInstructorStudents } from "@/hooks/useInstructorData";
import { Loading } from "@/components/shared/Loading";
import { ErrorState } from "@/components/shared/ErrorState";
import { 
  Users, 
  Search, 
  Filter, 
  Mail, 
  Calendar, 
  BookOpen, 
  TrendingUp, 
  MoreVertical,
  MessageCircle,
  ExternalLink
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export default function InstructorStudentsPage() {
  const { data: studentsData, isLoading, isError, refetch } = useInstructorStudents();
  const [searchTerm, setSearchTerm] = useState("");

  if (isLoading) return <Loading />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;

  const enrollments = studentsData?.data || [];
  const filteredEnrollments = enrollments.filter((e) => 
    e.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight">Academics.</h1>
          <p className="text-muted-foreground font-medium">Manage and track the progress of your student community.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Filter by name, email or course..." 
              className="pl-10 h-11 rounded-[0.75rem] border-muted-foreground/20 bg-card" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="h-11 w-11 rounded-[0.75rem] shrink-0">
             <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="saas-card p-0 overflow-hidden shadow-xl border-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-muted/50 border-b text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-6 py-5">Student Information</th>
                <th className="px-6 py-5">Enrolled Course</th>
                <th className="px-6 py-5">Learning Progress</th>
                <th className="px-6 py-5">Registration Date</th>
                <th className="px-6 py-5 text-right">Engagement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted-foreground/10">
              {filteredEnrollments.map((enrollment) => (
                <tr key={enrollment.id} className="group hover:bg-muted/10 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 rounded-[0.75rem] border border-muted-foreground/10">
                        <AvatarImage src={enrollment.user.image} />
                        <AvatarFallback className="bg-primary/10 text-primary font-black text-xs">
                          {enrollment.user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-black truncate group-hover:text-primary transition-colors">{enrollment.user.name}</p>
                        <p className="text-[10px] font-bold text-muted-foreground truncate uppercase">{enrollment.user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <Badge variant="outline" className="font-bold text-[9px] uppercase tracking-widest bg-muted/50 border-none px-2 py-1">
                        {enrollment.course.title}
                     </Badge>
                  </td>
                  <td className="px-6 py-4 min-w-[200px]">
                    <div className="space-y-1.5">
                       <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                          <span className={cn(enrollment.progress === 100 ? "text-emerald-600" : "text-primary")}>
                             {enrollment.progress === 100 ? 'Completed' : 'Active'}
                          </span>
                          <span>{enrollment.progress.toFixed(0)}%</span>
                       </div>
                       <Progress value={enrollment.progress} className="h-1.5" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(enrollment.createdAt).toLocaleDateString([], { month: 'short', year: 'numeric' })}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                       <Button variant="ghost" size="icon" className="h-9 w-9 rounded-[0.625rem] hover:bg-primary/10 hover:text-primary">
                          <MessageCircle className="h-4 w-4" />
                       </Button>
                       <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                             <Button variant="ghost" size="icon" className="h-9 w-9 rounded-[0.625rem]">
                                <MoreVertical className="h-4 w-4" />
                             </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56 p-2 rounded-[0.75rem] font-bold">
                             <DropdownMenuLabel className="px-2 py-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">Student Operations</DropdownMenuLabel>
                             <DropdownMenuSeparator />
                             <DropdownMenuItem className="gap-2 cursor-pointer">
                                <Mail className="h-4 w-4" /> Send Email Notification
                             </DropdownMenuItem>
                             <DropdownMenuItem className="gap-2 cursor-pointer">
                                <TrendingUp className="h-4 w-4" /> View Detailed Analytics
                             </DropdownMenuItem>
                             <DropdownMenuSeparator />
                             <DropdownMenuItem className="gap-2 text-destructive cursor-pointer">
                                <ExternalLink className="h-4 w-4" /> Manage Enrollment
                             </DropdownMenuItem>
                          </DropdownMenuContent>
                       </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredEnrollments.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-muted-foreground font-bold uppercase tracking-widest opacity-40">
                    No matching students found in your community.
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
