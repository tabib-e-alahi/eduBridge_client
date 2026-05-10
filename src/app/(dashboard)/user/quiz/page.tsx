"use client";

import { useState, useEffect } from "react";
import { 
  CheckSquare, 
  Timer, 
  Award, 
  ChevronRight,
  CheckCircle2,
  XCircle,
  PlayCircle,
  Trophy,
  History,
  AlertCircle,
  Info,
  Loader2,
  BookOpen,
  Zap,
  Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { 
  useUserQuizzes, 
  useQuizDetails, 
  useSubmitQuizAttempt,
  Quiz,
  QuizAttempt 
} from "@/hooks/useStudentData";
import { Loading } from "@/components/shared/Loading";
import { ErrorState } from "@/components/shared/ErrorState";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { cn } from "@/lib/utils";

export default function QuizzesPage() {
  const [view, setView] = useState<'list' | 'active' | 'result'>('list');
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [resultData, setResultData] = useState<QuizAttempt | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);

  const { data: quizzesData, isLoading: quizzesLoading, isError: quizzesError, refetch: refetchQuizzes } = useUserQuizzes();
  const { data: quizDetailsData, isLoading: quizLoading } = useQuizDetails(selectedQuizId || "");
  const submitMutation = useSubmitQuizAttempt();

  const quizzes = quizzesData?.data || [];
  const activeQuiz = quizDetailsData?.data;

  // Timer logic
  useEffect(() => {
    if (view === 'active' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (view === 'active' && timeLeft === 0) {
      handleSubmit();
    }
  }, [view, timeLeft]);

  const startQuiz = (id: string) => {
    setSelectedQuizId(id);
    setUserAnswers({});
    setTimeLeft(30 * 60); // Default 30 mins
    setView('active');
  };

  const handleSubmit = async () => {
    if (!selectedQuizId) return;
    
    submitMutation.mutate({
      quizId: selectedQuizId,
      answers: userAnswers
    }, {
      onSuccess: (response) => {
        setResultData(response.data);
        setView('result');
      }
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (quizzesLoading) return <Loading />;
  if (quizzesError) return <ErrorState onRetry={() => refetchQuizzes()} />;

  // ACTIVE QUIZ VIEW
  if (view === 'active') {
    if (quizLoading) return <Loading />;
    if (!activeQuiz) return <ErrorState onRetry={() => setView('list')} />;

    const questions = activeQuiz.questions || [];
    const answeredCount = Object.keys(userAnswers).length;

    return (
      <div className="max-w-5xl mx-auto space-y-12 py-12 pb-32 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="saas-card p-8 border-none bg-foreground text-background dark:bg-background dark:text-foreground sticky top-8 z-30 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-8 overflow-hidden">
           {/* Background decoration */}
           <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
           
           <div className="relative z-10 space-y-2">
              <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.2em]">
                <Zap className="h-3.5 w-3.5 fill-primary" />
                Live Assessment
              </div>
              <h2 className="text-3xl font-black tracking-tight">{activeQuiz.title}</h2>
              <div className="flex items-center gap-4 text-sm font-bold opacity-60">
                 <span className="flex items-center gap-1.5"><Target className="h-4 w-4" /> {questions.length} Modules</span>
                 <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> {answeredCount} Completed</span>
              </div>
           </div>
           
           <div className="relative z-10 flex items-center gap-8 w-full md:w-auto">
              <div className="flex flex-col items-center md:items-end">
                 <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Remaining Time</p>
                 <div className="flex items-center gap-3 font-black text-3xl tabular-nums text-primary">
                   <Timer className="h-6 w-6" />
                   <span>{formatTime(timeLeft)}</span>
                 </div>
              </div>
              <button 
                onClick={handleSubmit} 
                disabled={submitMutation.isPending}
                className="h-16 px-10 bg-primary text-primary-foreground rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/25 disabled:opacity-50"
              >
                {submitMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Finalize"}
              </button>
           </div>
        </div>

        <div className="space-y-10">
          {questions.map((q, i) => (
            <div key={q.id} className="saas-card p-10 md:p-14 space-y-10 group hover:border-primary/20 transition-all border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-card">
              <div className="flex gap-8">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-xl shrink-0 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                  {i + 1}
                </div>
                <div className="space-y-3 pt-1">
                   <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Objective Assessment</p>
                   <h3 className="text-2xl font-black leading-tight tracking-tight">{q.question}</h3>
                </div>
              </div>
              
              <RadioGroup 
                className="grid sm:grid-cols-2 gap-4 ml-0 md:ml-22" 
                onValueChange={(val) => setUserAnswers({ ...userAnswers, [q.id]: val })}
                value={userAnswers[q.id]}
              >
                {q.options.map((option: string, oi: number) => (
                  <div 
                     key={oi} 
                     onClick={() => setUserAnswers({ ...userAnswers, [q.id]: option })}
                     className={cn(
                        "flex items-center space-x-4 p-6 rounded-2xl border-2 transition-all cursor-pointer group/opt",
                        userAnswers[q.id] === option 
                           ? "border-primary bg-primary/5 shadow-lg ring-4 ring-primary/5" 
                           : "border-border/40 hover:border-primary/20 bg-background"
                     )}
                  >
                    <RadioGroupItem value={option} id={`q${i}-o${oi}`} className="h-5 w-5 border-primary/50 text-primary" />
                    <Label htmlFor={`q${i}-o${oi}`} className="flex-1 cursor-pointer font-black text-base group-hover/opt:text-primary transition-colors">{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // RESULT VIEW
  if (view === 'result' && resultData) {
    const percentage = Math.round(resultData.score);
    const passed = percentage >= 70;

    return (
      <div className="max-w-4xl mx-auto space-y-12 py-20 px-4 animate-in zoom-in duration-700">
        <div className="saas-card p-0 overflow-hidden relative border-none shadow-2xl bg-card">
          <div className={cn(
             "absolute top-0 left-0 w-full h-2",
             passed ? "bg-emerald-500" : "bg-red-500"
          )} />
          
          {/* Confetti or decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative p-16 md:p-24 text-center flex flex-col items-center gap-10">
            <div className={cn(
               "h-32 w-32 rounded-3xl flex items-center justify-center shadow-2xl rotate-3 transition-transform hover:rotate-0 duration-500",
               passed ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
            )}>
               <Trophy className="h-16 w-16" />
            </div>
            
            <div className="space-y-3">
               <h2 className="text-5xl font-black tracking-tighter">{passed ? 'Mastery Unlocked!' : 'Growth Required.'}</h2>
               <p className="text-xl font-bold text-muted-foreground max-w-md">
                 You achieved an expert score of <span className="text-foreground">{percentage}%</span> in the {resultData.quiz?.title} assessment.
               </p>
            </div>
            
            <div className="flex items-center gap-6 p-8 bg-muted/30 rounded-3xl border border-border/40">
               <div className="text-center px-8 border-r border-border/40">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Final Score</p>
                  <p className={cn("text-4xl font-black", passed ? "text-emerald-500" : "text-red-500")}>{percentage}%</p>
               </div>
               <div className="text-center px-8">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Status</p>
                  <p className={cn("text-4xl font-black", passed ? "text-emerald-500" : "text-red-500")}>{passed ? 'PASS' : 'FAIL'}</p>
               </div>
            </div>

            <div className="flex gap-6 mt-4">
               <button 
                  className="px-10 h-16 bg-foreground text-background dark:bg-background dark:text-foreground rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
                  onClick={() => setView('list')}
               >
                  Return to Dashboard
               </button>
            </div>
          </div>
        </div>

        <div className="p-10 text-center saas-card bg-primary/5 border-dashed border-2 flex items-center justify-center gap-4">
            <Info className="h-6 w-6 text-primary" />
            <p className="text-muted-foreground font-bold text-lg">
               Your mastery levels have been updated in your profile analytics.
            </p>
        </div>
      </div>
    );
  }

  // LIST VIEW
  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <PageHeader 
        title="Mastery Evaluation" 
        subtitle="Verify your understanding and earn recognition by completing assessments designed by industry experts."
      />

      <div className="grid gap-8">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="saas-card p-10 flex flex-col lg:flex-row justify-between gap-10 lg:items-center group hover:shadow-2xl transition-all border-none bg-card shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
            <div className="flex gap-8 items-start">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                <BookOpen className="h-8 w-8" />
              </div>
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                   <Badge className="saas-badge bg-amber-500/10 text-amber-600 border-none">Available Now</Badge>
                   <Badge className="saas-badge bg-primary/5 text-primary border-none">100 Points</Badge>
                </div>
                <div className="space-y-1">
                   <h3 className="font-black text-3xl group-hover:text-primary transition-colors leading-tight tracking-tight">{quiz.title}</h3>
                   <p className="text-base font-bold text-muted-foreground flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {quiz.course?.title}
                   </p>
                </div>
                
                <div className="flex flex-wrap items-center gap-8 pt-2 text-sm font-black uppercase tracking-widest text-muted-foreground">
                  <span className="flex items-center gap-2.5">
                    <Timer className="h-4 w-4 text-primary" /> 30 Mins
                  </span>
                  <span className="flex items-center gap-2.5">
                    <CheckSquare className="h-4 w-4 text-primary" /> {quiz._count?.questions || 0} Questions
                  </span>
                  <span className="flex items-center gap-2.5">
                    <Award className="h-4 w-4 text-primary" /> Professional Certification
                  </span>
                </div>
              </div>
            </div>
            
            <div className="shrink-0 flex flex-col items-center gap-4 border-t lg:border-t-0 pt-8 lg:pt-0">
               <button 
                  className="w-full lg:w-auto h-16 px-12 bg-foreground text-background dark:bg-background dark:text-foreground rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3"
                  onClick={() => startQuiz(quiz.id)}
               >
                  <PlayCircle className="h-6 w-6" />
                  Initiate Attempt
               </button>
               <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2 opacity-50">
                  <AlertCircle className="h-3.5 w-3.5" /> High Stakes Assessment
               </p>
            </div>
          </div>
        ))}

        {quizzes.length === 0 && (
          <div className="py-32 flex flex-col items-center justify-center text-center gap-6 saas-card bg-muted/5 border-dashed border-2">
             <div className="h-20 w-20 rounded-3xl bg-primary/5 flex items-center justify-center border border-primary/10">
                <CheckSquare className="h-10 w-10 text-primary/40" />
             </div>
             <div className="space-y-2">
                <h3 className="text-2xl font-black">No assessments yet</h3>
                <p className="text-muted-foreground font-medium max-w-sm">
                  Quizzes will appear here once your instructors release them. Keep studying!
                </p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
