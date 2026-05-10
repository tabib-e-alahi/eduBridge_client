"use client";

import { useState } from "react";
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Upload,
  Search,
  Filter,
  ChevronRight,
  MoreVertical,
  History,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useUserAssignments, useSubmitAssignment, Assignment } from "@/hooks/useAssignments";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export default function AssignmentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const { data, isLoading, isError, refetch } = useUserAssignments();
  const submitMutation = useSubmitAssignment();

  if (isLoading) return <Loading />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;

  const assignments = data?.data || [];

  // Transform data for UI
  const formattedAssignments = assignments.map((assignment: Assignment) => {
    let status = "pending";
    let score = null;

    const submission = assignment.submissions?.[0];
    if (submission) {
      if (submission.status === "GRADED") {
        status = "graded";
        score = submission.grade;
      } else {
        status = "submitted";
      }
    }

    return {
      ...assignment,
      uiStatus: status,
      score,
    };
  });

  const filteredAssignments = formattedAssignments.filter(a => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.course?.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingCount = formattedAssignments.filter(a => a.uiStatus === 'pending').length;
  const reviewCount = formattedAssignments.filter(a => a.uiStatus === 'submitted').length;
  const gradedCount = formattedAssignments.filter(a => a.uiStatus === 'graded').length;

  const renderAssignmentList = (statusFilter?: string) => {
    const list = statusFilter && statusFilter !== 'all'
      ? filteredAssignments.filter(a => a.uiStatus === statusFilter)
      : filteredAssignments;

    if (list.length === 0) {
      return (
        <div className="py-24 text-center space-y-4 lms-card bg-muted/20 border-dashed">
          <div className="h-16 w-16 bg-card rounded-full flex items-center justify-center mx-auto border border-border">
             <FileText className="h-8 w-8 text-muted-foreground/30" />
          </div>
          <div className="space-y-1">
             <h3 className="font-bold text-lg">No assignments found</h3>
             <p className="text-muted-foreground text-sm max-w-xs mx-auto">You have no tasks matching this filter. Keep up the good work!</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {list.map((assignment) => (
          <div key={assignment.id} className="lms-card lms-card-hover p-6 flex flex-col md:flex-row justify-between gap-6 md:items-center">
            <div className="flex gap-4 items-start">
              <div className={cn(
                 "h-12 w-12 rounded-lg flex items-center justify-center shrink-0 border border-border",
                 assignment.uiStatus === 'pending' ? 'bg-amber-50 text-amber-600' : 
                 assignment.uiStatus === 'submitted' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
              )}>
                <FileText className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                 <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base group-hover:text-primary transition-colors leading-tight">{assignment.title}</h3>
                    <Badge variant="outline" className={cn(
                       "badge-status border-none font-bold text-[10px]",
                       assignment.uiStatus === 'pending' ? 'badge-pending' : 
                       assignment.uiStatus === 'submitted' ? 'badge-completed' : 'badge-active'
                    )}>
                       {assignment.uiStatus === 'pending' ? 'Pending' : 
                        assignment.uiStatus === 'submitted' ? 'Under Review' : 'Completed'}
                    </Badge>
                 </div>
                 <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                    <BookOpen className="h-3 w-3" />
                    {assignment.course?.title}
                 </div>
                 <div className="flex items-center gap-4 pt-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                       <Clock className="h-3 w-3 text-primary" /> 
                       Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </div>
                    {assignment.uiStatus === 'graded' && (
                       <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                          <CheckCircle2 className="h-3 w-3" /> 
                          Score: {assignment.score}/100
                       </div>
                    )}
                 </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 md:justify-end border-t md:border-t-0 pt-4 md:pt-0">
               {assignment.uiStatus === "pending" ? (
                 <Dialog>
                   <DialogTrigger asChild>
                     <Button className="h-10 px-6 font-bold flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        Submit Project
                     </Button>
                   </DialogTrigger>
                   <DialogContent className="sm:max-w-lg p-8">
                     <DialogHeader className="space-y-3">
                        <DialogTitle className="text-xl font-bold">Submit Assignment</DialogTitle>
                        <DialogDescription className="text-sm font-medium">
                          Upload your work for <span className="text-foreground font-bold">{assignment.title}</span>. Ensure all instructions are followed.
                        </DialogDescription>
                     </DialogHeader>
                     <form 
                       onSubmit={(e) => {
                         e.preventDefault();
                         const formData = new FormData(e.currentTarget);
                         const content = formData.get('content') as string;
                         const fileUrl = formData.get('fileUrl') as string;
                         submitMutation.mutate({
                           assignmentId: assignment.id,
                           content,
                           fileUrl
                         });
                       }}
                       className="space-y-6 mt-4"
                     >
                       <div className="space-y-2">
                         <Label htmlFor="content" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Submission Details</Label>
                         <Textarea 
                           id="content" 
                           name="content"
                           placeholder="Describe your submission or provide necessary links..." 
                           className="resize-none h-32 rounded-lg border-border bg-muted/20 font-medium"
                           required
                         />
                       </div>
                       <div className="space-y-2">
                         <Label htmlFor="fileUrl" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">External Link (Optional)</Label>
                         <Input 
                            id="fileUrl"
                            name="fileUrl"
                            placeholder="Link to your project files (Google Drive, GitHub, etc.)"
                            className="h-11 rounded-lg border-border bg-muted/20 font-medium"
                         />
                       </div>
                       <Button 
                         type="submit" 
                         className="w-full h-12 font-bold"
                         disabled={submitMutation.isPending}
                       >
                         {submitMutation.isPending ? "Submitting..." : "Finish Submission"}
                       </Button>
                     </form>
                   </DialogContent>
                 </Dialog>
               ) : (
                 <Button variant="outline" className="h-10 px-6 font-bold" disabled>
                    {assignment.uiStatus === 'submitted' ? 'Under Evaluation' : 'View Feedback'}
                 </Button>
               )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader 
        title="Assignments" 
        subtitle="Manage your practical assessments and track your grading status."
        actions={
          <Button variant="outline" className="font-semibold h-10 px-4">Submission History</Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Pending Tasks" 
          value={pendingCount} 
          subtitle="Awaiting submission" 
          icon={Clock} 
          variant="amber" 
        />
        <StatCard 
          title="Under Review" 
          value={reviewCount} 
          subtitle="Currently being graded" 
          icon={History} 
          variant="blue" 
        />
        <StatCard 
          title="Completed" 
          value={gradedCount} 
          subtitle="Successfully graded" 
          icon={CheckCircle2} 
          variant="emerald" 
        />
      </div>

      <div className="space-y-6">
        <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <TabsList className="bg-muted/50 border border-border h-11 p-1 rounded-lg">
              <TabsTrigger value="all" className="px-5 h-full rounded-md data-[state=active]:bg-card data-[state=active]:shadow-sm font-semibold text-sm">All Assignments</TabsTrigger>
              <TabsTrigger value="pending" className="px-5 h-full rounded-md data-[state=active]:bg-card data-[state=active]:shadow-sm font-semibold text-sm">Pending</TabsTrigger>
              <TabsTrigger value="submitted" className="px-5 h-full rounded-md data-[state=active]:bg-card data-[state=active]:shadow-sm font-semibold text-sm">In Review</TabsTrigger>
              <TabsTrigger value="graded" className="px-5 h-full rounded-md data-[state=active]:bg-card data-[state=active]:shadow-sm font-semibold text-sm">Graded</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-3 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search projects..." 
                  className="pl-10 h-11 rounded-lg bg-card border-border shadow-sm focus-visible:ring-primary/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" className="h-11 w-11 p-0 rounded-lg shrink-0">
                 <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <TabsContent value={activeTab} className="mt-0">
            {renderAssignmentList(activeTab)}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
