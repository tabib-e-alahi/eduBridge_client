"use client";

import { useState } from "react";
import { useAdminCourses, useUpdateCourseStatus } from "@/hooks/useAdminData";
import { Loading } from "@/components/shared/Loading";
import { ErrorState } from "@/components/shared/ErrorState";
import { 
  BookOpen, 
  Search, 
  Filter,
  CheckCircle2,
  XCircle,
  Eye,
  Clock,
  BookMarked,
  MoreVertical,
  AlertTriangle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminAllCoursesPage() {
  const { data: coursesData, isLoading, isError, refetch } = useAdminCourses();
  const updateStatusMutation = useUpdateCourseStatus();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  if (isLoading) return <Loading />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;

  const courses = coursesData?.data || [];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || course.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-none font-black text-[9px] uppercase tracking-widest px-2"><CheckCircle2 className="h-3 w-3 mr-1" /> Published</Badge>;
      case 'IN_REVIEW':
        return <Badge className="bg-amber-500/10 text-amber-600 border-none font-black text-[9px] uppercase tracking-widest px-2"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
      case 'DRAFT':
        return <Badge variant="outline" className="font-black text-[9px] uppercase tracking-widest px-2">Draft</Badge>;
      case 'REJECTED':
        return <Badge className="bg-destructive/10 text-destructive border-none font-black text-[9px] uppercase tracking-widest px-2"><XCircle className="h-3 w-3 mr-1" /> Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-foreground flex items-center gap-3">
             Course Registry <BookOpen className="h-8 w-8 text-primary" />
          </h1>
          <p className="text-muted-foreground font-medium text-lg">Platform-wide curriculum oversight and status management.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-muted/30 p-4 rounded-[1rem] border border-muted-foreground/10">
         <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by title or instructor..." 
              className="pl-10 h-11 rounded-[0.75rem] border-none bg-background shadow-none" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
         <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto">
            <div className="flex bg-background rounded-[0.75rem] p-1 border border-muted-foreground/10 min-w-max">
               {["ALL", "PUBLISHED", "IN_REVIEW", "DRAFT"].map((filter) => (
                 <Button 
                   key={filter}
                   variant={statusFilter === filter ? 'secondary' : 'ghost'} 
                   size="sm" 
                   className="rounded-[0.5rem] font-bold text-[10px] uppercase px-4 h-9"
                   onClick={() => setStatusFilter(filter)}
                 >
                    {filter}
                 </Button>
               ))}
            </div>
            <Button variant="outline" size="icon" className="h-11 w-11 rounded-[0.75rem] bg-background border-none shrink-0"><Filter className="h-4 w-4" /></Button>
         </div>
      </div>

      <div className="saas-card p-0 overflow-hidden shadow-xl border-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-muted/50 border-b text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-6 py-5">Course Details</th>
                <th className="px-6 py-5">Instructor</th>
                <th className="px-6 py-5">Engagement</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted-foreground/10">
              {filteredCourses.map((course) => (
                <tr key={course.id} className="group hover:bg-muted/10 transition-colors">
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-[0.75rem] bg-muted overflow-hidden shrink-0 border border-muted-foreground/10">
                           <img src={course.thumbnailUrl || "/no_image.jpg"} alt="" className="h-full w-full object-cover" />
                        </div>
                        <div className="min-w-0">
                           <p className="text-sm font-black truncate max-w-[250px] group-hover:text-primary transition-colors">{course.title}</p>
                           <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{course.category?.name || "Uncategorized"}</p>
                        </div>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7 rounded-md">
                           <AvatarImage src={course.instructor?.image} />
                           <AvatarFallback className="text-[8px] font-black">{course.instructor?.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-bold truncate max-w-[120px]">{course.instructor?.name}</span>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex flex-col gap-0.5 text-xs font-bold text-muted-foreground">
                        <span className="text-foreground flex items-center gap-1.5"><Users className="h-3 w-3" /> {course._count?.enrollments || 0} Learners</span>
                        <span className="text-[9px] uppercase tracking-widest opacity-60">Price: ${course.price}</span>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(course.status)}
                  </td>
                  <td className="px-6 py-4 text-right">
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <Button variant="ghost" size="icon" className="h-9 w-9 rounded-[0.625rem]">
                              <MoreVertical className="h-4 w-4" />
                           </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 p-2 rounded-[0.75rem] font-bold">
                           <DropdownMenuLabel className="px-2 py-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">Content Management</DropdownMenuLabel>
                           <DropdownMenuSeparator />
                           <DropdownMenuItem asChild>
                              <Link href={`/learn/${course.slug || course.id}?preview=true`} target="_blank" className="cursor-pointer gap-2">
                                 <Eye className="h-4 w-4" /> Preview Live Page
                              </Link>
                           </DropdownMenuItem>
                           
                           <DropdownMenuSeparator />
                           <DropdownMenuLabel className="px-2 py-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">Status Controls</DropdownMenuLabel>
                           {course.status !== 'PUBLISHED' && (
                              <DropdownMenuItem 
                                 className="gap-2 text-emerald-600 focus:text-emerald-600 cursor-pointer"
                                 onClick={() => updateStatusMutation.mutate({ id: course.id, status: 'PUBLISHED' })}
                              >
                                 <CheckCircle2 className="h-4 w-4" /> Approve & Publish
                              </DropdownMenuItem>
                           )}
                           {course.status === 'IN_REVIEW' && (
                              <DropdownMenuItem 
                                 className="gap-2 text-destructive focus:text-destructive cursor-pointer"
                                 onClick={() => updateStatusMutation.mutate({ id: course.id, status: 'REJECTED' })}
                              >
                                 <XCircle className="h-4 w-4" /> Reject Draft
                              </DropdownMenuItem>
                           )}
                           {course.status === 'PUBLISHED' && (
                              <DropdownMenuItem 
                                 className="gap-2 text-amber-600 focus:text-amber-600 cursor-pointer"
                                 onClick={() => updateStatusMutation.mutate({ id: course.id, status: 'DRAFT' })}
                              >
                                 <AlertTriangle className="h-4 w-4" /> Revert to Draft
                              </DropdownMenuItem>
                           )}
                        </DropdownMenuContent>
                     </DropdownMenu>
                  </td>
                </tr>
              ))}
              {filteredCourses.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-muted-foreground font-black uppercase tracking-widest opacity-40">
                    No courses found matching your criteria.
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
