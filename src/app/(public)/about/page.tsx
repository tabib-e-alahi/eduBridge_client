"use client";

import Image from "next/image";
import { GraduationCap, Users, Target, ShieldCheck, Sparkles, Zap, Globe, Cpu, ChevronRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  const stats = [
    { label: "Active Learners", value: "25K+", icon: Users },
    { label: "Expert Mentors", value: "200+", icon: GraduationCap },
    { label: "Courses", value: "450+", icon: Target },
    { label: "Success Rate", value: "94%", icon: Sparkles },
  ];

  const values = [
    {
      title: "Industry-Standard Quality",
      description: "We curate only the highest fidelity content from industry professionals to ensure your learning is actionable and relevant.",
      icon: ShieldCheck,
    },
    {
      title: "AI-Powered Personalization",
      description: "Our proprietary AI tutor adapts to your learning style, providing real-time assistance and personalized study paths.",
      icon: Cpu,
    },
    {
      title: "Career Acceleration",
      description: "Everything we build is driven by our commitment to helping learners transition into top-tier tech roles efficiently.",
      icon: Zap,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden bg-[#FDFCF8] dark:bg-[#262626] border-b border-border">
        <div className="container mx-auto px-4 md:px-6 relative">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider mb-6">
                Our Mission
              </Badge>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1]">
                Empowering the next generation of <span className="text-primary">tech leaders.</span>
              </h1>
            </motion.div>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto"
            >
              EduBridge AI is a modern learning platform designed to bridge the gap between traditional education and the fast-paced demands of the technology industry.
            </motion.p>
          </div>
        </div>
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-card border-b border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {stats.map((stat, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="space-y-3"
              >
                <div className="mx-auto w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-4xl md:text-5xl font-extrabold tracking-tight">{stat.value}</div>
                <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story & Values */}
      <section className="py-24 md:py-32 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-24">
            <div className="space-y-8">
               <div className="space-y-4">
                 <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Built for modern <br />learning.</h2>
                 <p className="text-lg text-muted-foreground leading-relaxed">
                   Founded by a team of engineers and educators, EduBridge AI emerged as a response to the stagnation of traditional learning systems. We combine world-class curriculum with advanced AI to create a platform that adapts to you.
                 </p>
                 <p className="text-lg text-muted-foreground leading-relaxed">
                   Our goal is to make premium, industry-standard education accessible, fast, and highly effective for everyone from beginners to senior developers.
                 </p>
               </div>
               <div className="flex gap-4 pt-4">
                  <Button className="h-12 px-8 font-bold text-base bg-primary hover:opacity-90 rounded-[0.625rem]">
                    Join the Platform
                  </Button>
               </div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
               <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-border shadow-2xl">
                  <Image 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop" 
                    alt="Team collaboration" 
                    fill 
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
               </div>
               
               {/* Floating Badge */}
               <div className="absolute -bottom-6 -left-6 bg-card border border-border p-4 rounded-[0.625rem] shadow-xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                     <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                     <p className="font-extrabold text-lg">94%</p>
                     <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Placement Rate</p>
                  </div>
               </div>
            </motion.div>
          </div>

          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
             <h2 className="text-3xl font-extrabold tracking-tight">Our Core Values</h2>
             <p className="text-muted-foreground text-lg">The principles that guide our product and curriculum design.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="saas-card p-8 rounded-[0.625rem] space-y-4 text-center md:text-left flex flex-col items-center md:items-start"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-2">
                  <value.icon className="w-7 h-7" />
                </div>
                <h4 className="font-extrabold text-xl tracking-tight">{value.title}</h4>
                <p className="text-muted-foreground leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Reach */}
      <section className="py-24 bg-card border-y border-border overflow-hidden relative">
         <div className="container mx-auto px-4 md:px-6 relative z-10 text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Trusted globally.</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
               Our students and mentors come from over 40 countries, creating a diverse and dynamic learning environment.
            </p>
            <div className="flex justify-center gap-8 pt-8 opacity-50 flex-wrap">
               <div className="flex items-center gap-2 font-bold text-xl"><Globe className="w-6 h-6" /> North America</div>
               <div className="flex items-center gap-2 font-bold text-xl"><Globe className="w-6 h-6" /> Europe</div>
               <div className="flex items-center gap-2 font-bold text-xl"><Globe className="w-6 h-6" /> Asia Pacific</div>
            </div>
         </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-[#FDFCF8] dark:bg-[#262626] border-t border-border mt-auto">
         <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto bg-primary rounded-[1rem] p-10 md:p-16 text-center text-primary-foreground shadow-xl shadow-primary/20 space-y-8 relative overflow-hidden">
               <div className="relative z-10 space-y-4">
                  <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">Ready to transform <br />your career?</h2>
                  <p className="text-lg text-primary-foreground/80 font-medium max-w-2xl mx-auto">
                    Join thousands of developers who are already learning, building, and growing with EduBridge AI.
                  </p>
               </div>
               <div className="flex flex-wrap justify-center gap-4 relative z-10">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-bold h-14 px-8 rounded-xl shadow-md">
                    Start Learning Free
                  </Button>
                  <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10 text-white font-bold h-14 px-8 rounded-xl">
                    Contact Sales
                  </Button>
               </div>
               {/* Background pattern */}
               <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}
