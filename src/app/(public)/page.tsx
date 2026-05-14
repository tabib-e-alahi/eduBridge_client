"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Search, 
  Star, 
  Clock, 
  Users, 
  BookOpen, 
  TrendingUp, 
  CheckCircle2, 
  ChevronRight,
  BrainCircuit,
  MessageSquare,
  BarChart3,
  PlayCircle,
  Map
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMentors } from "@/hooks/useMentors";
import { useCourses, useCategories } from "@/hooks/useCourses";

export default function Home() {
  const { data: mentorsData } = useMentors();
  const { data: coursesData } = useCourses({ limit: 4, sortBy: "createdAt", sortOrder: "desc" });
  const { data: categoriesData } = useCategories();

  const mentors = mentorsData?.data?.slice(0, 4) || [];
  const featuredCourses = coursesData?.data || [];
  const categories = categoriesData?.data?.slice(0, 6) || [];

  return (
    <div className="flex flex-col bg-background lg:px-6">
      
      {/* 1. Hero Section - Product Driven */}
      <section className="relative min-h-[70vh] flex items-center pt-24 lg:pt-32 pb-12 overflow-hidden">
        <div className="container mx-auto px-4 md:px-0 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 max-w-2xl relative z-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider">
                Enterprise-Grade Learning
              </Badge>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-6xl font-extrabold leading-[1.1] tracking-tight"
            >
              Master New Skills <br />
              with <span className="text-primary">Precision</span>.
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-muted-foreground leading-relaxed max-w-lg"
            >
              Industry-standard curriculum, world-class mentors, and a structured learning path to guide you every step of the way.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-4 pt-2"
            >
              <Link href="/courses">
                <Button size="lg" className="px-8 h-14 font-bold text-white shadow-xl shadow-primary/20">
                  Explore Programs
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline" className="px-8 h-14 font-bold text-base bg-white dark:bg-card">
                  Create Account
                </Button>
              </Link>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-6 pt-4 text-sm text-muted-foreground font-medium"
            >
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-background overflow-hidden relative">
                    <Image 
                      src={`https://i.pravatar.cc/100?u=${i}`} 
                      alt="User" 
                      fill 
                      sizes="32px"

                    />
                  </div>
                ))}
              </div>
              <p><span className="text-foreground font-bold">12,000+</span> students learning today</p>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative z-10 rounded-[2rem] border border-border/50 bg-card shadow-2xl overflow-hidden aspect-video group">
               {/* Main Product Image */}
               <div className="absolute inset-0">
                  <Image 
                    src="/hero_learning_illustration.png" 
                    alt="EduBridge AI Platform Dashboard" 
                    fill 
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
               </div>

               {/* Interactive Overlay Elements */}
               <div className="absolute inset-0 p-8 flex flex-col justify-between pointer-events-none">
                  {/* Top Row: AI Status */}
                  <div className="flex justify-between items-start">
                     <motion.div 
                       initial={{ x: -20, opacity: 0 }}
                       animate={{ x: 0, opacity: 1 }}
                       transition={{ delay: 0.6 }}
                       className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-2xl flex items-center gap-3 shadow-xl"
                     >
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                           <BrainCircuit className="w-4 h-4 text-white" />
                        </div>
                        <div>
                           <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">AI Tutor Online</p>
                           <p className="text-xs font-bold text-white">Ask me anything...</p>
                        </div>
                     </motion.div>

                     <motion.div 
                       initial={{ x: 20, opacity: 0 }}
                       animate={{ x: 0, opacity: 1 }}
                       transition={{ delay: 0.7 }}
                       className="bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 px-3 py-1.5 rounded-full flex items-center gap-2"
                     >
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Live Learning</span>
                     </motion.div>
                  </div>

                  {/* Bottom Row: Progress Cards */}
                  <div className="grid grid-cols-2 gap-4">
                     <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl space-y-3 shadow-2xl"
                     >
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                              <TrendingUp className="w-4 h-4 text-primary" />
                           </div>
                           <span className="text-xs font-bold text-white">Daily Progress</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                           <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: "72%" }}
                             transition={{ duration: 2, delay: 1 }}
                             className="h-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" 
                           />
                        </div>
                        <p className="text-[10px] font-medium text-white/70">72% of weekly goal achieved</p>
                     </motion.div>

                     <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.9 }}
                        className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl space-y-2 shadow-2xl"
                     >
                        <div className="flex -space-x-2">
                           {[1,2,3].map(i => (
                             <div key={i} className="w-6 h-6 rounded-full border-2 border-white/20 overflow-hidden relative">
                               <Image src={`https://i.pravatar.cc/100?u=${i+10}`} alt="User" fill sizes="24px" />
                             </div>
                           ))}
                           <div className="w-6 h-6 rounded-full border-2 border-white/20 bg-primary flex items-center justify-center text-[8px] font-bold text-white">+12</div>
                        </div>
                        <p className="text-xs font-bold text-white">Study Group</p>
                        <p className="text-[10px] text-white/60">4 friends online now</p>
                     </motion.div>
                  </div>
               </div>
            </div>
            {/* Decorative background glows */}
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/20 rounded-full blur-[100px] -z-10" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-emerald-500/20 rounded-full blur-[100px] -z-10" />
          </motion.div>
        </div>
      </section>

      {/* 2. Quick Search Strip */}
      <section className="relative z-20 mt-4">
        <div className="container mx-auto">
          <div className=" rounded-2xl border border-border p-2 flex flex-col md:flex-row items-center gap-2 shadow-xl transition-all duration-300 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50">
            <div className="flex-1 flex items-center gap-3 px-4 h-12">
              <Search className="w-5 h-5 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="What do you want to learn today?" 
                className="bg-transparent border-none focus:ring-0 focus:outline-none w-full text-sm font-medium placeholder:text-muted-foreground/60"
              />
            </div>
            <div className="w-px h-8 bg-border hidden md:block" />
            <div className="px-4 h-12 flex items-center gap-2 text-sm font-semibold text-muted-foreground cursor-pointer hover:text-primary transition-colors">
              <BookOpen className="w-4 h-4" />
              Categories
            </div>
            <Button className="w-full md:w-auto h-12 px-8 rounded-xl text-white font-bold bg-primary hover:opacity-90">
              Find Courses
            </Button>
          </div>
        </div>
      </section>

      {/* 3. Featured Courses */}
      <section className="container mx-auto px-4 md:px-0 py-24">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Featured Courses</h2>
            <p className="text-muted-foreground text-lg max-w-xl">Curated by experts, tailored for your career growth. Start learning with our top-rated curriculum.</p>
          </div>
          <Link href="/courses">
            <Button variant="ghost" className="font-bold text-primary hover:bg-primary/5 gap-2">
              View all courses <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCourses.length > 0 ? (
            featuredCourses.map((course: any, i: number) => (
              <motion.div 
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="lms-card flex flex-col overflow-hidden group cursor-pointer"
              >
                <Link href={`/courses/${course.slug}`}>
                  <div className="relative aspect-16/10 overflow-hidden">
                    <Image 
                      src={course.thumbnailUrl || "/no_image.jpg"} 
                      alt={course.title} 
                      fill 
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                       <Badge className="bg-white/90 text-zinc-900 border-none backdrop-blur-sm text-[10px] font-bold px-2 py-0.5">
                         {course.category?.name || "Uncategorized"}
                       </Badge>
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                        <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {course.duration || "Self-paced"}</span>
                        <span className="flex items-center gap-1.5"><TrendingUp className="w-3 h-3" /> {course.level}</span>
                      </div>
                      <h3 className="font-bold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                        {course.title}
                      </h3>
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-muted overflow-hidden relative">
                           <Image 
                             src={course.instructor?.image || `https://api.dicebear.com/7.x/initials/svg?seed=${course.instructor?.name}`} 
                             alt="Instructor" 
                             fill 
                             sizes="24px"
                             unoptimized 
                           />
                        </div>
                        <span className="text-[11px] font-bold text-muted-foreground">{course.instructor?.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-extrabold text-foreground">${course.price}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            // Skeleton Loader
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="lms-card h-[380px] animate-pulse bg-muted/40" />
            ))
          )}
        </div>
      </section>

      {/* 4. Categories */}
      <section className="py-24 ">
        <div className="container mx-auto px-4 md:px-0">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight">Popular Categories</h2>
            <p className="text-muted-foreground">Explore diverse domains and start your learning journey today.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.length > 0 ? (
              categories.map((cat: any, i: number) => (
                <motion.div 
                  key={cat.id}
                  whileHover={{ y: -5 }}
                  className="bg-card/60 border border-border p-6 rounded-2xl flex flex-col items-center text-center gap-4 cursor-pointer hover:border-primary/50 hover:shadow-lg transition-all"
                >
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{cat.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{cat._count?.courses || 0} Courses</p>
                  </div>
                </motion.div>
              ))
            ) : (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-32 rounded-2xl bg-muted/40 animate-pulse" />
              ))
            )}
          </div>
        </div>
      </section>

      {/* 5. How It Works */}
      <section className="container mx-auto px-4 md:px-2 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10">
            <div className="space-y-4">
               <h2 className="text-4xl font-extrabold tracking-tight leading-tight">Engineered for <br /><span className="text-primary">Human Learning</span></h2>
               <p className="text-lg text-muted-foreground">We've combined cognitive science with advanced AI to create a platform that adapts to you, not the other way around.</p>
            </div>
            
            <div className="space-y-8">
               {[
                 { title: "Structured Roadmap", desc: "Our curriculum analyzes your goals and skills to create a unique learning path just for you.", icon: <Map className="w-5 h-5" /> },
                 { title: "Boutique Curriculum", desc: "Every course is designed by industry leaders with practical, real-world applications.", icon: <BookOpen className="w-5 h-5" /> },
                 { title: "Expert Mentorship", desc: "Stuck on a problem? Our world-class mentors provide contextual help and guidance.", icon: <MessageSquare className="w-5 h-5" /> }
               ].map((item, i) => (
                 <div key={i} className="flex gap-6">
                    <div className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex-shrink-0 flex items-center justify-center shadow-lg shadow-primary/20">
                       {item.icon}
                    </div>
                    <div className="space-y-1">
                       <h4 className="font-bold text-xl">{item.title}</h4>
                       <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                 </div>
               ))}
            </div>
          </div>

          <div className="relative">
             <div className="aspect-square bg-card rounded-[2rem] border border-border shadow-2xl overflow-hidden p-4">
                <div className="w-full h-full bg-zinc-100 dark:bg-zinc-800 rounded-[1.5rem] relative overflow-hidden">
                   <Image 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1000&auto=format&fit=crop&q=80" 
                    alt="Students collaborating" 
                    fill 
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover opacity-80"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
                   
                   {/* Floating UI Elements */}
                   <motion.div 
                    initial={{ x: 50, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    className="absolute top-10 right-10 bg-card p-4 rounded-xl shadow-xl border border-border w-48"
                   >
                      <div className="flex items-center gap-3 mb-2">
                         <div className="w-2 h-2 rounded-full bg-primary" />
                         <span className="text-[10px] font-bold uppercase tracking-widest">Live Feedback</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                         <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: "85%" }}
                          transition={{ duration: 1.5 }}
                          className="h-full bg-primary" 
                         />
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-2">85% mastery achieved</p>
                   </motion.div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 6. Mentors */}
      <section className="container mx-auto px-4 md:px-2 py-24">
         <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight">Learn from the Best</h2>
            <p className="text-muted-foreground">Direct access to industry professionals from top-tier companies.</p>
         </div>
         <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {mentors.length > 0 ? (
              mentors.map((mentor: any, i: number) => (
                <motion.div 
                  key={mentor.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="lms-card p-6 text-center space-y-4"
                >
                  <div className="w-24 h-24 rounded-full mx-auto bg-muted overflow-hidden relative border-4 border-white shadow-lg">
                     <Image 
                       src={mentor.user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${mentor.user.name}`} 
                       alt={mentor.user.name} 
                       fill 
                       sizes="96px"
                       unoptimized={!mentor.user.image}
                     />
                  </div>
                  <div>
                     <h4 className="font-bold text-lg line-clamp-1">{mentor.user.name}</h4>
                     <p className="text-xs text-primary font-semibold uppercase tracking-widest">{mentor.expertise?.[0] || "Expert"}</p>
                  </div>
                  <div className="flex justify-between items-center px-4 py-3 bg-muted/50 rounded-xl">
                     <div className="text-center">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Students</p>
                        <p className="text-sm font-extrabold">{mentor.totalStudents || 0}</p>
                     </div>
                     <div className="text-center">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Rating</p>
                        <p className="text-sm font-extrabold flex items-center gap-1"><Star className="w-3 h-3 text-amber-500 fill-current" /> {mentor.averageRating || "5.0"}</p>
                     </div>
                  </div>
                  <Link href={`/mentors/${mentor.id}`} className="block">
                    <Button variant="outline" className="w-full rounded-lg text-xs font-bold uppercase tracking-widest border-primary/20 text-primary hover:bg-primary/5">
                       View Profile
                    </Button>
                  </Link>
                </motion.div>
              ))
            ) : (
              // Fallback UI or Loading state for mentors
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="lms-card p-6 space-y-4 animate-pulse">
                  <div className="w-24 h-24 rounded-full mx-auto bg-muted" />
                  <div className="h-4 w-32 bg-muted mx-auto rounded" />
                  <div className="h-12 w-full bg-muted rounded-xl" />
                  <div className="h-10 w-full bg-muted rounded-lg" />
                </div>
              ))
            )}
         </div>
      </section>

      {/* 8. Statistics */}
      <section className="py-24 bg-card border-y border-border rounded-[0.625rem]">
         <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-24">
               {[
                 { label: "Active Students", val: "25k+", icon: <Users className="w-6 h-6 text-primary" /> },
                 { label: "Graduation Rate", val: "94%", icon: <CheckCircle2 className="w-6 h-6 text-emerald-500" /> },
                 { label: "Total Courses", val: "450+", icon: <BookOpen className="w-6 h-6 text-amber-500" /> },
                 { label: "Mentor Sessions", val: "12k+", icon: <MessageSquare className="w-6 h-6 text-indigo-500" /> }
               ].map((stat, i) => (
                 <div key={i} className="flex flex-col items-center text-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center shadow-sm">
                       {stat.icon}
                    </div>
                    <div>
                       <p className="text-4xl font-extrabold tracking-tighter">{stat.val}</p>
                       <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">{stat.label}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* 8. Success Stories */}
      <section className="container mx-auto px-4 md:px-2 py-24">
         <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight">Built for Real Results</h2>
            <p className="text-muted-foreground">Join thousands of professionals who have accelerated their careers with us.</p>
         </div>
         <div className="grid md:grid-cols-3 gap-8">
            {[
              { text: "The structured curriculum helped me master React in weeks. I've never felt so supported in an online course.", author: "Marcus Aurelius", role: "Front-end Dev @ Meta" },
              { text: "Practical curriculum that actually matters. I used what I learned in the Data Science track during my interview.", author: "Helena Vance", role: "Data Analyst @ Revolut" },
              { text: "Best learning investment I've ever made. The mentor sessions are incredibly high-quality and structured.", author: "Sarah Jenkins", role: "Product Designer @ Figma" }
            ].map((t, i) => (
              <div key={i} className="bg-card border border-border p-8 rounded-2xl space-y-6 shadow-sm">
                 <div className="flex gap-1">
                    {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 text-amber-500 fill-current" />)}
                 </div>
                 <p className="text-lg italic font-medium leading-relaxed">"{t.text}"</p>
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-muted overflow-hidden relative">
                       <Image 
                         src={`https://api.dicebear.com/7.x/initials/svg?seed=${t.author}`} 
                         alt={t.author} 
                         fill 
                         sizes="40px"
                         unoptimized 
                       />
                    </div>
                    <div>
                       <p className="font-bold text-sm">{t.author}</p>
                       <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                 </div>
              </div>
            ))}
         </div>
      </section>

      {/* 9. Final CTA */}
      <section className="py-24  relative overflow-hidden">
         <div className="container mx-auto px-4 md:px-2 relative z-10">
            <div className="max-w-4xl mx-auto lms-card p-12 md:p-16 text-center space-y-10 border-primary/20 bg-primary/[0.02]">
               <div className="space-y-4">
                  <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">Ready to elevate your <br />career trajectory?</h2>
                  <p className="text-muted-foreground text-lg md:text-xl font-medium max-w-2xl mx-auto">Join 25,000+ professionals today and master the skills of the future.</p>
               </div>
               <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/register">
                    <Button size="lg" className="px-10 h-14 text-base font-bold shadow-sm">
                      Get Started Free
                    </Button>
                  </Link>
                  <Link href="/courses">
                    <Button size="lg" variant="outline" className="px-10 h-14 text-base font-bold bg-background">
                      Browse Curriculum
                    </Button>
                  </Link>
               </div>
               <div className="flex items-center justify-center gap-6 pt-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Certificate Included</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Lifetime Access</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Expert Mentors</span>
               </div>
            </div>
         </div>
         {/* Background pattern */}
         <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
            <div className="grid grid-cols-12 gap-8 -rotate-12 scale-150">
               {Array.from({length: 144}).map((_, i) => (
                 <div key={i} className="w-full aspect-square border border-primary/20 rounded-lg" />
               ))}
            </div>
         </div>
      </section>

    </div>
  );
}
