"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  useAssignmentSubmissions, 
  useGradeSubmission,
  Submission 
} from "@/hooks/useInstructorData";
import { Loading } from "@/components/shared/Loading";
import { ErrorState } from "@/components/shared/ErrorState";
import { 
  ArrowLeft, 
  FileText, 
  User, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  MessageSquare,
  Award,
  MoreVertical,
  Download
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export default function AssignmentSubmissionsPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { data: submissionsData, isLoading, isError, refetch } = useAssignmentSubmissions(id);
  const gradeMutation = useGradeSubmission();

  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [gradeValue, setGradeValue] = useState<string>("");
  const [feedbackValue, setFeedbackValue] = useState<string>("");

  if (isLoading) return <Loading />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;

  const submissions = submissionsData?.data || [];
  const assignmentTitle = submissions.length > 0 ? "Assignment Submissions" : "Submissions";

  const openGradingDialog = (submission: Submission) => {
    setSelectedSubmission(submission);
    setGradeValue(submission.grade?.toString() || "");
    setFeedbackValue(submission.feedback || "");
  };

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission) return;

    gradeMutation.mutate({
      id: selectedSubmission.id,
      payload: {
        grade: Number(gradeValue),
        feedback: feedbackValue
      }
    }, {
      onSuccess: () => setSelectedSubmission(null)
    });
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-full" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-black tracking-tight">{assignmentTitle}</h1>
          <p className="text-muted-foreground font-medium">Review student work and provide official grades.</p>
        </div>
      </div>

      <div className="saas-card p-0 overflow-hidden shadow-xl border-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-muted/50 border-b text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-6 py-5">Student</th>
                <th className="px-6 py-5">Submitted Date</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5">Grade</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted-foreground/10">
              {submissions.map((submission) => (
                <tr key={submission.id} className="group hover:bg-muted/10 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 rounded-[0.75rem] border border-muted-foreground/10">
                        <AvatarFallback className="bg-primary/10 text-primary font-black text-xs">
                          {submission.student.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-black truncate group-hover:text-primary transition-colors">{submission.student.name}</p>
                        <p className="text-[10px] font-bold text-muted-foreground truncate uppercase">{submission.student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(submission.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {submission.status === 'GRADED' ? (
                      <Badge className="bg-emerald-500/10 text-emerald-600 border-none font-black text-[9px] uppercase tracking-widest px-2">
                        <CheckCircle2 className="h-3 w-3 mr-1" /> Graded
                      </Badge>
                    ) : (
                      <Badge className="bg-amber-500/10 text-amber-600 border-none font-black text-[9px] uppercase tracking-widest px-2">
                        <AlertCircle className="h-3 w-3 mr-1" /> Pending
                      </Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 font-black text-sm">
                    {submission.grade !== null ? (
                      <span className="text-emerald-600">{submission.grade}/100</span>
                    ) : (
                      <span className="text-muted-foreground">--</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button 
                      variant="outline" 
                      className="font-black text-xs rounded-[0.625rem] h-9 gap-2 group border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/5"
                      onClick={() => openGradingDialog(submission)}
                    >
                      {submission.status === 'GRADED' ? 'Edit Grade' : 'Grade Now'} <Award className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
                    </Button>
                  </td>
                </tr>
              ))}
              {submissions.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-muted-foreground font-bold uppercase tracking-widest opacity-40">
                    No submissions found for this assignment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grading Dialog */}
      <Dialog open={!!selectedSubmission} onOpenChange={(open) => !open && setSelectedSubmission(null)}>
        <DialogContent className="max-w-3xl rounded-[1rem] p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="p-6 bg-muted/20 border-b">
            <DialogTitle className="text-2xl font-black flex items-center gap-3">
              <Award className="h-6 w-6 text-primary" />
              Grade Submission: {selectedSubmission?.student.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid md:grid-cols-2">
            {/* Left: Submission Content */}
            <div className="p-6 border-r bg-muted/5 flex flex-col gap-6">
              <div className="space-y-2">
                 <Label className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Submission Content</Label>
                 <div className="p-4 rounded-[0.75rem] bg-card border text-sm font-medium leading-relaxed max-h-[300px] overflow-y-auto whitespace-pre-wrap">
                    {selectedSubmission?.content || "No text content provided."}
                 </div>
              </div>
              {selectedSubmission?.fileUrl && (
                 <div className="space-y-2">
                    <Label className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Attached Files</Label>
                    <a 
                      href={selectedSubmission.fileUrl} 
                      target="_blank" 
                      className="flex items-center justify-between p-3 rounded-[0.75rem] bg-primary/5 border border-primary/20 group hover:bg-primary/10 transition-all"
                    >
                       <div className="flex items-center gap-3">
                          <Download className="h-4 w-4 text-primary" />
                          <span className="text-xs font-bold text-primary">Download Submission Asset</span>
                       </div>
                       <ExternalLink className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                 </div>
              )}
            </div>

            {/* Right: Grading Form */}
            <form onSubmit={handleGradeSubmit} className="p-6 space-y-6">
               <div className="space-y-2">
                  <Label className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Numerical Grade (0-100)</Label>
                  <Input 
                    type="number" 
                    min="0" 
                    max="100" 
                    value={gradeValue}
                    onChange={(e) => setGradeValue(e.target.value)}
                    required 
                    className="h-12 rounded-[0.625rem] bg-muted/20 border-none font-black text-xl text-primary"
                    placeholder="85"
                  />
               </div>
               <div className="space-y-2">
                  <Label className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Educator Feedback</Label>
                  <Textarea 
                    value={feedbackValue}
                    onChange={(e) => setFeedbackValue(e.target.value)}
                    className="h-40 rounded-[0.625rem] bg-muted/20 border-none font-medium leading-relaxed"
                    placeholder="Provide constructive feedback to the student..."
                  />
               </div>
               <div className="pt-4">
                  <Button type="submit" className="w-full h-12 font-black rounded-[0.75rem] shadow-lg shadow-primary/20" disabled={gradeMutation.isPending}>
                    {gradeMutation.isPending ? <Loading /> : "Confirm & Submit Grade"}
                  </Button>
               </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
