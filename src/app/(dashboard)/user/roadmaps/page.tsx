"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Map, 
  Sparkles, 
  Loader2, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  Calendar,
  Layers,
  Save,
  ChevronRight,
  ChevronLeft,
  Target,
  BrainCircuit,
  Zap,
  History,
  FileText,
  Plus,
  BookOpen,
  ArrowUpRight
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  useGenerateRoadmap, 
  useUserRoadmaps,
  LearningPath 
} from "@/hooks/useStudentData";
import { Loading } from "@/components/shared/Loading";
import { ErrorState } from "@/components/shared/ErrorState";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { cn } from "@/lib/utils";

export default function AILearningPathPage() {
  const [step, setStep] = useState(1);
  const [activeRoadmap, setActiveRoadmap] = useState<any>(null);
  const [formData, setFormData] = useState({
    goal: "",
    level: "Beginner",
    hoursPerWeek: "10",
    learningStyle: "Visual",
  });

  const generateMutation = useGenerateRoadmap();
  const { data: roadmapsData, isLoading: roadmapsLoading, isError: roadmapsError, refetch: refetchRoadmaps } = useUserRoadmaps();

  const savedRoadmaps = roadmapsData?.data || [];

  const handleGenerate = async () => {
    generateMutation.mutate(formData, {
      onSuccess: (response) => {
        setActiveRoadmap(response.data.steps);
        setStep(4); // Move to results view
      }
    });
  };

  const selectSavedRoadmap = (path: LearningPath) => {
    setActiveRoadmap(path.steps);
    setStep(4);
  };

  const renderWizardStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="space-y-4">
               <Label htmlFor="goal" className="text-xl font-bold">What is your learning goal?</Label>
               <p className="text-sm text-muted-foreground font-medium">Define your target outcome as specifically as possible.</p>
               <Input 
                 id="goal" 
                 placeholder="e.g. Master Full-Stack Development with React & Node.js" 
                 value={formData.goal}
                 onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                 className="h-12 rounded-lg bg-muted/20 border-border font-medium px-4"
                 autoFocus
               />
            </div>
            <Button 
               className="w-full h-12 font-bold flex items-center justify-center gap-2" 
               onClick={() => {
                 if(!formData.goal.trim()) toast.error("Please enter a goal");
                 else setStep(2);
               }}
            >
               Continue <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="space-y-4">
               <Label className="text-xl font-bold">Current Proficiency</Label>
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                 {['Beginner', 'Intermediate', 'Advanced'].map(lvl => (
                   <button 
                     key={lvl}
                     onClick={() => setFormData({...formData, level: lvl})}
                     className={cn(
                       "p-4 rounded-xl border-2 transition-all text-sm font-bold text-center",
                       formData.level === lvl ? "border-primary bg-primary/5 text-primary" : "border-border bg-muted/20 text-muted-foreground hover:border-border-hover"
                     )}
                   >
                     {lvl}
                   </button>
                 ))}
               </div>
            </div>
            <div className="space-y-4">
               <Label className="text-xl font-bold">Weekly Commitment</Label>
               <p className="text-sm text-muted-foreground font-medium">How many hours per week can you dedicate?</p>
               <Input 
                 type="number" 
                 value={formData.hoursPerWeek}
                 onChange={(e) => setFormData({ ...formData, hoursPerWeek: e.target.value })}
                 className="h-12 rounded-lg bg-muted/20 border-border font-bold px-4"
               />
            </div>
            <div className="flex gap-3">
               <Button variant="outline" className="flex-1 h-12 font-bold" onClick={() => setStep(1)}><ChevronLeft className="h-4 w-4 mr-2" /> Back</Button>
               <Button className="flex-[2] h-12 font-bold" onClick={() => setStep(3)}>Continue <ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
             <div className="space-y-4">
               <Label className="text-xl font-bold">Preferred Learning Style</Label>
               <div className="grid gap-3">
                 {[
                   { id: 'Visual', desc: 'Videos and graphical explanations', icon: BookOpen },
                   { id: 'Practical', desc: 'Labs and hands-on projects', icon: Zap },
                   { id: 'Theoretical', desc: 'Documentation and deep-dives', icon: FileText }
                 ].map(style => (
                   <button 
                     key={style.id}
                     onClick={() => setFormData({...formData, learningStyle: style.id})}
                     className={cn(
                       "p-4 rounded-xl border-2 flex items-center gap-4 text-left transition-all",
                       formData.learningStyle === style.id ? "border-primary bg-primary/5 text-primary" : "border-border bg-muted/20 text-muted-foreground hover:border-border-hover"
                     )}
                   >
                     <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center shrink-0 border", formData.learningStyle === style.id ? "bg-primary text-white border-primary" : "bg-card text-muted-foreground border-border")}>
                        <style.icon className="h-5 w-5" />
                     </div>
                     <div>
                        <p className="font-bold text-sm">{style.id}</p>
                        <p className="text-[10px] font-medium opacity-70">{style.desc}</p>
                     </div>
                   </button>
                 ))}
               </div>
            </div>
            <div className="flex gap-3">
               <Button variant="outline" className="flex-1 h-12 font-bold" onClick={() => setStep(2)}><ChevronLeft className="h-4 w-4 mr-2" /> Back</Button>
               <Button 
                  className="flex-[2] h-12 font-bold flex items-center justify-center gap-2" 
                  onClick={handleGenerate} 
                  disabled={generateMutation.isPending}
               >
                 {generateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                 Generate My Path
               </Button>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader 
        title="Learning Paths" 
        subtitle="Architect your personal growth with AI-powered curriculums."
        actions={
          activeRoadmap && step === 4 ? (
            <Button variant="outline" className="font-bold h-10 px-4 flex items-center gap-2" onClick={() => { setActiveRoadmap(null); setStep(1); }}>
               <Plus className="h-4 w-4" /> New Roadmap
            </Button>
          ) : undefined
        }
      />

      <Tabs defaultValue="builder" className="w-full">
        <div className="mb-8">
           <TabsList className="bg-muted/50 border border-border h-11 p-1 rounded-lg">
             <TabsTrigger value="builder" className="px-6 h-full rounded-md data-[state=active]:bg-card data-[state=active]:shadow-sm font-semibold text-sm">Path Builder</TabsTrigger>
             <TabsTrigger value="history" className="px-6 h-full rounded-md data-[state=active]:bg-card data-[state=active]:shadow-sm font-semibold text-sm">Saved Journeys</TabsTrigger>
           </TabsList>
        </div>

        <TabsContent value="builder" className="mt-0">
           {!activeRoadmap || step !== 4 ? (
            <div className="max-w-2xl mx-auto">
               <div className="lms-card p-8 md:p-12 border-border shadow-sm">
                  <div className="mb-10">
                     <div className="flex items-center gap-3 mb-2">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                           <BrainCircuit className="h-5 w-5" />
                        </div>
                        <h2 className="text-lg font-bold">Path Configuration</h2>
                     </div>
                     <div className="flex gap-2">
                        {[1, 2, 3].map(s => (
                           <div key={s} className={cn("h-1.5 flex-1 rounded-full", s <= step ? "bg-primary" : "bg-muted")} />
                        ))}
                     </div>
                  </div>
                  {renderWizardStep()}
               </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-12 gap-8">
               {/* Roadmap Summary Sidebar */}
               <div className="lg:col-span-4 space-y-6">
                  <div className="lms-card p-6 bg-foreground text-background dark:bg-card dark:text-foreground">
                     <div className="space-y-4">
                        <Badge className="bg-primary/20 text-primary-foreground dark:text-primary border-none text-[10px] font-bold uppercase">Personalized Plan</Badge>
                        <h2 className="text-xl font-bold leading-tight">{activeRoadmap.roadmapTitle}</h2>
                        <p className="text-xs text-muted-foreground font-medium leading-relaxed opacity-90">{activeRoadmap.finalAdvice}</p>
                        
                        <div className="grid grid-cols-2 gap-4 py-4 border-y border-border/20">
                           <div className="space-y-1">
                              <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest flex items-center gap-1.5">
                                 <Clock className="h-3 w-3" /> Time
                              </p>
                              <p className="font-bold text-sm">{activeRoadmap.estimatedDuration}</p>
                           </div>
                           <div className="space-y-1">
                              <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest flex items-center gap-1.5">
                                 <Layers className="h-3 w-3" /> Intensity
                              </p>
                              <p className="font-bold text-sm">{activeRoadmap.phases?.length || 0} Phases</p>
                           </div>
                        </div>
                        
                        <Button className="w-full font-bold h-11 flex items-center justify-center gap-2">
                           <Save className="h-4 w-4" /> Save to Profile
                        </Button>
                     </div>
                  </div>

                  <div className="lms-card p-6">
                     <h3 className="font-bold text-sm flex items-center gap-2 mb-4">
                        <Target className="h-4 w-4 text-primary" /> Key Competencies
                     </h3>
                     <div className="space-y-3">
                        {activeRoadmap.recommendedCourses?.map((course: string, i: number) => (
                          <div key={i} className="flex gap-3 items-center p-3 rounded-lg bg-muted/30 border border-border/50 group">
                             <div className="h-6 w-6 rounded-md bg-card flex items-center justify-center text-primary font-bold text-[10px] shrink-0 border border-border group-hover:bg-primary group-hover:text-white transition-all">
                                {i + 1}
                             </div>
                             <span className="text-xs font-bold truncate">{course}</span>
                          </div>
                        ))}
                     </div>
                  </div>
               </div>

               {/* Path Timeline */}
               <div className="lg:col-span-8 space-y-6">
                  <div className="space-y-8 relative before:absolute before:left-5 before:top-4 before:bottom-4 before:w-[2px] before:bg-muted">
                     {activeRoadmap.phases?.map((phase: any, i: number) => (
                       <div key={i} className="relative pl-12 group">
                          <div className="absolute left-3.5 top-0 w-3 h-3 rounded-full bg-background border-2 border-primary z-10" />
                          <div className="lms-card p-6 space-y-4 lms-card-hover">
                             <div className="space-y-1">
                                <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Phase {i + 1}</p>
                                <h3 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors">{phase.title}</h3>
                                <p className="text-sm text-muted-foreground font-medium leading-relaxed">{phase.description}</p>
                             </div>
                             
                             {phase.topics && (
                                <div className="flex flex-wrap gap-2 pt-2">
                                   {phase.topics.map((topic: string, ti: number) => (
                                     <Badge key={ti} variant="outline" className="bg-muted/50 border-border font-bold text-[10px] py-1 px-3">
                                       {topic}
                                     </Badge>
                                   ))}
                                </div>
                             )}
                          </div>
                       </div>
                     ))}
                  </div>

                  {activeRoadmap.weeklyPlan && (
                    <div className="lms-card p-6 bg-muted/20 border-dashed">
                       <h3 className="font-bold text-base flex items-center gap-2 mb-6">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          Execution Schedule
                       </h3>
                       <div className="grid sm:grid-cols-2 gap-4">
                          {activeRoadmap.weeklyPlan.map((week: any, i: number) => (
                            <div key={i} className="lms-card p-4 space-y-3">
                               <div className="flex justify-between items-center">
                                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Week {week.week}</p>
                                  <span className="text-[9px] font-bold text-muted-foreground uppercase">{week.hours}H Commitment</span>
                               </div>
                               <div className="flex flex-wrap gap-1.5">
                                  {week.topics?.map((t: string, ti: number) => (
                                     <span key={ti} className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-muted text-muted-foreground uppercase border border-border/50">{t}</span>
                                  ))}
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>
                  )}
               </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-0">
           {!savedRoadmaps.length && !roadmapsLoading ? (
             <div className="py-24 text-center space-y-4 lms-card bg-muted/20 border-dashed">
                <div className="h-16 w-16 bg-card rounded-full flex items-center justify-center mx-auto border border-border">
                   <History className="h-8 w-8 text-muted-foreground/30" />
                </div>
                <div className="space-y-1">
                   <h3 className="font-bold text-lg">No journeys saved</h3>
                   <p className="text-muted-foreground text-sm max-w-xs mx-auto">Generate a new roadmap to start tracking your personalized learning path.</p>
                </div>
             </div>
           ) : (
             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roadmapsLoading ? (
                   Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="lms-card h-48 animate-pulse bg-muted/20 border-none" />
                   ))
                ) : savedRoadmaps.map((path) => (
                   <div key={path.id} className="lms-card group flex flex-col justify-between p-6 lms-card-hover h-full">
                      <div className="space-y-4">
                         <div className="flex items-center justify-between">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                               <Map className="h-5 w-5" />
                            </div>
                            <Badge variant="outline" className="font-bold text-[10px] uppercase">Path</Badge>
                         </div>
                         <div className="space-y-1">
                            <h3 className="font-bold text-base leading-tight line-clamp-2">{path.title}</h3>
                            <p className="text-xs font-medium text-muted-foreground line-clamp-2">{path.goal}</p>
                         </div>
                      </div>
                      <div className="flex items-center justify-between pt-6 border-t border-border mt-6">
                         <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span className="text-[10px] font-bold uppercase">{new Date(path.createdAt).toLocaleDateString()}</span>
                         </div>
                         <button 
                            className="text-[10px] font-bold uppercase text-primary flex items-center gap-1 hover:gap-2 transition-all"
                            onClick={() => selectSavedRoadmap(path)}
                         >
                            View Plan <ArrowUpRight className="h-3 w-3" />
                         </button>
                      </div>
                   </div>
                ))}
             </div>
           )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
