"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  GraduationCap, 
  Star, 
  Users, 
  MessageSquare,
  Award,
  ChevronRight,
  PlayCircle,
  Clock,
  ArrowRight,
  Globe,
  Mail,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loading } from "@/components/shared/Loading";
import { ErrorState } from "@/components/shared/ErrorState";
import { useMentorById } from "@/hooks/useMentors";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";

export default function MentorDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data, isLoading, isError, refetch } = useMentorById(id);

  if (isLoading) return <Loading />;
  if (isError || !data?.data) return <ErrorState onRetry={() => refetch()} />;

  const mentor = data.data;
  const user = mentor.user;
  const courses = user.courses || [];

  return (
    <div className="flex flex-col min-h-screen pb-20">
      {/* 1. Header Section - Large Profile Style */}
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-border">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
           <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-[120px]" />
           <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
             {/* Profile Image */}
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="relative h-48 w-48 lg:h-64 lg:w-64 rounded-3xl overflow-hidden border-4 border-white shadow-2xl shrink-0"
             >
                <Image 
                  src={user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
                  alt={user.name} 
                  fill 
                  className="object-cover"
                  unoptimized={!user.image}
                />
             </motion.div>

             {/* Basic Info */}
             <div className="flex-1 space-y-6">
                <div className="space-y-4">
                   <div className="flex flex-wrap gap-2">
                      <Badge className="bg-primary/10 text-primary border-none font-bold text-[10px] uppercase tracking-widest px-3 py-1">Featured Mentor</Badge>
                      <Badge variant="outline" className="text-emerald-600 border-emerald-500/20 bg-emerald-500/5 font-bold text-[10px] uppercase tracking-widest px-3 py-1 flex items-center gap-1">
                         <CheckCircle2 className="h-3 w-3" /> Verified Expert
                      </Badge>
                   </div>
                   <h1 className="text-4xl md:text-5xl font-black tracking-tight">{user.name}</h1>
                   <p className="text-xl font-bold text-primary">{mentor.expertise?.[0]} Expert & System Architect</p>
                </div>

                <p className="text-lg text-muted-foreground max-w-3xl font-medium leading-relaxed italic">
                   "{mentor.bio || `Helping students master ${mentor.expertise?.[0]} through practical, industry-standard projects and personalized mentorship.`}"
                </p>

                <div className="flex flex-wrap gap-8 pt-4">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Expertise In</p>
                      <div className="flex flex-wrap gap-2">
                         {mentor.expertise?.map((exp: string, i: number) => (
                           <Badge key={i} variant="secondary" className="bg-white dark:bg-zinc-800 border-border font-bold text-xs">
                              {exp}
                           </Badge>
                         ))}
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <Button size="icon" variant="outline" className="rounded-xl border-border bg-white dark:bg-zinc-800"><Mail className="h-4 w-4" /></Button>
                      <Button size="icon" variant="outline" className="rounded-xl border-border bg-white dark:bg-zinc-800"><Clock className="h-4 w-4" /></Button>
                      <Button size="icon" variant="outline" className="rounded-xl border-border bg-white dark:bg-zinc-800"><Globe className="h-4 w-4" /></Button>
                   </div>
                </div>
             </div>

             {/* Action Card */}
             <div className="w-full lg:w-80 space-y-4">
                <div className="bg-card border border-border p-6 rounded-2xl shadow-xl space-y-6">
                   <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-muted/50 rounded-xl">
                         <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Students</p>
                         <p className="text-xl font-black">{mentor.totalStudents || "4.2k"}</p>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-xl">
                         <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Rating</p>
                         <p className="text-xl font-black flex items-center justify-center gap-1"><Star className="h-4 w-4 fill-amber-500 text-amber-500" /> {mentor.averageRating || "4.9"}</p>
                      </div>
                   </div>
                   <Button className="w-full h-14 rounded-xl font-black text-white shadow-lg shadow-primary/20 gap-2">
                      <MessageSquare className="h-5 w-5" /> Message Mentor
                   </Button>
                   <p className="text-[10px] text-center font-bold text-muted-foreground uppercase tracking-widest">Typical response: Under 24h</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 py-16">
         <div className="grid lg:grid-cols-12 gap-16">
            
            {/* 2. Left Column: Details */}
            <div className="lg:col-span-8 space-y-16">
               <div className="space-y-6">
                  <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
                     <Award className="h-6 w-6 text-primary" /> Professional Background
                  </h2>
                  <div className="prose prose-zinc dark:prose-invert max-w-none text-muted-foreground font-medium text-lg leading-relaxed">
                     <p>
                        With over {mentor.experienceYears || 10} years of experience in the industry, {user.name} has played key roles in building scalable systems for global tech giants. Their approach to teaching is deeply rooted in practical application, ensuring students not only learn the 'how' but also the 'why' behind architectural decisions.
                     </p>
                     <p>
                        As an expert in {mentor.expertise?.join(", ")}, they have mentored hundreds of developers, many of whom have gone on to land senior positions at companies like Google, Meta, and Netflix.
                     </p>
                  </div>
               </div>

               {/* Published Courses */}
               <div className="space-y-8">
                  <div className="flex items-center justify-between">
                     <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
                        <PlayCircle className="h-6 w-6 text-primary" /> Masterclasses by {user.name.split(' ')[0]}
                     </h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                     {courses.length > 0 ? (
                       courses.map((course: any) => (
                         <Link key={course.id} href={`/courses/${course.id}`}>
                           <div className="lms-card group overflow-hidden flex flex-col h-full hover:border-primary/50 transition-all">
                              <div className="relative aspect-video overflow-hidden">
                                 <Image 
                                   src={course.thumbnailUrl || "/no_image.jpg"} 
                                   alt={course.title} 
                                   fill 
                                   className="object-cover transition-transform duration-500 group-hover:scale-110" 
                                 />
                                 <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                              </div>
                              <div className="p-5 space-y-4 flex-1 flex flex-col">
                                 <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{course.title}</h3>
                                 <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                    <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> Enrolled: 2.1k</span>
                                    <span className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-amber-500 fill-current" /> 4.9</span>
                                 </div>
                              </div>
                           </div>
                         </Link>
                       ))
                     ) : (
                       <div className="col-span-2 py-12 text-center bg-muted/20 border-dashed border border-border rounded-2xl">
                          <p className="text-muted-foreground font-bold">No published courses yet.</p>
                       </div>
                     )}
                  </div>
               </div>
            </div>

            {/* 3. Right Column: Stats & Experience */}
            <div className="lg:col-span-4 space-y-8">
               <div className="bg-card border border-border rounded-2xl p-8 space-y-8">
                  <h3 className="text-lg font-black uppercase tracking-widest text-muted-foreground border-b border-border pb-4">Career Highlights</h3>
                  
                  <div className="space-y-6">
                     <div className="flex gap-4">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                           <Award className="h-5 w-5" />
                        </div>
                        <div>
                           <p className="font-black text-sm">{mentor.experienceYears || "10+"} Years Experience</p>
                           <p className="text-xs font-medium text-muted-foreground">In high-scale tech companies</p>
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                           <Users className="h-5 w-5" />
                        </div>
                        <div>
                           <p className="font-black text-sm">{mentor.totalStudents || "4,200+"} Students</p>
                           <p className="text-xs font-medium text-muted-foreground">Impacted across the globe</p>
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                           <Star className="h-5 w-5" />
                        </div>
                        <div>
                           <p className="font-black text-sm">Top Rated Mentor</p>
                           <p className="text-xs font-medium text-muted-foreground">Highest community satisfaction</p>
                        </div>
                     </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                     <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Availability</p>
                     <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold">
                           <span>1-on-1 Sessions</span>
                           <span className="text-emerald-600">Available</span>
                        </div>
                        <div className="flex justify-between text-xs font-bold">
                           <span>Code Reviews</span>
                           <span className="text-emerald-600">Available</span>
                        </div>
                        <div className="flex justify-between text-xs font-bold">
                           <span>Group Mentorship</span>
                           <span className="text-primary">Starts Monday</span>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Contact Suggestion */}
               <div className="bg-primary text-primary-foreground p-8 rounded-2xl space-y-4 ">
                  <h4 className="text-xl font-black text-white  tracking-tight leading-tight">Need 1-on-1 Career Guidance?</h4>
                  <p className="text-sm font-medium text-primary-foreground/80 leading-relaxed">
                     Book a private session with {user.name.split(' ')[0]} to discuss your career path, review your portfolio, or solve complex architectural challenges.
                  </p>
                  <Button variant="secondary" className="w-full font-black text-xs uppercase tracking-widest h-12 bg-white text-primary hover:bg-white/90">
                     Check Availability
                  </Button>
               </div>
            </div>

         </div>
      </div>
    </div>
  );
}
