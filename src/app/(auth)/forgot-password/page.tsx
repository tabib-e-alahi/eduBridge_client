"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, ArrowRight, ShieldQuestion, Command } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await authClient.requestPasswordReset({
        email,
        redirectTo: "/reset-password"
      });

      if (error) {
        toast.error(error.message || "Failed to send reset link");
        return;
      }

      setIsSent(true);
      toast.success("Password reset link sent to your email!");
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-[120px]" />
         <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="flex flex-col items-center space-y-2 text-center mb-8">
           <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm mb-4">
              <ShieldQuestion className="h-7 w-7" />
           </div>
           <h1 className="text-3xl font-black tracking-tight">Recovery.</h1>
           <p className="text-muted-foreground font-medium">Enter your email and we&apos;ll send you a recovery link.</p>
        </div>

        {!isSent ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Account Email</Label>
              <div className="relative">
                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                 <Input 
                   id="email" 
                   type="email" 
                   placeholder="name@company.com" 
                   className="pl-10 h-12 rounded-[0.75rem] border-muted-foreground/20 bg-card/50" 
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   required
                 />
              </div>
            </div>

            <Button type="submit" className="w-full h-12 rounded-[0.75rem] font-black text-sm gap-2 shadow-lg shadow-primary/20" disabled={isLoading}>
              {isLoading ? "Processing..." : "Send Recovery Link"} <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        ) : (
          <div className="saas-card bg-card border-emerald-500/20 text-center space-y-4">
             <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 mx-auto">
                <Mail className="h-5 w-5" />
             </div>
             <div className="space-y-1">
                <h3 className="text-lg font-black">Link Dispatched</h3>
                <p className="text-sm text-muted-foreground font-medium">Please check your inbox for reset instructions.</p>
             </div>
             <Button variant="ghost" className="text-primary font-black text-[10px] uppercase tracking-widest" onClick={() => setIsSent(false)}>
                Resend Link
             </Button>
          </div>
        )}

        <div className="text-center pt-4">
           <Button variant="ghost" className="font-bold text-xs uppercase tracking-widest gap-2">
              <Link href="/login">
                 <ArrowLeft className="h-4 w-4" /> Return to Login
              </Link>
           </Button>
        </div>
      </div>
    </div>
  );
}
