"use client";

import { useState } from "react";
import { usePendingCourses, useUpdateCourseStatus } from "@/hooks/useAdminData";
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
  ExternalLink,
  BookMarked
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AdminPendingCoursesPage() {
  const { data: coursesData, isLoading, isError, refetch } = usePendingCourses();
  const updateStatusMutation = useUpdateCourseStatus();
  
  const [searchTerm, setSearchTerm] = useState("");

  if (isLoading) return <Loading />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;

  const pendingCourses = coursesData?.data || [];

  const filteredCourses = pendingCourses.filter((course) => {
    return course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           course.instructor?.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-foreground flex items-center gap-3">
             Course Review <BookOpen className="h-8 w-8 text-primary" />
          </h1>
          <p className="text-muted-foreground font-medium text-lg">Evaluate and approve new curriculum submissions.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-muted/30 p-4 rounded-[1rem] border border-muted-foreground/10">
         <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search courses or instructors..." 
              className="pl-10 h-11 rounded-[0.75rem] border-none bg-background shadow-none" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
         <Button variant="outline" size="icon" className="h-11 w-11 rounded-[0.75rem] bg-background border-none shrink-0"><Filter className="h-4 w-4" /></Button>
      </div>

      <div className="grid gap-6">
        {filteredCourses.map((course) => (
          <div key={course.id} className="saas-card group bg-card border-muted-foreground/10 hover:border-primary/40 transition-all shadow-sm">
            <div className="flex flex-col md:flex-row items-start justify-between gap-6">
              
              <div className="space-y-4 flex-1">
                 <div className="flex items-center gap-3">
                    <Badge className="bg-amber-500/10 text-amber-600 border-none font-black text-[9px] uppercase tracking-widest px-2">
                       <Clock className="h-3 w-3 mr-1" /> Pending Approval
                    </Badge>
                    <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest">
                       {course.category?.name || "Uncategorized"}
                    </Badge>
                    <span className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                       <BookMarked className="h-3 w-3" /> {course.level || "ALL LEVELS"}
                    </span>
                 </div>
                 
                 <div>
                    <h3 className="text-2xl font-black text-foreground mb-1 group-hover:text-primary transition-colors">{course.title}</h3>
                    <p className="text-sm text-muted-foreground font-medium max-w-3xl line-clamp-2">
                       {course.description || "No description provided."}
                    </p>
                 </div>

                 <div className="flex items-center gap-4 pt-2">
                    <div className="flex items-center gap-3 p-2 pr-4 bg-muted/30 rounded-xl border border-muted-foreground/10">
                       <Avatar className="h-8 w-8 rounded-lg">
                          <AvatarImage src={course.instructor?.image} />
                          <AvatarFallback className="text-[10px] font-black bg-primary/10 text-primary">{course.instructor?.name?.charAt(0)}</AvatarFallback>
                       </Avatar>
                       <div className="flex flex-col">
                          <span className="text-xs font-bold leading-tight">{course.instructor?.name}</span>
                          <span className="text-[10px] font-medium text-muted-foreground">Instructor</span>
                       </div>
                    </div>
                    
                    <div className="flex flex-col">
                       <span className="text-lg font-black text-emerald-600">${course.price}</span>
                       <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Pricing</span>
                    </div>
                 </div>
              </div>

              <div className="flex flex-col gap-3 w-full md:w-48 border-t md:border-t-0 pt-4 md:pt-0 shrink-0">
                <Link href={`/learn/${course.slug || course.id}?preview=true`} target="_blank">
                   <Button variant="outline" className="w-full font-black rounded-[0.75rem] h-11 gap-2 border-primary/20 hover:bg-primary/5">
                      <Eye className="h-4 w-4" /> Preview Course
                   </Button>
                </Link>
                <Button 
                   className="w-full font-black rounded-[0.75rem] h-11 shadow-lg shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-700 gap-2"
                   onClick={() => updateStatusMutation.mutate({ id: course.id, status: 'PUBLISHED' })}
                   disabled={updateStatusMutation.isPending}
                >
                   <CheckCircle2 className="h-4 w-4" /> Publish Course
                </Button>
                <Button 
                   variant="ghost"
                   className="w-full font-black rounded-[0.75rem] h-11 text-destructive hover:text-destructive hover:bg-destructive/10 gap-2"
                   onClick={() => updateStatusMutation.mutate({ id: course.id, status: 'REJECTED' })}
                   disabled={updateStatusMutation.isPending}
                >
                   <XCircle className="h-4 w-4" /> Reject Draft
                </Button>
              </div>

            </div>
          </div>
        ))}

        {filteredCourses.length === 0 && (
           <div className="py-24 text-center saas-card bg-transparent border-dashed border-2 flex flex-col items-center gap-4 border-muted-foreground/20">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                 <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-black text-foreground/80 tracking-tight">Queue Clear.</h3>
              <p className="text-muted-foreground max-w-sm mx-auto font-medium">
                 All course submissions have been reviewed. Instructors are hard at work!
              </p>
           </div>
        )}
      </div>
    </div>
  );
}
