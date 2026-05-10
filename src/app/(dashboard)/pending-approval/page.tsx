"use client";

import { useAuth } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  ShieldCheck, 
  FileSearch, 
  Mail, 
  ArrowLeft,
  LogOut,
  Command,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function PendingApprovalPage() {
  const { data: session } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500 rounded-full blur-[120px]" />
         <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-2xl space-y-10 relative z-10 text-center">
        <div className="flex flex-col items-center space-y-6">
           <div className="h-20 w-20 rounded-3xl bg-amber-500/10 flex items-center justify-center text-amber-600 shadow-sm animate-pulse">
              <Clock className="h-10 w-10" />
           </div>
           <div className="space-y-2">
              <h1 className="text-4xl font-black tracking-tight">Studio Access Pending.</h1>
              <p className="text-muted-foreground font-medium text-lg max-w-lg mx-auto">
                Welcome, <span className="text-foreground font-bold">{session?.user?.name}</span>. Your instructor application is currently being reviewed by our academic board.
              </p>
           </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
           <div className="saas-card bg-card border-muted-foreground/10 p-6 space-y-4 text-left">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                 <FileSearch className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                 <h3 className="font-black text-sm">Under Review</h3>
                 <p className="text-xs text-muted-foreground font-medium">Verification of credentials and professional background.</p>
              </div>
           </div>
           <div className="saas-card bg-card border-muted-foreground/10 p-6 space-y-4 text-left">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                 <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                 <h3 className="font-black text-sm">Quality Audit</h3>
                 <p className="text-xs text-muted-foreground font-medium">Ensuring alignment with EduBridge teaching standards.</p>
              </div>
           </div>
           <div className="saas-card bg-card border-muted-foreground/10 p-6 space-y-4 text-left">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                 <Mail className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                 <h3 className="font-black text-sm">Final Decision</h3>
                 <p className="text-xs text-muted-foreground font-medium">You will receive an official notification via email.</p>
              </div>
           </div>
        </div>

        <div className="bg-muted/30 rounded-[1rem] p-6 border border-muted-foreground/10 flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="flex items-center gap-4 text-left">
              <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                 <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                 <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Verification status</p>
                 <p className="text-sm font-bold">Email Verified Successfully</p>
              </div>
           </div>
           <div className="flex gap-3">
              <Button variant="outline" className="font-black rounded-[0.75rem] h-11 gap-2" onClick={handleLogout}>
                 <LogOut className="h-4 w-4" /> Sign Out
              </Button>
              <Button className="font-black rounded-[0.75rem] h-11 gap-2 shadow-lg shadow-primary/20">
                 Contact Support
              </Button>
           </div>
        </div>

        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
           Average review time: 24-48 business hours
        </p>
      </div>
    </div>
  );
}
