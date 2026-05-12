"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdminInstructors, usePendingInstructors, useUpdateUserStatus } from "@/hooks/useAdminData";
import { Loading } from "@/components/shared/Loading";
import { ErrorState } from "@/components/shared/ErrorState";
import {
  ShieldCheck,
  UserCheck,
  UserX,
  Mail,
  Calendar,
  Search,
  Filter,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  FileText,
  BadgeCheck,
  Ban
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
import { useState } from "react";
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



export default function AdminInstructorsPage() {
  const { data: pendingData, isLoading: pendingLoading, refetch: refetchPending } = usePendingInstructors();
  const { data: activeData, isLoading: activeLoading, refetch: refetchActive } = useAdminInstructors();
  const updateStatusMutation = useUpdateUserStatus();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("active");

  if (pendingLoading || activeLoading) return <Loading />;

  const pendingInstructors = pendingData?.data || [];
  const activeInstructors = activeData?.data || [];

  const filterInstructors = (list: any[]) => list.filter((inst) =>
    inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inst.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusChange = (id: string, status: "ACTIVE" | "BLOCKED") => {
    updateStatusMutation.mutate({ id, status });
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-foreground">Educators.</h1>
          <p className="text-muted-foreground font-medium text-lg">Manage instructor profiles and review pending applications.</p>
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
        <Button variant="outline" size="icon" className="h-11 w-11 rounded-[0.75rem] bg-background border-none"><Filter className="h-4 w-4" /></Button>
      </div>

      <Tabs defaultValue="active" onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-muted/50 p-1 rounded-[1rem] h-14 mb-8">
          <TabsTrigger value="active" className="rounded-[0.75rem] font-black text-xs uppercase tracking-widest px-8 h-full data-[state=active]:bg-background data-[state=active]:shadow-sm">
            Active Instructors
          </TabsTrigger>
          <TabsTrigger value="pending" className="rounded-[0.75rem] font-black text-xs uppercase tracking-widest px-8 h-full data-[state=active]:bg-background data-[state=active]:shadow-sm relative">
            Pending Approvals
            {pendingInstructors.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] text-white">
                {pendingInstructors.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* ACTIVE INSTRUCTORS TAB */}
        <TabsContent value="active" className="mt-0">
          <div className="saas-card p-0 overflow-hidden shadow-xl border-none">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-muted/50 border-b text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  <tr>
                    <th className="px-6 py-5">Instructor Identity</th>
                    <th className="px-6 py-5">Contact</th>
                    <th className="px-6 py-5">Platform Stats</th>
                    <th className="px-6 py-5">Status</th>
                    <th className="px-6 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-muted-foreground/10">
                  {filterInstructors(activeInstructors).map((instructor) => (
                    <tr key={instructor.id} className="group hover:bg-muted/10 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 rounded-[0.75rem] border border-muted-foreground/10">
                            <AvatarImage src={instructor.image} />
                            <AvatarFallback className="font-black text-xs bg-primary/10 text-primary">{instructor.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-sm font-black truncate">{instructor.name}</p>
                            <p className="text-[10px] font-bold text-muted-foreground truncate uppercase tracking-wider">{instructor.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
                          <span className="flex items-center gap-1.5"><Mail className="h-3 w-3" /> {instructor.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground">
                          <div className="flex flex-col">
                            <span className="text-foreground">{(instructor as any)._count?.enrollments || 0}</span>
                            <span className="text-[9px] uppercase tracking-widest">Enrollments</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {instructor.status === 'BLOCKED' ? (
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
                            {instructor.status === 'ACTIVE' ? (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <div className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground text-destructive focus:text-destructive gap-2">
                                    <Ban className="h-4 w-4" /> Suspend Instructor
                                  </div>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="rounded-[1.25rem]">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle className="font-black text-xl flex items-center gap-2">
                                      <AlertCircle className="h-5 w-5 text-destructive" /> Confirm Suspension
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="font-medium">
                                      Are you sure you want to suspend <strong>{instructor.name}</strong>? Their courses will be hidden. This action is logged.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="font-bold rounded-[0.75rem]">Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      className="font-bold rounded-[0.75rem] bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      onClick={() => handleStatusChange(instructor.id, "BLOCKED")}
                                    >
                                      Yes, Suspend Account
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            ) : (
                              <DropdownMenuItem
                                className="gap-2 text-emerald-600 focus:text-emerald-600 cursor-pointer"
                                onClick={() => handleStatusChange(instructor.id, "ACTIVE")}
                              >
                                <ShieldCheck className="h-4 w-4" /> Reactivate Account
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                  {filterInstructors(activeInstructors).length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-20 text-center text-muted-foreground font-black uppercase tracking-widest opacity-40">
                        No active instructors found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* PENDING APPROVALS TAB */}
        <TabsContent value="pending" className="mt-0 space-y-6">
          {filterInstructors(pendingInstructors).map((instructor) => (
            <div key={instructor.id} className="saas-card group bg-card border-muted-foreground/10 hover:border-primary/40 transition-all shadow-sm">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <Avatar className="h-16 w-16 rounded-2xl border-2 border-background shadow-md">
                      <AvatarImage src={instructor.image} />
                      <AvatarFallback className="bg-primary/10 text-primary font-black text-xl">
                        {instructor.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-amber-500 border-2 border-background flex items-center justify-center text-white">
                      <AlertCircle className="h-3 w-3" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-black group-hover:text-primary transition-colors">{instructor.name}</h3>
                      <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-600 border-none px-2 py-0.5">
                        Pending
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-medium text-muted-foreground">
                      <div className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {instructor.email}</div>
                      <div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Applied {new Date(instructor.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  <Button
                    variant="outline"
                    className="flex-1 md:flex-none font-black rounded-[0.75rem] h-11 px-6 border-destructive/20 text-destructive hover:bg-destructive/10"
                    onClick={() => handleStatusChange(instructor.id, "BLOCKED")}
                    disabled={updateStatusMutation.isPending}
                  >
                    <UserX className="h-4 w-4 mr-2" /> Reject
                  </Button>
                  <Button
                    className="flex-1 md:flex-none font-black rounded-[0.75rem] h-11 px-8 gap-2 shadow-lg shadow-primary/20"
                    onClick={() => handleStatusChange(instructor.id, "ACTIVE")}
                    disabled={updateStatusMutation.isPending}
                  >
                    <UserCheck className="h-4 w-4" /> Approve Instructor
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-11 w-11 rounded-[0.75rem] border border-muted-foreground/10">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 p-2 rounded-[0.75rem] font-bold">
                      <DropdownMenuLabel className="px-2 py-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">Verification Tools</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="gap-2 cursor-pointer">
                        <FileText className="h-4 w-4" /> View Resume / Portfolio
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 cursor-pointer">
                        <BadgeCheck className="h-4 w-4" /> Verify Social Profiles
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))}

          {filterInstructors(pendingInstructors).length === 0 && (
            <div className="py-24 text-center saas-card bg-transparent border-dashed border-2 flex flex-col items-center gap-4 border-muted-foreground/20">
              <div className="h-16 w-16 rounded-full bg-muted/30 flex items-center justify-center text-muted-foreground/40 mb-2">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-black text-foreground/80 tracking-tight">Queue Clear.</h3>
              <p className="text-muted-foreground max-w-sm mx-auto font-medium">
                All instructor applications have been processed. Great job keeping the community moving!
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
