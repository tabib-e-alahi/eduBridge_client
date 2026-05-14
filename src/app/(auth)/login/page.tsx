"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  Building2,
  Command,
  Star
} from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/user"
      });

      if (error) {
        toast.error(error.message || "Failed to sign in");
        return;
      }

      toast.success("Welcome back to EduBridge!");
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
        callbackURL: "/user"
      });
    } catch (err) {
      toast.error(`Failed to sign in with ${provider}`);
    }
  };

  const handleDemoLogin = async (role: "student" | "instructor" | "admin") => {
    const demoCredentials = {
      student: { email: "student1@gmail.com", password: "Student@123" },
      instructor: { email: "john.doe@instructor.com", password: "Instructor@123" },
      admin: { email: "admin@edubridge.ai", password: "Admin@123" },
    };

    const { email, password } = demoCredentials[role];
    setIsLoading(true);

    try {
      await authClient.signIn.email({
        email,
        password,
        callbackURL: role === "student" ? "/user" : role === "instructor" ? "/manager" : "/admin"
      });
      toast.success(`Logged in as ${role} demo account`);
    } catch (err) {
      toast.error("Demo login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Column: Form */}
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
            <h1 className="text-3xl font-black tracking-tight">Welcome Back.</h1>
            <p className="text-muted-foreground font-medium">Continue your professional growth journey.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
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
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Secure Password</Label>
              </div>
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

            <Button type="submit" className="w-full h-12 rounded-[0.75rem] font-black text-sm gap-2 shadow-lg shadow-primary/20" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in to Dashboard"} <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
              <span className="bg-background px-4 text-muted-foreground">Or access via</span>
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

          <div className="relative pt-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4 text-center">Quick Access Demos</p>
            <div className="flex flex-wrap justify-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="rounded-full h-8 px-4 text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-none"
                onClick={() => handleDemoLogin("student")}
              >
                <GraduationCap className="h-3 w-3 mr-1.5" /> Student Demo
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="rounded-full h-8 px-4 text-[9px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-none"
                onClick={() => handleDemoLogin("instructor")}
              >
                <Building2 className="h-3 w-3 mr-1.5" /> Instructor Demo
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="rounded-full h-8 px-4 text-[9px] font-black uppercase tracking-widest bg-primary/10 text-primary hover:bg-primary/20 border-none"
                onClick={() => handleDemoLogin("admin")}
              >
                <ShieldCheck className="h-3 w-3 mr-1.5" /> Admin Demo
              </Button>
            </div>
          </div>

          <p className="text-center text-sm font-medium text-muted-foreground pt-4">
            New to the platform?{" "}
            <Link href="/register" className="text-primary font-black hover:underline underline-offset-4">
              Create an Account
            </Link>
          </p>
        </div>
      </div>

      {/* Right Column: High-fidelity Visual */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-primary relative overflow-hidden group">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-20 transition-transform duration-1000 group-hover:scale-110" />
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
              <Sparkles className="h-3 w-3" /> Industry Leading Standards
            </div>
            <h2 className="text-5xl font-black text-white leading-tight">
              Master the arts of modern tech.
            </h2>
            <p className="text-primary-foreground/80 text-lg font-medium">
              Join 50,000+ professionals learning the most in-demand skills from world-class instructors.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 pb-12 border-b border-white/10">
            <div className="space-y-2">
              <p className="text-3xl font-black text-white">98%</p>
              <p className="text-xs font-bold text-primary-foreground/60 uppercase tracking-widest">Career Success Rate</p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-black text-white">2.4M</p>
              <p className="text-xs font-bold text-primary-foreground/60 uppercase tracking-widest">Lessons Completed</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <Avatar key={i} className="border-4 border-primary h-12 w-12">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              ))}
              <div className="h-12 w-12 rounded-full border-4 border-primary bg-white/10 backdrop-blur-sm flex items-center justify-center text-[10px] font-black text-white">
                +12k
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <span className="text-sm font-black text-white">4.9/5.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
