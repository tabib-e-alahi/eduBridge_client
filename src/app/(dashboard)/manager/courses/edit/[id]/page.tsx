"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  useCourseDetails, 
  useUpdateCourse,
  useCreateLesson,
  useUpdateLesson,
  useDeleteLesson 
} from "@/hooks/useInstructorData";
import { useCategories } from "@/hooks/useCourses";
import { Loading } from "@/components/shared/Loading";
import { ErrorState } from "@/components/shared/ErrorState";
import { 
  Save, 
  Plus, 
  Trash2, 
  Edit, 
  Play, 
  FileText, 
  Settings, 
  Layout, 
  BookOpen, 
  Video,
  Clock,
  ChevronRight,
  ArrowLeft,
  Rocket,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function EditCoursePage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { data: courseData, isLoading, isError, refetch } = useCourseDetails(id);
  const { data: categoriesData } = useCategories();
  
  const updateCourseMutation = useUpdateCourse();
  const createLessonMutation = useCreateLesson();
  const updateLessonMutation = useUpdateLesson();
  const deleteLessonMutation = useDeleteLesson();

  const [courseForm, setCourseForm] = useState<any>(null);
  const [isLessonDialogOpen, setIsLessonDialogOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<any>(null);

  useEffect(() => {
    if (courseData?.data) {
      setCourseForm(courseData.data);
    }
  }, [courseData]);

  if (isLoading) return <Loading />;
  if (isError || !courseForm) return <ErrorState onRetry={() => refetch()} />;

  const course = courseData.data;

  const handleUpdateCourse = () => {
    updateCourseMutation.mutate({ 
      id, 
      payload: {
        title: courseForm.title,
        slug: courseForm.slug,
        description: courseForm.description,
        categoryId: courseForm.categoryId,
        level: courseForm.level,
        price: Number(courseForm.price),
        thumbnailUrl: courseForm.thumbnailUrl,
        status: courseForm.status
      } 
    });
  };

  const handleLessonSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      title: formData.get("title") as string,
      slug: (formData.get("title") as string).toLowerCase().replace(/ /g, "-"),
      videoUrl: formData.get("videoUrl") as string,
      duration: formData.get("duration") as string,
      content: formData.get("content") as string,
      order: editingLesson ? editingLesson.order : (course.lessons?.length || 0) + 1,
      courseId: id
    };

    if (editingLesson) {
      updateLessonMutation.mutate({ id: editingLesson.id, payload }, {
        onSuccess: () => {
          setIsLessonDialogOpen(false);
          setEditingLesson(null);
        }
      });
    } else {
      createLessonMutation.mutate(payload, {
        onSuccess: () => {
          setIsLessonDialogOpen(false);
        }
      });
    }
  };

  const openEditLesson = (lesson: any) => {
    setEditingLesson(lesson);
    setIsLessonDialogOpen(true);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
           <Button variant="ghost" size="icon" className="rounded-full" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
           </Button>
           <div>
              <div className="flex items-center gap-2">
                 <h1 className="text-3xl font-black tracking-tight">{course.title}</h1>
                 <Badge variant="outline" className={cn(
                    "font-bold uppercase text-[10px] tracking-widest",
                    course.status === 'PUBLISHED' ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                 )}>
                    {course.status}
                 </Badge>
              </div>
              <p className="text-muted-foreground font-medium">Draft ID: {id.slice(0, 8)} • Last updated {new Date(course.updatedAt).toLocaleDateString()}</p>
           </div>
        </div>
        <div className="flex gap-3">
           <Button variant="outline" className="font-bold h-11 rounded-[0.75rem]" onClick={() => window.open(`/learn/${course.slug}`, '_blank')}>
              Preview Course
           </Button>
           <Button className="font-black h-11 px-8 rounded-[0.75rem] gap-2 shadow-lg shadow-primary/20" onClick={handleUpdateCourse} disabled={updateCourseMutation.isPending}>
              {updateCourseMutation.isPending ? <Loading /> : <Save className="h-4 w-4" />}
              Save Changes
           </Button>
        </div>
      </div>

      <Tabs defaultValue="curriculum" className="w-full">
        <TabsList className="bg-muted/50 p-1 rounded-[0.75rem] h-12 mb-8 border border-muted-foreground/10">
          <TabsTrigger value="info" className="rounded-[0.625rem] px-8 font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm">General Info</TabsTrigger>
          <TabsTrigger value="curriculum" className="rounded-[0.625rem] px-8 font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm">Curriculum</TabsTrigger>
          <TabsTrigger value="assessments" className="rounded-[0.625rem] px-8 font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm">Assessments</TabsTrigger>
          <TabsTrigger value="settings" className="rounded-[0.625rem] px-8 font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="animate-in fade-in duration-500">
           <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                 <Card className="saas-card border-muted-foreground/10">
                    <CardHeader>
                       <CardTitle className="text-lg font-black flex items-center gap-2"><Layout className="h-5 w-5 text-primary" /> Visual Identity</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                       <div className="space-y-2">
                          <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Course Title</Label>
                          <Input 
                            value={courseForm.title} 
                            onChange={(e) => setCourseForm({...courseForm, title: e.target.value})}
                            className="h-12 font-bold text-lg rounded-[0.625rem] bg-muted/20"
                          />
                       </div>
                       <div className="space-y-2">
                          <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Course URL (Slug)</Label>
                          <div className="flex">
                             <div className="bg-muted px-4 flex items-center border border-r-0 rounded-l-[0.625rem] text-[10px] font-black text-muted-foreground">edubridge.ai/learn/</div>
                             <Input 
                               value={courseForm.slug} 
                               onChange={(e) => setCourseForm({...courseForm, slug: e.target.value})}
                               className="h-12 font-bold rounded-r-[0.625rem] rounded-l-none bg-muted/20 border-l-0"
                             />
                          </div>
                       </div>
                       <div className="space-y-2">
                          <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Executive Summary (Description)</Label>
                          <Textarea 
                            value={courseForm.description} 
                            onChange={(e) => setCourseForm({...courseForm, description: e.target.value})}
                            className="h-48 font-medium rounded-[0.625rem] bg-muted/20 leading-relaxed"
                          />
                       </div>
                    </CardContent>
                 </Card>
              </div>

              <div className="space-y-6">
                 <Card className="saas-card border-muted-foreground/10 overflow-hidden !p-0">
                    <div className="aspect-video bg-muted relative">
                       {courseForm.thumbnailUrl ? (
                         <img src={courseForm.thumbnailUrl} className="object-cover w-full h-full" alt="" />
                       ) : (
                         <div className="h-full w-full flex flex-col items-center justify-center gap-2 opacity-30">
                            <ImageIcon className="h-10 w-10" />
                            <span className="text-[10px] font-black uppercase">No Image</span>
                         </div>
                       )}
                    </div>
                    <div className="p-6 space-y-4">
                       <div className="space-y-2">
                          <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Thumbnail URL</Label>
                          <Input 
                            value={courseForm.thumbnailUrl} 
                            onChange={(e) => setCourseForm({...courseForm, thumbnailUrl: e.target.value})}
                            placeholder="https://images.unsplash.com/..."
                            className="h-10 rounded-[0.625rem] bg-muted/20 text-xs font-bold"
                          />
                       </div>
                    </div>
                 </Card>

                 <Card className="saas-card border-muted-foreground/10">
                    <CardHeader>
                       <CardTitle className="text-lg font-black flex items-center gap-2"><Rocket className="h-5 w-5 text-primary" /> Delivery Specs</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                       <div className="space-y-2">
                          <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Academic Category</Label>
                          <Select value={courseForm.categoryId} onValueChange={(val) => setCourseForm({...courseForm, categoryId: val})}>
                             <SelectTrigger className="h-11 rounded-[0.625rem] bg-muted/20 font-bold border-none">
                                <SelectValue placeholder="Select category" />
                             </SelectTrigger>
                             <SelectContent className="font-bold">
                                {categoriesData?.data.map((cat: any) => (
                                   <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                ))}
                             </SelectContent>
                          </Select>
                       </div>
                       <div className="space-y-2">
                          <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Difficulty Level</Label>
                          <Select value={courseForm.level} onValueChange={(val) => setCourseForm({...courseForm, level: val})}>
                             <SelectTrigger className="h-11 rounded-[0.625rem] bg-muted/20 font-bold border-none">
                                <SelectValue placeholder="Select level" />
                             </SelectTrigger>
                             <SelectContent className="font-bold">
                                <SelectItem value="Beginner">Beginner</SelectItem>
                                <SelectItem value="Intermediate">Intermediate</SelectItem>
                                <SelectItem value="Advanced">Advanced</SelectItem>
                             </SelectContent>
                          </Select>
                       </div>
                       <div className="space-y-2">
                          <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Retail Price (USD)</Label>
                          <div className="relative">
                             <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-emerald-600">$</span>
                             <Input 
                               type="number"
                               value={courseForm.price} 
                               onChange={(e) => setCourseForm({...courseForm, price: e.target.value})}
                               className="h-11 pl-8 font-black text-lg rounded-[0.625rem] bg-muted/20 border-none"
                             />
                          </div>
                       </div>
                    </CardContent>
                 </Card>
              </div>
           </div>
        </TabsContent>

        <TabsContent value="curriculum" className="animate-in slide-in-from-bottom-4 duration-500">
           <div className="space-y-6">
              <div className="flex justify-between items-center bg-card p-6 rounded-[1rem] border border-muted-foreground/10 shadow-sm">
                 <div>
                    <h2 className="text-xl font-black">Syllabus Structure</h2>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Total Content: {course.lessons?.length || 0} Modules</p>
                 </div>
                 <Dialog open={isLessonDialogOpen} onOpenChange={(open) => { setIsLessonDialogOpen(open); if(!open) setEditingLesson(null); }}>
                    <DialogTrigger asChild>
                       <Button className="font-black gap-2 h-11 px-6 rounded-[0.625rem] shadow-lg shadow-primary/20">
                          <Plus className="h-5 w-5" /> Add New Module
                       </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl rounded-[1rem] p-0 overflow-hidden">
                       <DialogHeader className="p-6 bg-muted/20 border-b">
                          <DialogTitle className="text-2xl font-black">{editingLesson ? 'Edit Module' : 'Add New Curriculum Module'}</DialogTitle>
                       </DialogHeader>
                       <form onSubmit={handleLessonSubmit}>
                          <div className="p-6 space-y-6">
                             <div className="space-y-2">
                                <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Module Title</Label>
                                <Input name="title" defaultValue={editingLesson?.title} required className="h-11 rounded-[0.625rem] bg-muted/20 border-none font-bold" placeholder="e.g. Architecting for Scale" />
                             </div>
                             <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                   <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Video Asset URL (YouTube/Vimeo)</Label>
                                   <Input name="videoUrl" defaultValue={editingLesson?.videoUrl} className="h-11 rounded-[0.625rem] bg-muted/20 border-none font-bold" placeholder="https://..." />
                                </div>
                                <div className="space-y-2">
                                   <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Estimated Duration</Label>
                                   <Input name="duration" defaultValue={editingLesson?.duration} className="h-11 rounded-[0.625rem] bg-muted/20 border-none font-bold" placeholder="e.g. 15:00" />
                                </div>
                             </div>
                             <div className="space-y-2">
                                <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Instructional Content (Markdown Supported)</Label>
                                <Textarea name="content" defaultValue={editingLesson?.content} className="h-40 rounded-[0.625rem] bg-muted/20 border-none font-medium leading-relaxed" />
                             </div>
                          </div>
                          <DialogFooter className="p-4 bg-muted/20 border-t flex justify-end gap-3">
                             <Button type="button" variant="ghost" onClick={() => setIsLessonDialogOpen(false)} className="font-bold">Cancel</Button>
                             <Button type="submit" className="font-black px-8" disabled={createLessonMutation.isPending || updateLessonMutation.isPending}>
                                {createLessonMutation.isPending || updateLessonMutation.isPending ? <Loading /> : (editingLesson ? 'Save Module' : 'Add to Syllabus')}
                             </Button>
                          </DialogFooter>
                       </form>
                    </DialogContent>
                 </Dialog>
              </div>

              <div className="space-y-4">
                 {course.lessons?.map((lesson: any, i: number) => (
                    <div key={lesson.id} className="saas-card flex items-center gap-6 group hover:border-primary/40 transition-all border-muted-foreground/10 bg-card">
                       <div className="h-12 w-12 rounded-[0.75rem] bg-primary/5 flex items-center justify-center shrink-0 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                          <span className="font-black text-lg">{i + 1}</span>
                       </div>
                       <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-black leading-tight group-hover:text-primary transition-colors">{lesson.title}</h3>
                          <div className="flex items-center gap-4 mt-1">
                             <span className="flex items-center gap-1 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                <Video className="h-3 w-3" /> {lesson.videoUrl ? 'Video' : 'Text'} Content
                             </span>
                             <span className="flex items-center gap-1 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                <Clock className="h-3 w-3" /> {lesson.duration || 'N/A'}
                             </span>
                          </div>
                       </div>
                       <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-[0.625rem] hover:bg-primary/10 hover:text-primary" onClick={() => openEditLesson(lesson)}>
                             <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-10 w-10 rounded-[0.625rem] hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => {
                              if(confirm("Are you sure you want to remove this module?")) {
                                deleteLessonMutation.mutate(lesson.id);
                              }
                            }}
                          >
                             <Trash2 className="h-4 w-4" />
                          </Button>
                       </div>
                    </div>
                 ))}
                 {(!course.lessons || course.lessons.length === 0) && (
                    <div className="py-20 text-center saas-card bg-transparent border-dashed border-2 flex flex-col items-center gap-4 border-muted-foreground/20">
                       <BookOpen className="h-12 w-12 text-muted-foreground opacity-20" />
                       <h3 className="text-xl font-bold">Curriculum is empty</h3>
                       <p className="text-muted-foreground max-w-sm mx-auto">Start adding modules to build your educational framework.</p>
                       <Button onClick={() => setIsLessonDialogOpen(true)} variant="outline" className="font-bold border-muted-foreground/30">Add Your First Module</Button>
                    </div>
                 )}
              </div>
           </div>
        </TabsContent>

        <TabsContent value="assessments" className="animate-in fade-in duration-500">
           <div className="grid md:grid-cols-2 gap-8">
              <Card className="saas-card border-muted-foreground/10">
                 <CardHeader className="flex flex-row items-center justify-between border-b pb-6 mb-6">
                    <div>
                       <CardTitle className="text-xl font-black">Assignments</CardTitle>
                       <CardDescription className="text-xs font-bold uppercase tracking-widest mt-1">Submit & Review Workflow</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="font-black rounded-[0.5rem]"><Plus className="h-4 w-4" /></Button>
                 </CardHeader>
                 <CardContent className="p-0">
                    <div className="space-y-4">
                       {course.assignments?.map((ass: any) => (
                          <div key={ass.id} className="p-4 rounded-[0.75rem] border bg-muted/10 flex items-center justify-between">
                             <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-primary" />
                                <span className="font-bold text-sm">{ass.title}</span>
                             </div>
                             <Badge variant="secondary" className="font-black text-[9px] uppercase">{ass.type || 'Standard'}</Badge>
                          </div>
                       ))}
                       {!course.assignments?.length && <p className="text-center py-10 text-muted-foreground text-sm font-bold uppercase tracking-widest opacity-40 italic">No Assignments Defined</p>}
                    </div>
                 </CardContent>
              </Card>

              <Card className="saas-card border-muted-foreground/10">
                 <CardHeader className="flex flex-row items-center justify-between border-b pb-6 mb-6">
                    <div>
                       <CardTitle className="text-xl font-black">Knowledge Quizzes</CardTitle>
                       <CardDescription className="text-xs font-bold uppercase tracking-widest mt-1">Automated Assessments</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="font-black rounded-[0.5rem]"><Plus className="h-4 w-4" /></Button>
                 </CardHeader>
                 <CardContent className="p-0">
                    <div className="space-y-4">
                       {course.quizzes?.map((quiz: any) => (
                          <div key={quiz.id} className="p-4 rounded-[0.75rem] border bg-muted/10 flex items-center justify-between">
                             <div className="flex items-center gap-3">
                                <CheckCircle2 className="h-5 w-5 text-amber-500" />
                                <span className="font-bold text-sm">{quiz.title}</span>
                             </div>
                             <Badge variant="secondary" className="font-black text-[9px] uppercase">{quiz.questionsCount || 0} Qs</Badge>
                          </div>
                       ))}
                       {!course.quizzes?.length && <p className="text-center py-10 text-muted-foreground text-sm font-bold uppercase tracking-widest opacity-40 italic">No Quizzes Defined</p>}
                    </div>
                 </CardContent>
              </Card>
           </div>
        </TabsContent>

        <TabsContent value="settings" className="animate-in fade-in duration-500">
           <div className="max-w-2xl">
              <Card className="saas-card border-muted-foreground/10">
                 <CardHeader>
                    <CardTitle className="text-xl font-black flex items-center gap-2 text-destructive"><Settings className="h-5 w-5" /> Danger Zone</CardTitle>
                    <CardDescription>Critical course management actions.</CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 rounded-[0.75rem] bg-destructive/5 border border-destructive/20">
                       <div>
                          <p className="font-black text-sm text-destructive uppercase tracking-widest">Archive Course</p>
                          <p className="text-xs text-muted-foreground">Students will no longer be able to enroll, but existing ones keep access.</p>
                       </div>
                       <Button variant="destructive" className="font-black rounded-[0.5rem]">Archive</Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 rounded-[0.75rem] bg-primary/5 border border-primary/20">
                       <div>
                          <p className="font-black text-sm text-primary uppercase tracking-widest">Publish Status</p>
                          <p className="text-xs text-muted-foreground">Make this course visible to the public marketplace.</p>
                       </div>
                       <Button 
                         variant={courseForm.status === 'PUBLISHED' ? 'outline' : 'default'} 
                         className="font-black rounded-[0.5rem]"
                         onClick={() => setCourseForm({...courseForm, status: courseForm.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'})}
                       >
                          {courseForm.status === 'PUBLISHED' ? 'Take Offline' : 'Publish Live'}
                       </Button>
                    </div>
                 </CardContent>
              </Card>
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
