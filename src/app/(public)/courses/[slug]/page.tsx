"use client";

import { use, useState } from "react";
import { useCourseBySlug } from "@/hooks/useCourses";
import { useCourseReviews, useRelatedCourses, useCreateReview } from "@/hooks/useReviewData";
import { useCourseProgress } from "@/hooks/useStudentData";
import { Loading } from "@/components/shared/Loading";
import { ErrorState } from "@/components/shared/ErrorState";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Star,
  Clock,
  BookOpen,
  Award,
  Users,
  CheckCircle2,
  Calendar,
  Share2,
  Bookmark,
  PlayCircle,
  BarChart,
  ShieldCheck,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  MessageSquare
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export default function CourseDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data: courseData, isLoading: isCourseLoading, isError: isCourseError, refetch: refetchCourse } = useCourseBySlug(slug);
  
  const course = courseData?.data;
  const courseId = course?.id;

  const { data: reviewsData, isLoading: isReviewsLoading } = useCourseReviews(courseId || "");
  const { data: relatedCoursesData } = useRelatedCourses(courseId || "");
  const { data: progressData } = useCourseProgress(courseId || "");
  const createReviewMutation = useCreateReview();

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isRecommended, setIsRecommended] = useState(true);

  if (isCourseLoading) return <Loading />;
  if (isCourseError || !course) return <ErrorState message="Course not found" onRetry={refetchCourse} />;

  const isEnrolled = !!progressData?.data;
  const { reviews = [], stats } = reviewsData?.data || {};
  const relatedCourses = relatedCoursesData?.data || [];

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId) return;

    createReviewMutation.mutate({
      courseId,
      payload: {
        rating: reviewRating,
        comment: reviewComment,
        isRecommended
      }
    }, {
      onSuccess: () => {
        setReviewComment("");
        setReviewRating(5);
      }
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFCF8] dark:bg-[#1A1A1A] animate-in fade-in duration-1000">
      {/* Hero Section */}
      <div className="bg-card border-b border-border/40 pt-32 pb-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none">
           <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3" />
        </div>

        <div className="container mx-auto px-6 grid lg:grid-cols-12 gap-16 items-center relative z-10">
          <div className="lg:col-span-8 space-y-10">
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">
              <Link href="/courses" className="hover:text-primary transition-colors">Academy</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href={`/courses?category=${course.category.slug}`} className="hover:text-primary transition-colors">{course.category.name}</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-foreground/40 line-clamp-1">{course.title}</span>
            </div>

            <div className="space-y-6">
               <h1 className="text-5xl md:text-7xl font-black tracking-tight text-foreground leading-[0.95] text-premium">
                 {course.title}
               </h1>
               <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl font-medium">
                 {course.description}
               </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-10 pt-4">
              <div className="flex items-center gap-3 bg-amber-500/5 px-4 py-2 rounded-2xl border border-amber-500/10">
                <span className="text-xl font-black text-amber-600">{stats?.averageRating || "0.0"}</span>
                <div className="flex text-amber-500">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className={cn("w-4 h-4", i <= (stats?.averageRating || 0) ? "fill-current" : "text-muted-foreground/30")} />
                  ))}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-600/60">
                  ({stats?.totalReviews || 0} Expert Reviews)
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                <Users className="w-5 h-5 text-primary/40" />
                {course._count?.enrollments || 0} Enrolled
              </div>
              <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                <Calendar className="w-5 h-5 text-primary/40" />
                Updated {new Date(course.updatedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </div>
            </div>

            <div className="flex items-center gap-6 pt-10 border-t border-border/40">
              <div className="relative">
                 <Avatar className="h-16 w-16 border-2 border-background shadow-xl">
                   <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${course.instructor.name}`} />
                   <AvatarFallback className="font-black bg-primary/10 text-primary">{course.instructor.name?.charAt(0)}</AvatarFallback>
                 </Avatar>
                 <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-emerald-500 rounded-full border-2 border-background flex items-center justify-center">
                    <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                 </div>
              </div>
              <div>
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Verified Expert</p>
                <p className="text-xl font-black text-foreground">{course.instructor.name}</p>
              </div>
            </div>
          </div>

          {/* Sticky Purchase Card */}
          <div className="hidden lg:block lg:col-span-4">
             <div className="saas-card !p-2 bg-white dark:bg-[#222] border-border/40 shadow-2xl relative group overflow-visible">
              <div className="absolute -inset-4 bg-primary/5 rounded-[40px] blur-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              
              <div className="relative aspect-video rounded-3xl overflow-hidden shadow-inner bg-muted">
                 <Image
                   src={course.thumbnailUrl || "/no_image.jpg"}
                   alt={course.title}
                   fill
                   sizes="(max-width: 1024px) 100vw, 33vw"
                   className="object-cover transition-transform duration-1000 group-hover:scale-110"
                 />
                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 cursor-pointer backdrop-blur-[2px]">
                   <div className="h-20 w-20 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center group/play transition-transform hover:scale-110">
                      <PlayCircle className="h-10 w-10 text-white fill-white/20" />
                   </div>
                 </div>
              </div>

              <div className="p-8 space-y-10">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Full Access License</p>
                     <p className="text-5xl font-black tracking-tighter">${course.price}</p>
                  </div>
                  {course.price > 0 && (
                    <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 animate-pulse">
                      <Zap className="h-6 w-6" />
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-4">
                  <Link href={isEnrolled ? `/learn/${course.slug}` : `/checkout/${course.slug}`} className="w-full">
                    <button className="w-full h-16 bg-primary text-primary-foreground rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20">
                      {isEnrolled ? "Continue Learning" : "Enroll Now"}
                    </button>
                  </Link>
                  <button className="w-full h-16 bg-muted text-foreground rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-muted/80 transition-all flex items-center justify-center gap-3">
                    <Bookmark className="h-5 w-5 text-muted-foreground" />
                    Save Program
                  </button>
                </div>

                <div className="space-y-6 pt-2">
                  <div className="flex items-center justify-center gap-3 py-3 rounded-xl bg-muted/30">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" /> 
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">30-Day Professional Guarantee</span>
                  </div>
                  <div className="space-y-5">
                    <p className="text-xs font-black uppercase tracking-widest text-foreground">Program Curriculum Highlights</p>
                    <ul className="space-y-4 text-sm font-bold text-muted-foreground">
                      <li className="flex items-center gap-4">
                        <div className="h-2 w-2 rounded-full bg-primary" /> 12.5 Hours Masterclass Video
                      </li>
                      <li className="flex items-center gap-4">
                        <div className="h-2 w-2 rounded-full bg-primary" /> {course.lessons?.length || 0} Technical Modules
                      </li>
                      <li className="flex items-center gap-4">
                        <div className="h-2 w-2 rounded-full bg-primary" /> {course.level} Complexity Level
                      </li>
                      <li className="flex items-center gap-4">
                        <div className="h-2 w-2 rounded-full bg-primary" /> Professional Certification
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <section className="container mx-auto px-6 py-24 pb-40">
        <div className="grid lg:grid-cols-12 gap-20">
          <div className="lg:col-span-8">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start border-none bg-transparent h-auto p-0 gap-12 overflow-x-auto overflow-y-hidden pb-4">
                {["Overview", "Curriculum", "Instructor", "Reviews"].map(tab => (
                  <TabsTrigger 
                    key={tab}
                    value={tab.toLowerCase()} 
                    className="data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-0 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground transition-all relative group"
                  >
                    {tab}
                    <div className="absolute bottom-0 left-0 w-0 h-1 bg-primary transition-all group-data-[state=active]:w-full rounded-full" />
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <TabsContent value="overview" className="pt-16 space-y-20 outline-none animate-in fade-in duration-700">
                <div className="space-y-8">
                  <h3 className="text-3xl font-black tracking-tight">Executive Summary</h3>
                  <p className="text-muted-foreground leading-relaxed text-lg font-medium whitespace-pre-wrap max-w-4xl">
                    {course.description}
                  </p>
                </div>
                
                <div className="saas-card p-12 bg-muted/10 border-none shadow-none">
                  <div className="flex items-center gap-4 mb-10">
                     <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        <Target className="h-6 w-6" />
                     </div>
                     <h3 className="text-2xl font-black tracking-tight">Key Learning Objectives</h3>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-8">
                    {[
                      "Mastering core principles and architecture",
                      "Building production-ready applications",
                      "Integrating with advanced AI models",
                      "Optimizing performance and scalability",
                      "Professional debugging and testing",
                      "Deployment and CI/CD workflows"
                    ].map((item, i) => (
                      <div key={i} className="flex gap-4 items-start group">
                        <div className="h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary group-hover:text-white transition-all">
                           <CheckCircle2 className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-base font-bold text-foreground/80 leading-snug">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="curriculum" className="pt-16 outline-none animate-in fade-in duration-700">
                <div className="space-y-10">
                   <div className="flex items-center justify-between border-b border-border/40 pb-8">
                     <h3 className="text-3xl font-black tracking-tight">Structural Design</h3>
                     <span className="px-4 py-2 rounded-xl bg-muted font-black text-[10px] uppercase tracking-widest text-muted-foreground">{course.lessons?.length || 0} Modules</span>
                   </div>
                   <div className="space-y-4">
                      {course.lessons?.map((lesson: any, i: number) => (
                        <div key={lesson.id} className="saas-card p-6 flex items-center justify-between hover:bg-white dark:hover:bg-muted/50 border-none shadow-sm group">
                           <div className="flex items-center gap-8">
                              <div className="h-12 w-12 rounded-2xl bg-muted text-muted-foreground flex items-center justify-center text-sm font-black group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                {String(i + 1).padStart(2, '0')}
                              </div>
                              <div className="space-y-1">
                                <p className="font-black text-lg group-hover:text-primary transition-colors leading-none">{lesson.title}</p>
                                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                                  <Clock className="w-3.5 h-3.5 text-primary/40" />
                                  <span>Duration: {lesson.duration || "15:00"}</span>
                                  <span className="mx-2 opacity-30">•</span>
                                  <span>Verified Content</span>
                                </div>
                              </div>
                           </div>
                           <button className="h-10 px-6 rounded-xl bg-muted text-foreground font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all">Preview</button>
                        </div>
                      ))}
                   </div>
                </div>
              </TabsContent>

              <TabsContent value="instructor" className="pt-16 outline-none animate-in fade-in duration-700">
                <div className="saas-card p-12 flex flex-col md:flex-row gap-12 items-start border-none bg-muted/10 shadow-none">
                   <div className="relative shrink-0">
                      <Avatar className="h-32 w-32 border-4 border-white dark:border-background shadow-2xl">
                         <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${course.instructor.name}`} />
                         <AvatarFallback className="text-3xl font-black">{course.instructor.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-primary rounded-2xl flex items-center justify-center text-white border-4 border-background">
                         <ShieldCheck className="h-5 w-5" />
                      </div>
                   </div>
                   <div className="space-y-6 flex-1">
                      <div>
                        <h3 className="text-3xl font-black tracking-tight">{course.instructor.name}</h3>
                        <p className="text-primary font-black text-xs uppercase tracking-[0.2em] mt-2">Principal Engineering Mentor</p>
                      </div>
                      <p className="text-muted-foreground text-lg leading-relaxed font-medium italic">
                        "Empowering the next generation of technical leaders through systematic, architecture-first learning methodologies."
                      </p>
                      <p className="text-muted-foreground text-base leading-relaxed font-medium">
                        With over 10 years of experience in the industry, {course.instructor.name} has trained thousands of developers worldwide. Specialized in modern web architecture, cloud-native applications, and AI integrations.
                      </p>
                      <div className="pt-4 flex gap-4">
                         <button className="h-12 px-8 bg-foreground text-background dark:bg-background dark:text-foreground rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">View Expert Profile</button>
                         <button className="h-12 px-8 bg-muted text-foreground rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-muted/80 transition-all">Full Biography</button>
                      </div>
                   </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="pt-16 space-y-16 outline-none animate-in fade-in duration-700">
                 {/* Rating Summary Card */}
                 <div className="grid md:grid-cols-12 gap-12 saas-card p-12 border-none bg-card shadow-lg items-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl" />
                    
                    <div className="md:col-span-4 text-center space-y-4 border-b md:border-b-0 md:border-r border-border/40 pb-10 md:pb-0 md:pr-12">
                       <p className="text-7xl font-black text-foreground tracking-tighter">{stats?.averageRating || "0.0"}</p>
                       <div className="flex justify-center gap-1.5 text-amber-500">
                          {[1, 2, 3, 4, 5].map(i => (
                            <Star key={i} className={cn("h-6 w-6", i <= (stats?.averageRating || 0) ? "fill-current" : "text-muted-foreground/20")} />
                          ))}
                       </div>
                       <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Aggregate Expert Rating</p>
                    </div>
                    <div className="md:col-span-8 space-y-5 pl-0 md:pl-4">
                       {stats?.distribution.map((dist) => (
                         <div key={dist.star} className="flex items-center gap-6">
                            <div className="w-16 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">{dist.star} Excellence</div>
                            <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden shadow-inner">
                               <div 
                                 className="h-full bg-amber-500 rounded-full transition-all duration-1000" 
                                 style={{ width: `${dist.percentage}%` }} 
                               />
                            </div>
                            <div className="w-12 text-[9px] text-right font-black text-muted-foreground">{dist.percentage.toFixed(0)}%</div>
                         </div>
                       ))}
                    </div>
                 </div>

                 {/* Write a Review Section (Enrolled Only) */}
                 {isEnrolled && (
                    <div className="saas-card p-12 border-primary/10 bg-primary/5 shadow-none overflow-hidden relative group">
                       <div className="absolute -right-10 -bottom-10 h-40 w-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-1000" />
                       
                       <div className="relative z-10 space-y-10">
                          <div className="flex items-center gap-4">
                             <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                                <MessageSquare className="h-6 w-6" />
                             </div>
                             <div className="space-y-1">
                                <h3 className="text-2xl font-black tracking-tight">Share Your Experience</h3>
                                <p className="text-sm font-bold text-muted-foreground">Your feedback drives the evolution of this program.</p>
                             </div>
                          </div>

                          <form onSubmit={handleReviewSubmit} className="space-y-10">
                             <div className="flex flex-col md:flex-row items-start md:items-center gap-12">
                                <div className="space-y-4">
                                   <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Quality Assessment</Label>
                                   <div className="flex gap-2">
                                      {[1, 2, 3, 4, 5].map((i) => (
                                         <Star 
                                           key={i} 
                                           className={cn(
                                             "h-10 w-10 cursor-pointer transition-all hover:scale-110",
                                             i <= reviewRating ? "fill-amber-500 text-amber-500" : "text-muted-foreground/20"
                                           )} 
                                           onClick={() => setReviewRating(i)}
                                         />
                                      ))}
                                   </div>
                                </div>
                                <div className="space-y-4">
                                   <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Program Recommendation</Label>
                                   <div className="flex gap-3">
                                      <button 
                                        type="button" 
                                        className={cn(
                                          "h-12 px-8 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-3",
                                          isRecommended ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-muted text-muted-foreground hover:bg-muted/80"
                                        )}
                                        onClick={() => setIsRecommended(true)}
                                      >
                                         <ThumbsUp className="h-4 w-4" /> Recommend
                                      </button>
                                      <button 
                                        type="button" 
                                        className={cn(
                                          "h-12 px-8 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-3",
                                          !isRecommended ? "bg-destructive text-white shadow-lg shadow-destructive/20" : "bg-muted text-muted-foreground hover:bg-muted/80"
                                        )}
                                        onClick={() => setIsRecommended(false)}
                                      >
                                         <ThumbsDown className="h-4 w-4" /> Not Recommended
                                      </button>
                                   </div>
                                </div>
                             </div>
                             <div className="space-y-4">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Expert Testimony</Label>
                                <Textarea 
                                  placeholder="Articulate your thoughts on the curriculum, instructor, and overall value..."
                                  className="min-h-[160px] rounded-3xl bg-white dark:bg-background border-none shadow-inner p-8 font-bold text-base focus:ring-4 focus:ring-primary/5 transition-all"
                                  value={reviewComment}
                                  onChange={(e) => setReviewComment(e.target.value)}
                                  required
                                />
                             </div>
                             <button 
                               type="submit" 
                               className="h-16 px-12 bg-primary text-primary-foreground rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 disabled:opacity-50" 
                               disabled={createReviewMutation.isPending}
                             >
                                {createReviewMutation.isPending ? "Validating Submission..." : "Publish Testimony"}
                             </button>
                          </form>
                       </div>
                    </div>
                 )}
                 
                 {/* Review List */}
                 <div className="grid gap-8">
                    {reviews.map((review) => (
                      <div key={review.id} className="saas-card p-10 border-none bg-muted/10 shadow-none flex flex-col md:flex-row gap-10 items-start hover:bg-muted/20 transition-all">
                         <div className="relative shrink-0">
                            <Avatar className="h-16 w-16 border-2 border-white dark:border-background shadow-xl">
                              <AvatarImage src={review.user.image} />
                              <AvatarFallback className="font-black bg-primary/10 text-primary text-base">{review.user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-emerald-500 rounded-full border-2 border-background flex items-center justify-center">
                               <ShieldCheck className="h-3.5 w-3.5 text-white" />
                            </div>
                         </div>
                         <div className="flex-1 space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                               <div className="space-y-1">
                                  <p className="font-black text-xl tracking-tight">{review.user.name}</p>
                                  <div className="flex gap-1 text-amber-500">
                                     {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={cn("h-3.5 w-3.5", i < review.rating ? "fill-current" : "text-muted-foreground/20")} />
                                     ))}
                                  </div>
                               </div>
                               <span className="px-4 py-1.5 rounded-full bg-muted text-[9px] font-black text-muted-foreground uppercase tracking-widest border border-border/40">Verified Alumnus • {new Date(review.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-muted-foreground text-lg leading-relaxed font-medium italic">
                               "{review.comment}"
                            </p>
                            <div className="flex items-center gap-3">
                               {review.isRecommended ? (
                                  <div className="flex items-center gap-2 text-emerald-600 font-black text-[9px] uppercase tracking-widest bg-emerald-500/5 px-3 py-1.5 rounded-xl border border-emerald-500/10">
                                     <ThumbsUp className="h-3.5 w-3.5" /> Program Recommended
                                  </div>
                               ) : (
                                  <div className="flex items-center gap-2 text-destructive font-black text-[9px] uppercase tracking-widest bg-destructive/5 px-3 py-1.5 rounded-xl border border-destructive/10">
                                     <ThumbsDown className="h-3.5 w-3.5" /> Constructive Feedback
                                  </div>
                               )}
                               <button className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all ml-auto">
                                  <Share2 className="h-3.5 w-3.5" /> Share
                               </button>
                            </div>
                         </div>
                      </div>
                    ))}
                    {!reviews.length && (
                      <div className="text-center py-32 saas-card bg-transparent border-dashed border-2 border-muted-foreground/10 shadow-none">
                         <div className="h-20 w-20 rounded-3xl bg-muted/30 flex items-center justify-center mx-auto mb-6">
                            <MessageSquare className="h-10 w-10 text-muted-foreground/20" />
                         </div>
                         <p className="text-muted-foreground font-black uppercase tracking-[0.2em] text-xs">Awaiting verified testimonials</p>
                      </div>
                    )}
                 </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Related Courses Section */}
      {relatedCourses.length > 0 && (
         <section className="bg-muted/20 py-32 border-t border-border/40">
            <div className="container mx-auto px-6">
               <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 px-2">
                  <div className="space-y-4">
                     <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.2em]">
                        <Sparkles className="h-4 w-4" /> Recommended Pathways
                     </div>
                     <h2 className="text-4xl md:text-5xl font-black tracking-tight">Academic <span className="text-primary">Curations.</span></h2>
                     <p className="text-muted-foreground font-medium text-lg max-w-xl">Intelligent recommendations tailored for high-growth technical careers.</p>
                  </div>
                  <Link href="/courses">
                     <button className="h-14 px-8 bg-foreground text-background dark:bg-background dark:text-foreground rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">Explore Entire Academy</button>
                  </Link>
               </div>
               <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                  {relatedCourses.map((related) => (
                     <Link href={`/courses/${related.slug}`} key={related.id} className="saas-card group !p-0 overflow-hidden border-none bg-card shadow-lg hover:shadow-2xl transition-all">
                        <div className="aspect-video relative overflow-hidden bg-muted">
                           <img src={related.thumbnailUrl || "/no_image.jpg"} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" alt={related.title} />
                           <div className="absolute top-4 right-4 h-10 w-10 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                              <ArrowRight className="h-5 w-5 text-white" />
                           </div>
                        </div>
                        <div className="p-8 space-y-6">
                           <div className="space-y-2">
                              <h3 className="text-lg font-black leading-tight group-hover:text-primary transition-colors line-clamp-2">{related.title}</h3>
                              <p className="text-[10px] font-black text-primary uppercase tracking-widest">{related.instructor.name}</p>
                           </div>
                           <div className="flex items-center justify-between pt-4 border-t border-border/40">
                              <div className="flex items-center gap-2 font-black text-[10px] text-amber-500 bg-amber-500/5 px-2.5 py-1 rounded-lg">
                                 <Star className="h-3.5 w-3.5 fill-current" /> 4.9
                              </div>
                              <p className="font-black text-xl tracking-tight">${related.price}</p>
                           </div>
                        </div>
                     </Link>
                  ))}
               </div>
            </div>
         </section>
      )}

      {/* FAQ Section */}
      <section className="bg-white dark:bg-[#1A1A1A] py-32 border-t border-border/40">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-24">
           <div className="space-y-12">
              <div className="space-y-4">
                 <h3 className="text-3xl font-black tracking-tight">Technical Clarifications</h3>
                 <p className="text-muted-foreground font-medium">Common inquiries regarding program structure and access.</p>
              </div>
              <Accordion type="single" collapsible className="w-full space-y-4">
                <AccordionItem value="item-1" className="saas-card !p-0 border-none bg-muted/20 overflow-hidden">
                  <AccordionTrigger className="text-base font-black hover:no-underline hover:text-primary px-8 py-6">Academic Access Parameters</AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground leading-relaxed px-8 pb-8 font-medium">You gain indefinite lifetime access to all core curriculum materials, including all subsequent technical updates and expert sessions.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2" className="saas-card !p-0 border-none bg-muted/20 overflow-hidden">
                  <AccordionTrigger className="text-base font-black hover:no-underline hover:text-primary px-8 py-6">Certification Validation</AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground leading-relaxed px-8 pb-8 font-medium">Upon successful program completion, a cryptographically verified digital certificate is issued, compatible with professional networking platforms.</AccordionContent>
                </AccordionItem>
              </Accordion>
           </div>
           
           <div className="saas-card p-14 border-none bg-primary shadow-2xl shadow-primary/20 space-y-8 flex flex-col justify-center relative overflow-hidden group">
              <div className="absolute -right-10 -bottom-10 h-64 w-64 bg-white/5 rounded-full blur-[100px] group-hover:bg-white/10 transition-all duration-1000" />
              <div className="relative z-10 space-y-6">
                 <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white shadow-inner">
                   <Share2 className="w-8 h-8" />
                 </div>
                 <div className="space-y-3">
                    <h3 className="text-4xl font-black text-white tracking-tight">Empower an Associate.</h3>
                    <p className="text-lg text-primary-foreground/80 font-medium leading-relaxed">Transmit this technical mastery to a colleague or associate via our professional gifting infrastructure.</p>
                 </div>
                 <button className="w-fit mt-6 h-16 px-12 bg-white text-primary rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10">Initialize Corporate Gift</button>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}
