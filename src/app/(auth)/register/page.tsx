"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  GraduationCap, 
  Building2, 
  CheckCircle2,
  Command,
  ShieldCheck,
  Zap
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"STUDENT" | "INSTRUCTOR">("STUDENT");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await authClient.signUp.email({
        email,
        password,
        name,
        // @ts-ignore - Better Auth additional fields
        role,
        callbackURL: "/verify-email"
      });

      if (error) {
        toast.error(error.message || "Failed to create account");
        return;
      }

      toast.success("Account created! Please verify your email.");
      router.push("/verify-email");
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "facebook") => {
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: "/dashboard"
      });
    } catch (err) {
      toast.error(`Failed to sign in with ${provider}`);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Column: Register Form */}
      <div className="flex items-center justify-center p-8 bg-background relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
           <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-[120px]" />
           <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary rounded-full blur-[120px]" />
        </div>

        <div className="w-full max-w-md space-y-8 relative z-10">
          <div className="flex flex-col items-center space-y-2 mb-8">
             <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 mb-4">
                <Command className="h-7 w-7 text-white" />
             </div>
             <h1 className="text-3xl font-black tracking-tight">Create Account.</h1>
             <p className="text-muted-foreground font-medium">Start your journey with EduBridge AI today.</p>
          </div>

          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-4 p-1.5 bg-muted/50 rounded-[1rem] border border-muted-foreground/10">
             <button 
               type="button"
               className={cn(
                 "flex flex-col items-center gap-2 p-4 rounded-[0.75rem] transition-all",
                 role === 'STUDENT' ? "bg-background shadow-sm ring-1 ring-primary/20" : "hover:bg-background/50 text-muted-foreground"
               )}
               onClick={() => setRole("STUDENT")}
             >
                <GraduationCap className={cn("h-6 w-6", role === 'STUDENT' ? "text-primary" : "text-muted-foreground")} />
                <span className="text-[10px] font-black uppercase tracking-widest text-center">I&apos;m a Student</span>
             </button>
             <button 
               type="button"
               className={cn(
                 "flex flex-col items-center gap-2 p-4 rounded-[0.75rem] transition-all",
                 role === 'INSTRUCTOR' ? "bg-background shadow-sm ring-1 ring-primary/20" : "hover:bg-background/50 text-muted-foreground"
               )}
               onClick={() => setRole("INSTRUCTOR")}
             >
                <Building2 className={cn("h-6 w-6", role === 'INSTRUCTOR' ? "text-primary" : "text-muted-foreground")} />
                <span className="text-[10px] font-black uppercase tracking-widest text-center">I&apos;m an Instructor</span>
             </button>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Full Name</Label>
              <div className="relative">
                 <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                 <Input 
                   id="name" 
                   placeholder="John Doe" 
                   className="pl-10 h-12 rounded-[0.75rem] border-muted-foreground/20 bg-card/50" 
                   value={name}
                   onChange={(e) => setName(e.target.value)}
                   required
                 />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Professional Email</Label>
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
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Set Password</Label>
              <div className="relative">
                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                 <Input 
                   id="password" 
                   type="password" 
                   placeholder="••••••••" 
                   className="pl-10 h-12 rounded-[0.75rem] border-muted-foreground/20 bg-card/50" 
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   required
                 />
              </div>
            </div>

            <Button type="submit" className="w-full h-12 rounded-[0.75rem] font-black text-sm gap-2 shadow-lg shadow-primary/20 mt-4" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Create Account"} <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          {role === 'INSTRUCTOR' && (
             <div className="p-4 rounded-[0.75rem] bg-amber-500/5 border border-amber-500/10 flex gap-3 items-start">
                <ShieldCheck className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[11px] font-bold text-amber-800 leading-relaxed">
                   Note: Instructor accounts require administrative approval. After verification, you will gain access to the Manager Dashboard.
                </p>
             </div>
          )}

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
              <span className="bg-background px-4 text-muted-foreground">Or register with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-12 rounded-[0.75rem] font-bold border-muted-foreground/20 gap-2 hover:bg-muted/50" onClick={() => handleSocialLogin("google")}>
               <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
               </svg>
               Google
            </Button>
            <Button variant="outline" className="h-12 rounded-[0.75rem] font-bold border-muted-foreground/20 gap-2 hover:bg-muted/50 text-[#1877F2] hover:text-[#1877F2]" onClick={() => handleSocialLogin("facebook")}>
               <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
               </svg>
               Facebook
            </Button>
          </div>

          <p className="text-center text-sm font-medium text-muted-foreground pt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-black hover:underline underline-offset-4">
              Sign in Instead
            </Link>
          </p>
        </div>
      </div>

      {/* Right Column: High-fidelity Visual */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-primary relative overflow-hidden group">
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-20 transition-transform duration-1000 group-hover:scale-110" />
         <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" />
         
         <div className="relative z-10">
            <div className="flex items-center gap-2 text-white font-black text-xl tracking-tighter">
               <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center">
                  <Command className="h-5 w-5 text-primary" />
               </div>
               EduBridge AI
            </div>
         </div>

         <div className="relative z-10 space-y-8">
            <div className="space-y-4 max-w-lg">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-[10px] font-black uppercase tracking-widest text-white">
                  <Zap className="h-3 w-3" /> Unleash Your Potential
               </div>
               <h2 className="text-5xl font-black text-white leading-tight">
                  The future of learning is professional.
               </h2>
               <p className="text-primary-foreground/80 text-lg font-medium">
                  Gain access to exclusive modules, AI-powered paths, and a community of expert mentors.
               </p>
            </div>

            <div className="grid grid-cols-2 gap-6 pb-12 border-b border-white/10">
               <div className="space-y-2 flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0">
                     <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                     <p className="text-sm font-black text-white uppercase tracking-wider">Expert Led</p>
                     <p className="text-xs text-primary-foreground/60 font-bold uppercase tracking-widest">Real world projects</p>
                  </div>
               </div>
               <div className="space-y-2 flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0">
                     <Zap className="h-5 w-5" />
                  </div>
                  <div>
                     <p className="text-sm font-black text-white uppercase tracking-wider">AI Powered</p>
                     <p className="text-xs text-primary-foreground/60 font-bold uppercase tracking-widest">Personalized paths</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
