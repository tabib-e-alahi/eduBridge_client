"use client";

import { useState } from "react";
import { useMyCourses, useDeleteCourse, useUpdateCourse } from "@/hooks/useInstructorData";
import { Loading } from "@/components/shared/Loading";
import { ErrorState } from "@/components/shared/ErrorState";
import {
  Search, 
  Filter, 
  MoreVertical, 
  Plus, 
  Edit, 
  Archive, 
  Eye,
  Users,
  Star,
  LayoutGrid,
  List,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  FileText,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { useAuth } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function InstructorCoursesPage() {
  const { data: session, isPending: isAuthLoading } = useAuth();
  const router = useRouter();
  const { data: coursesData, isLoading, isError, refetch } = useMyCourses();
  const deleteMutation = useDeleteCourse();
  const updateMutation = useUpdateCourse();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    if (!isAuthLoading && !session) {
      router.push("/auth/login");
    } else if (session && !["INSTRUCTOR", "MANAGER", "ADMIN"].includes((session.user as any).role)) {
      router.push("/dashboard");
    }
  }, [session, isAuthLoading, router]);

  if (isLoading || isAuthLoading) return <Loading />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;

  const courses = coursesData?.data || [];
  const filteredCourses = courses.filter((course: any) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || course.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "PUBLISHED": return <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-none font-black text-[9px] uppercase tracking-widest px-2">Live</Badge>;
      case "DRAFT": return <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-none font-black text-[9px] uppercase tracking-widest px-2">Draft</Badge>;
      case "PENDING": return <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-none font-black text-[9px] uppercase tracking-widest px-2">Pending</Badge>;
      case "ARCHIVED": return <Badge className="bg-muted text-muted-foreground border-none font-black text-[9px] uppercase tracking-widest px-2">Archived</Badge>;
      default: return null;
    }
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight">Curriculum.</h1>
          <p className="text-muted-foreground font-medium">Manage your educational intellectual property.</p>
        </div>
        <Link href="/manager/courses/create">
           <Button className="font-black h-12 px-8 rounded-[0.75rem] gap-2 shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all">
              <Plus className="h-5 w-5" /> Create New Course
           </Button>
        </Link>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="saas-card p-4 border border-muted-foreground/10 bg-primary/5">
           <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Total Assets</p>
           <p className="text-2xl font-black">{courses.length}</p>
        </div>
        <div className="saas-card p-4 border border-muted-foreground/10 bg-emerald-500/5">
           <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Total Audience</p>
           <p className="text-2xl font-black">{courses.reduce((acc, c: any) => acc + (c._count?.enrollments || 0), 0)}</p>
        </div>
        <div className="saas-card p-4 border border-muted-foreground/10 bg-amber-500/5">
           <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Estimated Value</p>
           <p className="text-2xl font-black">${courses.reduce((acc, c: any) => acc + (c.price * (c._count?.enrollments || 0)), 0).toLocaleString()}</p>
        </div>
        <div className="saas-card p-4 border border-muted-foreground/10 bg-blue-500/5">
           <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Published</p>
           <p className="text-2xl font-black">{courses.filter((c: any) => c.status === "PUBLISHED").length}</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-muted/30 p-4 rounded-[1rem] border border-muted-foreground/10">
         <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Filter by title or keywords..." 
              className="pl-10 h-11 rounded-[0.625rem] bg-background/50 border-none shadow-none focus-visible:ring-1 focus-visible:ring-primary" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
         <div className="flex items-center gap-3 w-full md:w-auto">
            <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || "ALL")}>
               <SelectTrigger className="h-11 w-[160px] rounded-[0.625rem] bg-background/50 border-none font-bold text-xs uppercase tracking-widest">
                  <SelectValue placeholder="All Status" />
               </SelectTrigger>
               <SelectContent className="font-bold">
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
               </SelectContent>
            </Select>
            <div className="h-11 bg-background/50 rounded-[0.625rem] p-1 flex items-center">
               <Button 
                  variant={viewMode === "list" ? "secondary" : "ghost"} 
                  size="icon" 
                  className="h-9 w-9 rounded-md" 
                  onClick={() => setViewMode("list")}
               >
                  <List className="h-4 w-4" />
               </Button>
               <Button 
                  variant={viewMode === "grid" ? "secondary" : "ghost"} 
                  size="icon" 
                  className="h-9 w-9 rounded-md" 
                  onClick={() => setViewMode("grid")}
               >
                  <LayoutGrid className="h-4 w-4" />
               </Button>
            </div>
         </div>
      </div>

      {viewMode === "list" ? (
        <div className="saas-card p-0 overflow-hidden shadow-xl border-none">
          <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
                <thead className="bg-muted/50 border-b text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                   <tr>
                      <th className="px-6 py-5">Course Intellectual Property</th>
                      <th className="px-6 py-5">Audience</th>
                      <th className="px-6 py-5">Pricing</th>
                      <th className="px-6 py-5">Performance</th>
                      <th className="px-6 py-5">State</th>
                      <th className="px-6 py-5 text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-muted-foreground/10">
                   {filteredCourses.map((course: any) => (
                      <tr key={course.id} className="group hover:bg-muted/10 transition-colors">
                         <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                               <div className="h-12 w-20 bg-muted rounded-[0.5rem] overflow-hidden relative shrink-0 border border-muted-foreground/10">
                                  <img src={course.thumbnailUrl || "/no_image.jpg"} className="object-cover h-full w-full group-hover:scale-110 transition-transform duration-500" alt="" />
                               </div>
                               <div className="min-w-0">
                                  <p className="text-sm font-black truncate group-hover:text-primary transition-colors">{course.title}</p>
                                  <p className="text-[10px] font-bold text-muted-foreground uppercase mt-0.5 tracking-wider">{course.category?.name || 'Uncategorized'} • {course.level}</p>
                               </div>
                            </div>
                         </td>
                         <td className="px-6 py-4">
                            <div className="flex items-center gap-2 font-black text-sm">
                               <Users className="h-4 w-4 text-primary" />
                               <span>{course._count.enrollments} Students</span>
                            </div>
                         </td>
                         <td className="px-6 py-4 font-black text-sm text-emerald-600">
                            ${course.price.toFixed(2)}
                         </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5 font-black text-sm text-amber-500">
                               <Star className="h-4 w-4 fill-current" />
                               <span>{course._count?.reviews > 0 ? (course.rating || 0).toFixed(1) : "0.0"}</span>
                            </div>
                          </td>
                         <td className="px-6 py-4">
                            {getStatusBadge(course.status)}
                         </td>
                         <td className="px-6 py-4 text-right">
                            <DropdownMenu>
                               <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-[0.5rem] hover:bg-primary/10 hover:text-primary">
                                     <MoreVertical className="h-5 w-5" />
                                  </Button>
                               </DropdownMenuTrigger>
                               <DropdownMenuContent align="end" className="w-56 p-2 rounded-[0.75rem] font-bold">
                                  <DropdownMenuLabel className="px-2 py-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">Management</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem asChild>
                                     <Link href={`/manager/courses/edit/${course.id}`} className="flex items-center gap-2 cursor-pointer">
                                        <Edit className="h-4 w-4" /> Edit Curriculum
                                     </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                     <Link href={`/learn/${course.slug}`} target="_blank" className="flex items-center gap-2 cursor-pointer">
                                        <Eye className="h-4 w-4" /> Preview Student View
                                     </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuLabel className="px-2 py-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">State Controls</DropdownMenuLabel>
                                  {course.status !== 'PUBLISHED' && (
                                     <DropdownMenuItem 
                                       className="gap-2 text-emerald-600 focus:text-emerald-600 cursor-pointer"
                                       onClick={() => {
                                         if(confirm("Are you sure you want to publish this course live?")) {
                                            updateMutation.mutate({ id: course.id, payload: { status: 'PUBLISHED' } });
                                         }
                                       }}
                                     >
                                        <CheckCircle2 className="h-4 w-4" /> Go Live
                                     </DropdownMenuItem>
                                  )}
                                  {course.status === 'PUBLISHED' && (
                                     <DropdownMenuItem 
                                       className="gap-2 text-amber-600 focus:text-amber-600 cursor-pointer"
                                       onClick={() => {
                                         if(confirm("Are you sure you want to revert this course to draft?")) {
                                            updateMutation.mutate({ id: course.id, payload: { status: 'DRAFT' } });
                                         }
                                       }}
                                     >
                                        <AlertTriangle className="h-4 w-4" /> Revert to Draft
                                     </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem 
                                    className="gap-2 text-destructive focus:text-destructive cursor-pointer"
                                    onClick={() => deleteMutation.mutate(course.id)}
                                  >
                                     <Archive className="h-4 w-4" /> Archive Asset
                                  </DropdownMenuItem>
                               </DropdownMenuContent>
                            </DropdownMenu>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
           {filteredCourses.map((course: any) => (
              <div key={course.id} className="saas-card group !p-0 overflow-hidden border border-muted-foreground/10 hover:border-primary/30 transition-all hover:shadow-2xl hover:-translate-y-1">
                 <div className="aspect-video relative overflow-hidden bg-muted">
                    <img src={course.thumbnailUrl || "/no_image.jpg"} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" alt={course.title} />
                    <div className="absolute top-4 right-4">
                       {getStatusBadge(course.status)}
                    </div>
                 </div>
                 <div className="p-6 space-y-4">
                    <div className="space-y-1">
                       <h3 className="text-xl font-black leading-tight group-hover:text-primary transition-colors line-clamp-1">{course.title}</h3>
                       <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{course.category?.name} • {course.level}</p>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm font-black border-y py-3 border-muted-foreground/10">
                       <div className="flex items-center gap-1.5">
                          <Users className="h-4 w-4 text-primary" />
                          <span>{course._count?.enrollments || 0} Students</span>
                       </div>
                       <div className="flex items-center gap-1.5 text-amber-500">
                          <Star className="h-4 w-4 fill-current" />
                          <span>{course._count?.reviews > 0 ? (course.rating || 0).toFixed(1) : "0.0"}</span>
                       </div>
                    </div>
                    <div className="flex items-center justify-between pt-4">
                       <div className="text-emerald-600 font-black text-lg">${course.price.toFixed(2)}</div>
                    </div>

                    <div className="flex gap-2 pt-1">
                       <Button  variant="outline" className="flex-1 h-10 rounded-[0.625rem] font-bold text-xs gap-2">
                          <Link href={`/manager/courses/edit/${course.id}`}>
                             <Edit className="h-3.5 w-3.5" /> Edit
                          </Link>
                       </Button>
                       <Button  className="h-10 w-10 rounded-[0.625rem] p-0 shrink-0">
                          <Link href={`/learn/${course.slug}`} target="_blank">
                             <ExternalLink className="h-4 w-4" />
                          </Link>
                       </Button>
                    </div>
                 </div>
              </div>
           ))}
        </div>
      )}

      {filteredCourses.length === 0 && (
         <div className="col-span-full py-20 text-center saas-card bg-transparent border-dashed border-2 flex flex-col items-center gap-4">
            <FileText className="h-12 w-12 text-muted-foreground opacity-20" />
            <h3 className="text-xl font-bold">No assets found</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">Create your first course to begin sharing your knowledge with the world.</p>
            <Link href="/manager/courses/create">
               <Button className="font-bold gap-2">Create Course <ChevronRight className="h-4 w-4" /></Button>
            </Link>
         </div>
      )}
    </div>
  );
}
