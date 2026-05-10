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

export default function Home() {
  const featuredCourses = [
    {
      title: "Advanced React Patterns & System Architecture",
      category: "Software Engineering",
      level: "Intermediate",
      duration: "12 Weeks",
      rating: 4.9,
      reviews: 1240,
      price: "$89",
      mentor: "Alex Rivers",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60"
    },
    {
      title: "AI Product Management: From Concept to Scale",
      category: "Product",
      level: "All Levels",
      duration: "8 Weeks",
      rating: 4.8,
      reviews: 850,
      price: "Free",
      mentor: "Sarah Chen",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60"
    },
    {
      title: "Full-Stack Data Science with Python & SQL",
      category: "Data Science",
      level: "Advanced",
      duration: "16 Weeks",
      rating: 4.7,
      reviews: 2100,
      price: "$129",
      mentor: "Dr. James Wilson",
      image: "https://images.unsplash.com/photo-1518186239717-2e9b13673628?w=800&auto=format&fit=crop&q=60"
    },
    {
      title: "Digital Design Systems & Framer Motion",
      category: "Design",
      level: "Beginner",
      duration: "6 Weeks",
      rating: 4.9,
      reviews: 920,
      price: "$69",
      mentor: "Elena Rossi",
      image: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&auto=format&fit=crop&q=60"
    }
  ];

  const categories = [
    { name: "Development", count: "120+ Courses", icon: <BookOpen className="w-5 h-5" /> },
    { name: "Business", count: "85+ Courses", icon: <TrendingUp className="w-5 h-5" /> },
    { name: "Design", count: "64+ Courses", icon: <Star className="w-5 h-5" /> },
    { name: "Marketing", count: "42+ Courses", icon: <Users className="w-5 h-5" /> },
    { name: "AI & ML", count: "38+ Courses", icon: <BrainCircuit className="w-5 h-5" /> },
    { name: "Lifestyle", count: "25+ Courses", icon: <Clock className="w-5 h-5" /> }
  ];

  return (
    <div className="flex flex-col bg-background lg:px-6">
      
      {/* 1. Hero Section - Product Driven */}
      <section className="relative min-h-[65vh] lg:h-[70vh] flex items-center pt-24 lg:pt-44 pb-12 lg:pb-0 overflow-hidden">
        <div className="container mx-auto px-4 md:px-0 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 max-w-2xl">
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
                <Button size="lg" className="px-8 h-14 font-bold text-base shadow-xl shadow-primary/20">
                  Explore Programs
                </Button>
              </Link>
              <Link href="/auth/register">
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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative z-10 rounded-2xl border border-border bg-card shadow-2xl overflow-hidden aspect-4/3">
               {/* Mock Dashboard Preview */}
               <div className="absolute inset-0 bg-muted/30 p-6 flex flex-col gap-6">
                  <div className="flex justify-between items-center">
                    <div className="h-4 w-32 bg-border rounded-full" />
                    <div className="h-4 w-4 bg-primary rounded-full animate-pulse" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-24 bg-background rounded-xl border border-border p-4 space-y-3 shadow-sm">
                       <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <BarChart3 className="w-4 h-4 text-primary" />
                       </div>
                       <div className="h-2 w-full bg-muted rounded" />
                    </div>
                    <div className="h-24 bg-background rounded-xl border border-border p-4 space-y-3 shadow-sm">
                       <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                       </div>
                       <div className="h-2 w-full bg-muted rounded" />
                    </div>
                    <div className="h-24 bg-background rounded-xl border border-border p-4 space-y-3 shadow-sm">
                       <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center">
                          <Clock className="w-4 h-4 text-amber-500" />
                       </div>
                       <div className="h-2 w-full bg-muted rounded" />
                    </div>
                  </div>
                  <div className="flex-1 bg-background rounded-xl border border-border p-6 space-y-6 shadow-sm">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-primary/20 animate-pulse" />
                       <div className="space-y-2">
                          <div className="h-3 w-48 bg-muted-foreground/30 rounded" />
                          <div className="h-2 w-32 bg-border rounded" />
                       </div>
                    </div>
                    <div className="space-y-3">
                       {[1,2,3].map(i => (
                         <div key={i} className="flex items-center gap-4 p-3 rounded-lg border border-border/50 bg-card/50">
                           <div className="w-2 h-2 rounded-full bg-primary" />
                           <div className="h-2 flex-1 bg-border rounded" />
                           <div className="h-4 w-12 bg-primary/10 rounded text-[8px] font-bold text-primary flex items-center justify-center">Lvl {i}</div>
                         </div>
                       ))}
                    </div>
                  </div>
               </div>
               <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />
            </div>
            {/* Background blobs */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl -z-10" />
          </motion.div>
        </div>
      </section>

      {/* 2. Quick Search Strip */}
      <section className="relative z-20 mt-4 pb-12">
        <div className="container mx-auto px-4 md:px-8">
          <div className="bg-background rounded-2xl border border-border p-2 flex flex-col md:flex-row items-center gap-2 shadow-xl transition-all duration-300 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50">
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
            <Button className="w-full md:w-auto h-12 px-8 rounded-xl font-bold bg-primary hover:opacity-90">
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
          {featuredCourses.map((course, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="lms-card flex flex-col overflow-hidden group cursor-pointer"
            >
              <div className="relative aspect-16/10 overflow-hidden">
                <Image 
                  src={course.image ? course.image : "/no_image.jpg"} 
                  alt={course.title} 
                  fill 
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                   <Badge className="bg-white/90 text-zinc-900 border-none backdrop-blur-sm text-[10px] font-bold px-2 py-0.5">
                     {course.category}
                   </Badge>
                </div>
                <button className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/90 text-zinc-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <PlayCircle className="w-5 h-5 text-primary" />
                </button>
              </div>
              <div className="p-5 flex-1 flex flex-col gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {course.duration}</span>
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
                         src={`https://api.dicebear.com/7.x/initials/svg?seed=${course.mentor}`} 
                         alt="Mentor" 
                         fill 
                         sizes="24px"
                         unoptimized 
                       />
                    </div>
                    <span className="text-[11px] font-bold text-muted-foreground">{course.mentor}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-extrabold text-foreground">{course.price}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
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
            {categories.map((cat, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="bg-card/60 border border-border p-6 rounded-2xl flex flex-col items-center text-center gap-4 cursor-pointer hover:border-primary/50 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                  {cat.icon}
                </div>
                <div>
                  <h4 className="font-bold text-sm">{cat.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{cat.count}</p>
                </div>
              </motion.div>
            ))}
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
         <div className="grid md:grid-cols-4 gap-8">
            {[
              { name: "Alex Rivers", role: "Sr. Engineer @ Vercel", students: "4.2k", rating: "4.9" },
              { name: "Sarah Chen", role: "Product Lead @ Stripe", students: "3.8k", rating: "4.8" },
              { name: "James Wilson", role: "Data Scientist @ Google", students: "5.1k", rating: "5.0" },
              { name: "Elena Rossi", role: "Design Director @ Airbnb", students: "2.9k", rating: "4.9" }
            ].map((m, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="lms-card p-6 text-center space-y-4"
              >
                <div className="w-24 h-24 rounded-full mx-auto bg-muted overflow-hidden relative border-4 border-white shadow-lg">
                   <Image 
                     src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${m.name}`} 
                     alt={m.name} 
                     fill 
                     sizes="96px"
                     unoptimized 
                   />
                </div>
                <div>
                   <h4 className="font-bold text-lg">{m.name}</h4>
                   <p className="text-xs text-primary font-semibold">{m.role}</p>
                </div>
                <div className="flex justify-between items-center px-4 py-3 bg-muted/50 rounded-xl">
                   <div className="text-center">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Students</p>
                      <p className="text-sm font-extrabold">{m.students}</p>
                   </div>
                   <div className="text-center">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Rating</p>
                      <p className="text-sm font-extrabold flex items-center gap-1"><Star className="w-3 h-3 text-amber-500 fill-current" /> {m.rating}</p>
                   </div>
                </div>
                <Button variant="outline" className="w-full rounded-lg text-xs font-bold uppercase tracking-widest border-primary/20 text-primary hover:bg-primary/5">
                   View Profile
                </Button>
              </motion.div>
            ))}
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
                  <Link href="/auth/register">
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
