"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Circle, 
  Play, 
  FileText, 
  MessageSquare, 
  Info,
  Menu,
  X,
  Sparkles,
  Bot,
  Video,
  FileQuestion,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Loading } from "@/components/shared/Loading";
import { ErrorState } from "@/components/shared/ErrorState";
import { useCourseProgress, useUpdateProgress } from "@/hooks/useStudentData";

export default function LessonPlayerPage() {
  const { slug } = useParams();
  const courseSlug = Array.isArray(slug) ? slug[0] : slug;
  
  const { data: progressData, isLoading, isError, refetch } = useCourseProgress(courseSlug as string);
  const updateProgressMutation = useUpdateProgress();

  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);

  const data = progressData?.data;
  const lessons = useMemo(() => data?.course?.lessons || [], [data]);

  // Set initial active lesson (either last accessed or first one)
  useEffect(() => {
    if (data && !activeLesson) {
      const lastId = data.lastAccessedLessonId;
      const lesson = lessons.find((l: any) => l.id === lastId) || lessons[0];
      setActiveLesson(lesson);
    }
  }, [data, lessons, activeLesson]);

  const toggleLessonCompletion = async (lessonId: string, currentStatus: boolean) => {
    if (!data?.id) return;
    
    updateProgressMutation.mutate({
      enrollmentId: data.id,
      lessonId,
      isCompleted: !currentStatus,
      courseSlug
    });
  };

  const isLessonCompleted = (lessonId: string) => {
    return data?.lessonProgress?.find((lp: any) => lp.lessonId === lessonId)?.isCompleted || false;
  };

  const handleNextLesson = () => {
    const currentIndex = lessons.findIndex((l: any) => l.id === activeLesson?.id);
    if (currentIndex < lessons.length - 1) {
      setActiveLesson(lessons[currentIndex + 1]);
    }
  };

  const handlePrevLesson = () => {
    const currentIndex = lessons.findIndex((l: any) => l.id === activeLesson?.id);
    if (currentIndex > 0) {
      setActiveLesson(lessons[currentIndex - 1]);
    }
  };

  if (isLoading) return <Loading />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;
  if (!data) return <div className="flex h-screen items-center justify-center">No enrollment found.</div>;

  const currentLessonIndex = lessons.findIndex((l: any) => l.id === activeLesson?.id);
  const displayLesson = activeLesson || lessons[0];
  const isFirst = currentLessonIndex === 0;
  const isLast = currentLessonIndex === lessons.length - 1;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* LEFT: Curriculum Sidebar */}
      <div className={cn(
        "absolute lg:relative z-40 h-full w-80 bg-sidebar border-r flex flex-col shrink-0 transition-transform duration-300",
        !sidebarOpen && "-translate-x-full lg:translate-x-0 lg:w-80",
        sidebarOpen && "translate-x-0"
      )}>
        <div className="p-6 border-b space-y-4">
          <Button variant="ghost" size="sm" className="h-8 px-2 -ml-2 text-muted-foreground font-bold" onClick={() => window.history.back()}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Dashboard
          </Button>
          <h2 className="font-black text-xl leading-tight line-clamp-2">{data.course.title}</h2>
          <div className="space-y-1.5">
             <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                <span>Course Progress</span>
                <span className="text-primary">{Math.round(data.progress || 0)}%</span>
             </div>
             <Progress value={data.progress} className="h-1.5" />
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-3 space-y-1">
            {lessons.map((lesson: any, index: number) => {
              const completed = isLessonCompleted(lesson.id);
              const active = displayLesson?.id === lesson.id;
              
              return (
                <button
                  key={lesson.id}
                  onClick={() => { setActiveLesson(lesson); setSidebarOpen(false); }}
                  className={cn(
                    "w-full flex items-start gap-3 p-3 rounded-[0.625rem] transition-all text-left group",
                    active ? "bg-primary text-primary-foreground shadow-md" : "hover:bg-muted"
                  )}
                >
                  <div className="mt-0.5 shrink-0">
                    {completed ? (
                      <CheckCircle2 className={cn("h-5 w-5", active ? "text-primary-foreground" : "text-emerald-500")} />
                    ) : (
                      <Circle className={cn("h-5 w-5", active ? "text-primary-foreground/50" : "text-muted-foreground")} />
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className={cn(
                      "text-sm font-bold leading-tight",
                      active ? "text-primary-foreground" : "text-foreground group-hover:text-primary transition-colors"
                    )}>
                      {index + 1}. {lesson.title}
                    </p>
                    <div className={cn(
                      "flex items-center gap-1.5 text-[10px] uppercase font-black tracking-wider",
                      active ? "text-primary-foreground/80" : "text-muted-foreground"
                    )}>
                      <Video className="h-3 w-3" /> {lesson.duration || "10m"}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* CENTER: Main Content Player */}
      <div className="flex-1 flex flex-col min-w-0 bg-muted/10 relative h-full overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden h-14 border-b bg-background flex items-center justify-between px-4 shrink-0">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
             <Menu className="h-5 w-5" />
          </Button>
          <h1 className="font-bold text-sm truncate px-4">{displayLesson?.title}</h1>
          <Button variant="ghost" size="icon" onClick={() => setRightSidebarOpen(!rightSidebarOpen)}>
             <Info className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Video Player Area */}
          <div className="w-full bg-black aspect-video max-h-[60vh] relative group flex items-center justify-center">
            <Play className="h-24 w-24 text-white/50 group-hover:text-white group-hover:scale-110 transition-all cursor-pointer" />
            <div className="absolute top-6 left-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <Badge className="bg-primary text-primary-foreground font-bold uppercase tracking-widest text-[10px] border-none">Lesson {currentLessonIndex + 1}</Badge>
            </div>
          </div>

          <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-black tracking-tight">{displayLesson?.title}</h1>
              </div>
              <Button 
                onClick={() => toggleLessonCompletion(displayLesson.id, isLessonCompleted(displayLesson.id))}
                variant={isLessonCompleted(displayLesson.id) ? "outline" : "default"}
                className={cn(
                  "rounded-[0.625rem] font-bold h-12 px-8 shadow-sm transition-all shrink-0 w-full md:w-auto",
                  !isLessonCompleted(displayLesson.id) && "bg-primary hover:bg-primary/90 hover:shadow-md hover:-translate-y-0.5",
                  isLessonCompleted(displayLesson.id) && "border-emerald-500 text-emerald-500 hover:bg-emerald-500/10"
                )}
                disabled={updateProgressMutation.isPending}
              >
                {isLessonCompleted(displayLesson.id) ? (
                  <><CheckCircle2 className="h-5 w-5 mr-2" /> Completed</>
                ) : (
                  updateProgressMutation.isPending ? "Updating..." : "Mark as Complete"
                )}
              </Button>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground font-medium">
              <div dangerouslySetInnerHTML={{ __html: displayLesson?.content || "Welcome to this lesson! In this module, we will explore the core concepts of the topic and how to apply them in real-world scenarios. Make sure to review the attached resources on the right." }} />
            </div>
            
            <div className="saas-card bg-primary/5 border-primary/20 flex flex-col md:flex-row items-start gap-5">
              <div className="p-3 rounded-[0.625rem] bg-primary/10 text-primary shrink-0">
                <Sparkles className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-foreground">AI Lesson Summary</h4>
                <p className="text-sm font-medium">In this video, we covered the foundational architecture. The most critical takeaway is understanding the data flow lifecycle explained at 04:20. Be prepared to use this in the upcoming assignment.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="h-20 border-t bg-background px-6 flex items-center justify-between shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
          <Button 
            variant="ghost" 
            className="gap-2 font-bold rounded-[0.625rem] hover:bg-muted" 
            onClick={handlePrevLesson}
            disabled={isFirst}
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </Button>
          <Button 
            className="gap-2 font-black rounded-[0.625rem] px-8 shadow-md hover:-translate-y-0.5 transition-all" 
            onClick={handleNextLesson}
            disabled={isLast}
          >
            {isLast ? "Finish Course" : "Next Lesson"} <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* RIGHT: Resources & Activities Sidebar */}
      <div className={cn(
        "absolute right-0 lg:relative z-30 h-full w-80 bg-background border-l flex flex-col shrink-0 transition-transform duration-300 shadow-2xl lg:shadow-none",
        !rightSidebarOpen && "translate-x-full lg:translate-x-0 lg:w-80",
        rightSidebarOpen && "translate-x-0"
      )}>
        <div className="p-6 border-b flex justify-between items-center bg-muted/10">
          <h3 className="font-black">Course Toolkit</h3>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setRightSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <ScrollArea className="flex-1 p-6">
           <div className="space-y-8">
              {/* Ask AI Tutor */}
              <div className="space-y-3">
                 <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                   <Bot className="h-3 w-3" /> Ask AI Tutor
                 </h4>
                 <div className="p-4 rounded-[0.625rem] bg-muted/30 border border-muted flex flex-col gap-3">
                    <p className="text-xs font-medium text-muted-foreground">Stuck on this lesson? Ask the AI Tutor for clarification.</p>
                    <Button size="sm" className="w-full rounded-[0.5rem] font-bold gap-2">
                      <MessageSquare className="h-4 w-4" /> Open Chat
                    </Button>
                 </div>
              </div>

              {/* Lesson Resources */}
              <div className="space-y-3">
                 <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                   <Download className="h-3 w-3" /> Resources
                 </h4>
                 <div className="space-y-2">
                    <button className="w-full flex items-center gap-3 p-3 rounded-[0.625rem] border hover:bg-muted/50 transition-colors group text-left">
                       <FileText className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                       <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold truncate">Lesson Slides</p>
                          <p className="text-[10px] text-muted-foreground font-medium">PDF • 2.4 MB</p>
                       </div>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 rounded-[0.625rem] border hover:bg-muted/50 transition-colors group text-left">
                       <FileText className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                       <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold truncate">Starter Code</p>
                          <p className="text-[10px] text-muted-foreground font-medium">ZIP • 1.1 MB</p>
                       </div>
                    </button>
                 </div>
              </div>

              {/* Up Next Activity */}
              <div className="space-y-3">
                 <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                   <FileQuestion className="h-3 w-3" /> Up Next
                 </h4>
                 <div className="p-4 rounded-[0.625rem] border-2 border-amber-500/20 bg-amber-500/5 group">
                    <div className="flex justify-between items-start mb-2">
                       <Badge variant="outline" className="border-amber-500 text-amber-500 font-bold uppercase text-[10px]">Pending Assignment</Badge>
                    </div>
                    <h5 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors">Build a REST API</h5>
                    <p className="text-xs text-muted-foreground font-medium mb-3">Test your knowledge from this module.</p>
                    <Button variant="outline" size="sm" className="w-full rounded-[0.5rem] font-bold text-xs h-8">View Details</Button>
                 </div>
              </div>
           </div>
        </ScrollArea>
      </div>

      {/* Mobile Overlay */}
      {(sidebarOpen || rightSidebarOpen) && (
        <div 
          className="fixed inset-0 bg-black/40 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => { setSidebarOpen(false); setRightSidebarOpen(false); }}
        />
      )}
    </div>
  );
}
