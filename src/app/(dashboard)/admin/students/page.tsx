"use client";

import { useState } from "react";
import { useAdminStudents, useUpdateUserStatus, useUpdateUserRole } from "@/hooks/useAdminData";
import { Loading } from "@/components/shared/Loading";
import { ErrorState } from "@/components/shared/ErrorState";
import { Search, Mail, Filter, Ban, CheckCircle2, MoreVertical, ShieldAlert, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const { data: studentsData, isLoading, isError, refetch } = useAdminStudents();
  const updateStatusMutation = useUpdateUserStatus();
  const updateRoleMutation = useUpdateUserRole();

  if (isLoading) return <Loading />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;

  const students = studentsData?.data || [];
  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (id: string, status: "ACTIVE" | "BLOCKED") => {
    updateStatusMutation.mutate({ id, status });
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-foreground">Students.</h1>
          <p className="text-muted-foreground font-medium text-lg">Manage learner accounts and platform access.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-muted/30 p-4 rounded-[1rem] border border-muted-foreground/10">
         <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name or email..." 
              className="pl-10 h-11 rounded-[0.75rem] border-none bg-background shadow-none" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
         <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex bg-background rounded-[0.75rem] p-1 border border-muted-foreground/10">
               {["ALL", "ACTIVE", "BLOCKED"].map((filter) => (
                 <button 
                   key={filter}
                   className={cn(
                     "rounded-[0.5rem] font-bold text-[10px] uppercase px-4 h-9 transition-colors",
                     statusFilter === filter ? 'bg-secondary text-secondary-foreground shadow-sm' : 'hover:bg-muted text-muted-foreground'
                   )}
                   onClick={() => setStatusFilter(filter)}
                 >
                    {filter}
                 </button>
               ))}
            </div>
            <Button variant="outline" size="icon" className="h-11 w-11 rounded-[0.75rem] bg-background border-none"><Filter className="h-4 w-4" /></Button>
         </div>
      </div>

      <div className="saas-card p-0 overflow-hidden shadow-xl border-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-muted/50 border-b text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-6 py-5">Student Identity</th>
                <th className="px-6 py-5">Contact</th>
                <th className="px-6 py-5">Engagement</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted-foreground/10">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="group hover:bg-muted/10 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 rounded-[0.75rem] border border-muted-foreground/10">
                        <AvatarImage src={student.image} />
                        <AvatarFallback className="font-black text-xs bg-primary/10 text-primary">{student.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-black truncate">{student.name}</p>
                        <p className="text-[10px] font-bold text-muted-foreground truncate uppercase tracking-wider">Joined {new Date(student.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
                      <span className="flex items-center gap-1.5"><Mail className="h-3 w-3" /> {student.email}</span>
                      {/* @ts-ignore - profile phone injected by DTO */}
                      {(student as any).profile?.phone && <span className="flex items-center gap-1.5 opacity-60">{(student as any).profile.phone}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground">
                        <div className="flex flex-col">
                           <span className="text-foreground">{(student as any)._count?.enrollments || 0}</span>
                           <span className="text-[9px] uppercase tracking-widest">Courses</span>
                        </div>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                    {student.status === 'BLOCKED' ? (
                      <Badge className="bg-destructive/10 text-destructive border-none font-black text-[9px] uppercase tracking-widest px-2">
                        <Ban className="h-3 w-3 mr-1" /> Suspended
                      </Badge>
                    ) : (
                      <Badge className="bg-emerald-500/10 text-emerald-600 border-none font-black text-[9px] uppercase tracking-widest px-2">
                        <CheckCircle2 className="h-3 w-3 mr-1" /> Active
                      </Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-[0.625rem]">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 p-2 rounded-[0.75rem] font-bold">
                        <DropdownMenuLabel className="px-2 py-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">Administration</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                          <Search className="h-4 w-4" /> View Safe Profile
                        </DropdownMenuItem>
                        
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel className="px-2 py-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">Role Management</DropdownMenuLabel>
                        <DropdownMenuItem 
                          className="gap-2 cursor-pointer"
                          onClick={() => updateRoleMutation.mutate({ id: student.id, role: "MANAGER" })}
                        >
                           Make Manager
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="gap-2 cursor-pointer"
                          onClick={() => updateRoleMutation.mutate({ id: student.id, role: "INSTRUCTOR" })}
                        >
                           Make Instructor
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />
                        {student.status === 'ACTIVE' ? (
                           <AlertDialog>
                              <AlertDialogTrigger asChild>
                                 <div className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground text-destructive focus:text-destructive gap-2">
                                    <Ban className="h-4 w-4" /> Suspend Account
                                 </div>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="rounded-[1.25rem]">
                                 <AlertDialogHeader>
                                    <AlertDialogTitle className="font-black text-xl flex items-center gap-2">
                                       <ShieldAlert className="h-5 w-5 text-destructive" /> Confirm Suspension
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="font-medium">
                                       Are you sure you want to suspend <strong>{student.name}</strong>? This will immediately revoke their access to the platform. This action is logged for compliance.
                                    </AlertDialogDescription>
                                 </AlertDialogHeader>
                                 <AlertDialogFooter>
                                    <AlertDialogCancel className="font-bold rounded-[0.75rem]">Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                      className="font-bold rounded-[0.75rem] bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      onClick={() => handleStatusChange(student.id, "BLOCKED")}
                                    >
                                       Yes, Suspend Account
                                    </AlertDialogAction>
                                 </AlertDialogFooter>
                              </AlertDialogContent>
                           </AlertDialog>
                        ) : (
                           <DropdownMenuItem 
                             className="gap-2 text-emerald-600 focus:text-emerald-600 cursor-pointer"
                             onClick={() => handleStatusChange(student.id, "ACTIVE")}
                           >
                              <ShieldCheck className="h-4 w-4" /> Reactivate Account
                           </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-muted-foreground font-black uppercase tracking-widest opacity-40">
                    No students found matching your criteria.
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
