"use client";

import { useInstructorAssignments } from "@/hooks/useAssignments";
import { useMyCourses } from "@/hooks/useInstructorData";
import { Loading } from "@/components/shared/Loading";
import { ErrorState } from "@/components/shared/ErrorState";
import { 
  FileText, 
  Calendar, 
  Users, 
  Clock, 
  ArrowRight, 
  MoreVertical, 
  Plus,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useCreateAssignment } from "@/hooks/useAssignments";

export default function InstructorAssignmentsPage() {
  const { data: assignmentsData, isLoading, isError, refetch } = useInstructorAssignments();
  const { data: coursesData } = useMyCourses();
  const createMutation = useCreateAssignment();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  if (isLoading) return <Loading />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;

  const assignments = assignmentsData?.data || [];

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const dueDate = formData.get('dueDate') as string;
    const courseId = formData.get('courseId') as string;

    if (!title || !description || !dueDate || !courseId) return;

    createMutation.mutate({
      title,
      description,
      dueDate: new Date(dueDate).toISOString(),
      courseId,
    }, {
      onSuccess: () => {
        setIsCreateOpen(false);
      }
    });
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight">Assignments.</h1>
          <p className="text-muted-foreground font-medium">Evaluate student progress and provide constructive feedback.</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="font-black h-12 px-8 rounded-[0.75rem] gap-2 shadow-lg shadow-primary/20">
               <Plus className="h-5 w-5" /> Create Assignment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Assignment</DialogTitle>
              <DialogDescription>Define a new practical assessment for your students.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateSubmit} className="space-y-5 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="courseId">Course</Label>
                  <Select name="courseId" required>
                    <SelectTrigger className="h-11 rounded-[0.75rem] bg-muted/30 border-muted-foreground/10 focus:bg-background transition-all">
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      {coursesData?.data.map((course: any) => (
                        <SelectItem key={course.id} value={course.id}>{course.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
               <div className="space-y-2">
                 <Label htmlFor="title">Assignment Title</Label>
                 <Input id="title" name="title" placeholder="e.g., Build a REST API" required />
               </div>
               <div className="space-y-2">
                 <Label htmlFor="description">Instructions</Label>
                 <Textarea id="description" name="description" placeholder="Describe the task details..." className="h-24 resize-none" required />
               </div>
               <div className="space-y-2">
                 <Label htmlFor="dueDate">Due Date</Label>
                 <Input id="dueDate" name="dueDate" type="date" required />
               </div>
               <Button type="submit" className="w-full h-11 font-black shadow-lg" disabled={createMutation.isPending}>
                 {createMutation.isPending ? "Deploying..." : "Deploy Assignment"}
               </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {assignments.map((assignment) => (
          <div key={assignment.id} className="saas-card group hover:border-primary/40 transition-all bg-card border-muted-foreground/10 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="h-10 w-10 rounded-[0.625rem] bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="flex flex-col items-end gap-1.5">
                   <Badge variant="outline" className="font-black text-[9px] uppercase tracking-widest bg-muted/50 border-none">
                      {assignment.course.title}
                   </Badge>
                   {assignment.pendingCount > 0 ? (
                      <Badge className="bg-amber-500/10 text-amber-600 border-none font-black text-[9px] uppercase tracking-widest px-2 animate-pulse">
                         {assignment.pendingCount} Pending
                      </Badge>
                   ) : (
                      <Badge className="bg-emerald-500/10 text-emerald-600 border-none font-black text-[9px] uppercase tracking-widest px-2">
                         All Graded
                      </Badge>
                   )}
                </div>
              </div>
              
              <div className="space-y-1">
                <h3 className="text-xl font-black leading-tight group-hover:text-primary transition-colors">{assignment.title}</h3>
                <p className="text-xs font-medium text-muted-foreground line-clamp-2">{assignment.description}</p>
              </div>

              <div className="flex items-center gap-4 pt-2">
                 <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                    <Calendar className="h-3.5 w-3.5" /> Due {new Date(assignment.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                 </div>
                 <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                    <Users className="h-3.5 w-3.5" /> {assignment._count.submissions} Total
                 </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-muted-foreground/10 flex items-center gap-2">
               <Link href={`/manager/assignments/${assignment.id}/submissions`} className="flex-1">
                  <Button className="w-full font-black rounded-[0.625rem] h-11 gap-2">
                     Review Submissions <ArrowRight className="h-4 w-4" />
                  </Button>
               </Link>
               <Button variant="ghost" size="icon" className="h-11 w-11 rounded-[0.625rem] hover:bg-primary/10 hover:text-primary">
                  <MoreVertical className="h-5 w-5" />
               </Button>
            </div>
          </div>
        ))}

        {assignments.length === 0 && (
          <div className="col-span-full py-20 text-center saas-card bg-transparent border-dashed border-2 flex flex-col items-center gap-4 border-muted-foreground/20">
             <AlertCircle className="h-12 w-12 text-muted-foreground opacity-20" />
             <h3 className="text-xl font-bold">No assignments yet</h3>
             <p className="text-muted-foreground max-w-sm mx-auto font-medium">Create assessments to track your students&apos; practical skills.</p>
             <Button variant="outline" className="font-bold border-muted-foreground/30">Define Your First Assignment</Button>
          </div>
        )}
      </div>
    </div>
  );
}
