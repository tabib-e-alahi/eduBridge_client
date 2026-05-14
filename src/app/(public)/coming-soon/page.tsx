"use client";

import { motion } from "framer-motion";
import { Command, Sparkles, ArrowRight, Mail, Zap, Globe, Send, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

export default function ComingSoonPage() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success("Thanks for joining our waitlist!");
      setEmail("");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden p-6">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse delay-700" />
        <div className="absolute top-[20%] right-[10%] w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />

      <div className="w-full max-w-4xl relative z-10 flex flex-col items-center text-center">
        {/* Animated Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[11px] font-black uppercase tracking-[0.2em] text-primary mb-12 shadow-sm"
        >
          <Sparkles className="h-3.5 w-3.5" /> Something Extraordinary is Coming
        </motion.div>

        {/* Hero Title */}
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl md:text-8xl font-black tracking-tighter text-foreground leading-[0.9] mb-8"
        >
          Redefining the <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-primary/40">
            Future of Learning.
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mb-12 leading-relaxed"
        >
          We&apos;re building a next-generation AI-powered platform to bridge the gap between education and industry excellence. Get ready to experience learning like never before.
        </motion.p>

        {/* Newsletter Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="w-full max-w-md bg-card/50 backdrop-blur-xl border border-border/50 p-2 rounded-[1.25rem] shadow-2xl flex gap-2"
        >
          <div className="flex-1 relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              type="email" 
              placeholder="Enter your email for early access" 
              className="h-12 bg-transparent border-none focus-visible:ring-0 pl-12 font-medium"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button onClick={handleSubscribe} className="h-12 px-8 rounded-xl font-black text-xs uppercase tracking-widest gap-2 shadow-lg shadow-primary/20">
            Notify Me <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24 w-full"
        >
          {[
            { icon: Zap, label: "Hyper-Personalized", sub: "AI-Driven Paths" },
            { icon: Globe, label: "Global Mentors", sub: "Industry Experts" },
            { icon: Command, label: "Hands-on", sub: "Real-world Labs" },
            { icon: Sparkles, label: "Premium Content", sub: "Curated Excellence" }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-muted/50 flex items-center justify-center text-primary border border-border/50 shadow-inner">
                <item.icon className="h-6 w-6" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] font-black uppercase tracking-widest text-foreground">{item.label}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{item.sub}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Footer Info */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-24 pt-8 border-t border-border/50 w-full flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Command className="h-5 w-5 text-white" />
            </div>
            <span className="font-black text-lg tracking-tighter">EduBridge AI</span>
          </div>
          
          <div className="flex items-center gap-4">
             <Link href="#" className="h-10 w-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors">
                <Send className="h-4 w-4" />
             </Link>
             <Link href="#" className="h-10 w-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors">
                <Globe className="h-4 w-4" />
             </Link>
          </div>

          <Link href="/">
            <Button variant="ghost" className="font-bold text-xs uppercase tracking-widest gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
