"use client";

import { ErrorState } from "@/components/shared/ErrorState";
import { Loading } from "@/components/shared/Loading";
import { Progress } from "@/components/ui/progress";
import { useUserDashboard } from "@/hooks/useDashboard";
import { 
  BookOpen, 
  Calendar, 
  CheckSquare, 
  Clock, 
  FileText, 
  PlayCircle, 
  ChevronRight,
  MessageSquare,
  Award,
  AlertCircle,
  Search,
  Bell,
  User as UserIcon,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { RightPanelCard } from "@/components/dashboard/RightPanelCard";

export default function UserDashboardPage() {
  const { data, isLoading, isError, refetch } = useUserDashboard();

  if (isLoading) return <Loading />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;

  const dashboardData = data?.data || {};
  const enrollments = dashboardData.enrolledCourses || [];
  const assignments = dashboardData.assignments || [];
  const upcomingClasses = dashboardData.upcomingClasses || [];
  const quizAttempts = dashboardData.quizAttempts || [];
  
  const activeCourse = enrollments.find((e: any) => e.progress > 0 && e.progress < 100) || enrollments[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* 1. Page Header */}
      <PageHeader 
        title="Overview" 
        subtitle="Track your learning progress and upcoming tasks."
        actions={
          <>
            <Button variant="outline" size="sm" className="font-bold h-9">Weekly Report</Button>
            <Button size="sm" className="font-bold h-9">Upgrade Plan</Button>
          </>
        }
      />

      {/* 2. Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Active Courses" 
          value={enrollments.length} 
          subtitle="Programs in progress" 
          icon={BookOpen} 
          variant="blue" 
        />
        <StatCard 
          title="Quizzes Passed" 
          value={quizAttempts.length} 
          subtitle="Verified attempts" 
          icon={CheckSquare} 
          variant="emerald" 
        />
        <StatCard 
          title="Study Hours" 
          value="12.5" 
          subtitle="This week" 
          icon={Clock} 
          variant="amber" 
        />
        <StatCard 
          title="Assignments" 
          value={assignments.length} 
          subtitle="Pending tasks" 
          icon={FileText} 
          variant="rose" 
        />
      </div>

      {/* 3. Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: 65-70% */}
        <div className="lg:col-span-8 space-y-8">
          {/* Active Course Card */}
          <div className="space-y-4">
             <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                   <PlayCircle className="h-4 w-4 text-primary" />
                   Continue Learning
                </h3>
             </div>
             
             {activeCourse ? (
               <div className="lms-card p-6 border-primary/20 bg-primary/[0.01] hover:bg-primary/[0.02] transition-colors group">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                     <div className="h-28 w-44 rounded-xl bg-muted relative overflow-hidden border border-border/40 shrink-0 shadow-inner group-hover:scale-[1.02] transition-transform duration-300">
                        <div className="absolute inset-0 bg-primary/5 flex items-center justify-center">
                           <PlayCircle className="h-10 w-10 text-primary opacity-30" />
                        </div>
                     </div>
                     <div className="flex-1 space-y-4 w-full">
                        <div className="flex items-center justify-between">
                           <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] font-bold uppercase px-2 py-0.5">In Progress</Badge>
                           <span className="text-xs font-black text-primary uppercase tracking-widest">{Math.round(activeCourse.progress)}% Complete</span>
                        </div>
                        <h2 className="text-xl font-bold tracking-tight text-foreground leading-tight">{activeCourse.course?.title}</h2>
                        <div className="space-y-2">
                          <Progress value={activeCourse.progress} className="h-2 bg-primary/10" />
                        </div>
                     </div>
                     <Link href={`/learn/${activeCourse.course?.slug}`} className="w-full md:w-auto">
                        <Button className="w-full md:w-auto h-12 px-10 font-bold group-hover:scale-105 transition-all">Resume Class</Button>
                     </Link>
                  </div>
               </div>
             ) : (
               <div className="lms-card p-12 text-center bg-muted/20 border-dashed space-y-4">
                  <div className="h-16 w-16 bg-card rounded-full flex items-center justify-center mx-auto border border-border">
                     <BookOpen className="h-8 w-8 text-muted-foreground/30" />
                  </div>
                  <div className="space-y-1">
                     <h3 className="font-bold text-lg">No Active Course</h3>
                     <p className="text-muted-foreground text-sm max-w-xs mx-auto font-medium">You are not currently enrolled in any courses. Start your learning journey today.</p>
                  </div>
                  <Button variant="outline" className="font-bold">
                     <Link href="/courses">Browse Academy</Link>
                  </Button>
               </div>
             )}
          </div>

          {/* Pending Assignments */}
          <div className="space-y-4">
             <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                   <FileText className="h-4 w-4 text-primary" />
                   Pending Assignments
                </h3>
                <Link href="/user/assignments" className="text-xs font-bold text-primary hover:underline">View All Task List</Link>
             </div>
             <div className="lms-card overflow-hidden">
                <div className="overflow-x-auto">
                   <table className="w-full text-left border-collapse">
                      <thead>
                         <tr className="bg-muted/30 border-b border-border">
                            <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Assignment Name</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Course Module</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Due Date</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Status</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                         {assignments.length > 0 ? (
                           assignments.slice(0, 4).map((assignment: any) => (
                              <tr key={assignment.id} className="hover:bg-muted/20 transition-colors group">
                                 <td className="px-6 py-4">
                                    <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{assignment.title}</p>
                                 </td>
                                 <td className="px-6 py-4">
                                    <p className="text-xs text-muted-foreground font-medium">{assignment.course?.title}</p>
                                 </td>
                                 <td className="px-6 py-4">
                                    <p className="text-xs font-bold text-muted-foreground">{new Date(assignment.dueDate).toLocaleDateString()}</p>
                                 </td>
                                 <td className="px-6 py-4 text-right">
                                    <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px] font-bold uppercase">Pending</Badge>
                                 </td>
                              </tr>
                           ))
                         ) : (
                           <tr>
                              <td colSpan={4} className="px-6 py-12 text-center space-y-2">
                                 <FileText className="h-10 w-10 text-muted-foreground/20 mx-auto" />
                                 <p className="text-sm font-bold text-muted-foreground">All assignments completed!</p>
                              </td>
                           </tr>
                         )}
                      </tbody>
                   </table>
                </div>
             </div>
          </div>
        </div>

        {/* Right Column: 30-35% */}
        <div className="lg:col-span-4 space-y-8">
          {/* Live Sessions */}
          <RightPanelCard title="Live Sessions" icon={PlayCircle}>
             <div className="space-y-3">
                {upcomingClasses.length > 0 ? (
                   upcomingClasses.map((cls: any, i: number) => (
                      <div key={i} className="flex gap-4 items-center p-3 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
                         <div className="h-12 w-12 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center border border-rose-500/20 shrink-0">
                            <Calendar className="h-5 w-5" />
                         </div>
                         <div className="flex-1 space-y-0.5">
                            <p className="text-sm font-bold line-clamp-1">{cls.title}</p>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{new Date(cls.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Today</p>
                         </div>
                         <Button size="sm" className="h-8 text-[10px] font-bold uppercase px-3">Join</Button>
                      </div>
                   ))
                ) : (
                   <div className="p-8 text-center bg-muted/20 border-dashed border rounded-xl">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">No sessions today</p>
                   </div>
                )}
             </div>
          </RightPanelCard>

          {/* AI Mentor */}
          <RightPanelCard title="Ask AI Mentor" icon={MessageSquare} className="bg-primary/5 border-primary/10">
             <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <div className="h-10 w-10 rounded-lg bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                      <Sparkles className="h-5 w-5" />
                   </div>
                   <div>
                      <p className="text-[10px] text-primary font-bold uppercase tracking-widest leading-none">Instant Intelligence</p>
                      <p className="text-xs font-bold mt-1 text-foreground">Available 24/7 for you</p>
                   </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                   Stuck on a concept? Your AI mentor is ready to help with personalized explanations and coding support.
                </p>
                <Button className="w-full font-bold h-10 text-xs uppercase tracking-widest">
                   <Link href="/user/tutor">Start Consultation</Link>
                </Button>
             </div>
          </RightPanelCard>

          {/* Platform Updates */}
          <RightPanelCard title="Platform Updates" icon={AlertCircle}>
             <div className="space-y-4">
                <div className="p-3 rounded-xl border border-border bg-muted/20">
                   <p className="text-xs font-bold mb-1">System Maintenance</p>
                   <p className="text-[10px] text-muted-foreground font-medium">Saturday, May 15th at 02:00 UTC. Expect 30 mins downtime.</p>
                </div>
                <div className="p-3 rounded-xl border border-border">
                   <p className="text-xs font-bold mb-1">New Module Released</p>
                   <p className="text-[10px] text-muted-foreground font-medium">"Advanced AI Agent Design" is now live in your curriculum.</p>
                </div>
             </div>
          </RightPanelCard>
        </div>
      </div>
    </div>
  );
}

