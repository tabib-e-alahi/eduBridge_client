"use client";

import { useState } from "react";
import { 
  Award, 
  Download, 
  Share2, 
  Lock, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { cn } from "@/lib/utils";

const MOCK_CERTIFICATES = [
  {
    id: "CERT-2026-8941",
    courseTitle: "Advanced React Patterns",
    dateEarned: "May 5, 2026",
    instructor: "David Chen",
    status: "earned",
    grade: "98%"
  },
  {
    id: "CERT-2026-4421",
    courseTitle: "Backend Masterclass: Node & Prisma",
    dateEarned: "March 12, 2026",
    instructor: "Sarah Jenkins",
    status: "earned",
    grade: "95%"
  },
  {
    id: "pending-1",
    courseTitle: "System Design Fundamentals",
    progress: 65,
    status: "locked"
  }
];

export default function CertificatesPage() {
  const earnedCerts = MOCK_CERTIFICATES.filter(c => c.status === "earned");
  const lockedCerts = MOCK_CERTIFICATES.filter(c => c.status === "locked");

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader 
        title="Certificates & Achievements" 
        subtitle="Verified credentials for your completed learning milestones."
      />

      {/* Hero Achievement Section */}
      <div className="lms-card p-0 overflow-hidden bg-foreground text-background dark:bg-card dark:text-foreground">
        <div className="p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          
          <div className="space-y-4 max-w-xl relative z-10 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Badge className="bg-emerald-500/20 text-emerald-400 border-none font-bold text-[10px] uppercase tracking-widest px-3 py-1">
                Verified Mastery
              </Badge>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">You've earned {earnedCerts.length} certificates!</h2>
            <p className="text-sm font-medium text-muted-foreground opacity-90 leading-relaxed">
              These industry-recognized credentials validate your technical proficiency and commitment to continuous learning. Share your success with your network.
            </p>
          </div>
          
          <div className="flex items-center gap-4 relative z-10">
             <div className="h-20 w-20 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                <Award className="h-10 w-10" />
             </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-6">
           <h2 className="text-lg font-bold flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              Earned Credentials
           </h2>
           
           <div className="space-y-4">
              {earnedCerts.map((cert) => (
                <div key={cert.id} className="lms-card p-0 overflow-hidden flex flex-col lms-card-hover group">
                   <div className="p-6 border-b border-border bg-muted/20 flex justify-between items-start gap-4">
                      <div className="space-y-1">
                         <h3 className="font-bold text-base leading-tight group-hover:text-primary transition-colors">{cert.courseTitle}</h3>
                         <p className="text-xs font-medium text-muted-foreground">Instructor: {cert.instructor}</p>
                      </div>
                      <Badge variant="outline" className="font-bold text-[10px] bg-card uppercase border-emerald-500/20 text-emerald-600">ID: {cert.id.slice(0, 8)}</Badge>
                   </div>
                   <div className="p-6 grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                         <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Date Issued</p>
                         <p className="font-bold text-xs">{cert.dateEarned}</p>
                      </div>
                      <div className="space-y-1">
                         <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Mastery Level</p>
                         <p className="font-bold text-emerald-600 text-xs">{cert.grade}</p>
                      </div>
                   </div>
                   <div className="p-4 bg-muted/10 border-t border-border flex gap-2">
                      <Button className="flex-1 h-9 font-bold text-xs" size="sm">
                         <Download className="h-3.5 w-3.5 mr-2" /> Download
                      </Button>
                      <Button variant="outline" className="flex-1 h-9 font-bold text-xs" size="sm">
                         <Share2 className="h-3.5 w-3.5 mr-2" /> Share
                      </Button>
                      <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 border border-border">
                         <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                   </div>
                </div>
              ))}
           </div>
        </div>

        <div className="space-y-6">
           <h2 className="text-lg font-bold flex items-center gap-2">
              <Lock className="h-5 w-5 text-muted-foreground" />
              Upcoming Milestones
           </h2>
           
           <div className="space-y-4">
              {lockedCerts.map((cert) => (
                <div key={cert.id} className="lms-card p-6 flex flex-col gap-4 opacity-75 grayscale-[20%]">
                   <div className="flex gap-4 items-start">
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0 border border-border">
                         <Lock className="h-5 w-5 text-muted-foreground/60" />
                      </div>
                      <div className="space-y-1 flex-1">
                         <h3 className="font-bold text-sm leading-tight">{cert.courseTitle}</h3>
                         <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Completion Required</p>
                      </div>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                         <ChevronRight className="h-4 w-4" />
                      </Button>
                   </div>
                   
                   <div className="space-y-2 pt-2">
                      <div className="flex justify-between text-[10px] font-bold uppercase text-muted-foreground tracking-widest">
                         <span>Requirement Progress</span>
                         <span>{cert.progress}%</span>
                      </div>
                      <Progress value={cert.progress} className="h-1.5" />
                   </div>
                </div>
              ))}
              
              <div className="lms-card p-6 bg-muted/20 border-dashed flex flex-col items-center justify-center text-center gap-3">
                 <div className="h-10 w-10 rounded-full bg-card flex items-center justify-center border border-border">
                    <Sparkles className="h-4 w-4 text-primary/40" />
                 </div>
                 <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
                    Complete your active courses to unlock more credentials
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
