"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, CheckCircle2, ArrowLeft, RefreshCw, Command } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function VerifyEmailPage() {
  const [isResending, setIsResending] = useState(false);

  const handleResend = () => {
    setIsResending(true);
    // Better auth resend logic would go here
    setTimeout(() => {
      setIsResending(false);
      toast.success("Verification email resent!");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-[120px]" />
         <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md space-y-8 relative z-10 text-center">
        <div className="flex flex-col items-center space-y-4">
           <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner mb-2 animate-bounce">
              <Mail className="h-8 w-8" />
           </div>
           <div className="space-y-1">
              <h1 className="text-3xl font-black tracking-tight">Verify Identity.</h1>
              <p className="text-muted-foreground font-medium max-w-xs mx-auto">We've sent a secure link to your professional email address.</p>
           </div>
        </div>

        <div className="saas-card bg-card border-muted-foreground/10 p-8 space-y-6">
           <div className="space-y-4 text-left">
              <div className="flex gap-3">
                 <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                 <p className="text-sm font-medium text-muted-foreground">Check your inbox for a verification email from EduBridge.</p>
              </div>
              <div className="flex gap-3">
                 <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                 <p className="text-sm font-medium text-muted-foreground">Click the link in the email to activate your account status.</p>
              </div>
           </div>

           <Button 
             className="w-full h-12 rounded-[0.75rem] font-black text-sm gap-2" 
             variant="outline"
             onClick={handleResend}
             disabled={isResending}
           >
              {isResending ? (
                 <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                 <RefreshCw className="h-4 w-4" />
              )}
              {isResending ? "Resending Link..." : "Resend Verification Link"}
           </Button>
        </div>

        <div className="space-y-4">
           <p className="text-sm font-medium text-muted-foreground">
              Already verified?{" "}
              <Link href="/login" className="text-primary font-black hover:underline">
                 Proceed to Login
              </Link>
           </p>
           <Button variant="ghost" className="font-bold text-xs uppercase tracking-widest gap-2">
              <Link href="/login">
                 <ArrowLeft className="h-4 w-4" /> Back to Sign in
              </Link>
           </Button>
        </div>
      </div>
    </div>
  );
}
