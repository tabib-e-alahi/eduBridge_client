"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Mail, 
  Camera, 
  Shield, 
  Bell, 
  Lock, 
  Loader2,
  CheckCircle2,
  Briefcase,
  Award,
  Fingerprint,
  AtSign,
  Globe,
  Trash2
} from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useUserProfile, useUpdateProfile } from "@/hooks/useStudentData";
import { Loading } from "@/components/shared/Loading";
import { ErrorState } from "@/components/shared/ErrorState";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { cn } from "@/lib/utils";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  bio: z.string().max(160, "Bio must be under 160 characters").optional(),
  headline: z.string().optional(),
});

export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState("personal");
  const { data, isLoading: profileLoading, isError, refetch } = useUserProfile();
  const updateProfile = useUpdateProfile();

  const user = data?.data;

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      bio: "",
      headline: "",
    },
    values: user ? {
      name: user.name || "",
      email: user.email || "",
      bio: user.profile?.bio || "",
      headline: user.profile?.headline || "",
    } : undefined,
  });

  async function onSubmit(values: z.infer<typeof profileSchema>) {
    updateProfile.mutate({
      name: values.name,
      bio: values.bio,
      headline: values.headline,
    });
  }

  if (profileLoading) return <Loading />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader 
        title="Account Settings" 
        subtitle="Manage your professional identity and account preferences."
      />

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-4">
           <nav className="space-y-1">
              {[
                 { id: "personal", label: "Personal Information", icon: User },
                 { id: "security", label: "Security & Login", icon: Lock },
                 { id: "notifications", label: "Notifications", icon: Bell },
                 { id: "billing", label: "Billing & Plans", icon: Briefcase },
                 { id: "certificates", label: "My Certificates", icon: Award },
              ].map((item) => (
                 <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={cn(
                       "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all",
                       activeSection === item.id 
                         ? "bg-primary/5 text-primary border border-primary/10" 
                         : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                 >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                 </button>
              ))}
           </nav>

           <div className="lms-card p-5 bg-muted/20 border-dashed space-y-3">
              <div className="flex items-center gap-2">
                 <Shield className="h-4 w-4 text-primary" />
                 <h3 className="text-xs font-bold uppercase tracking-widest">Privacy Policy</h3>
              </div>
              <p className="text-[10px] font-medium text-muted-foreground leading-relaxed">
                Your data is encrypted and managed according to global privacy standards.
              </p>
           </div>
        </div>

        {/* Form Content */}
        <div className="lg:col-span-9 space-y-6">
           {/* Avatar Section */}
           <div className="lms-card p-6 flex flex-col md:flex-row items-center gap-8">
              <div className="relative">
                 <Avatar className="h-24 w-24 border-2 border-border">
                    <AvatarImage src={user?.image || ''} />
                    <AvatarFallback className="text-2xl font-bold bg-primary/5 text-primary">{initials}</AvatarFallback>
                 </Avatar>
                 <Button size="icon" variant="outline" className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-card shadow-sm">
                    <Camera className="h-4 w-4" />
                 </Button>
              </div>
              <div className="flex-1 text-center md:text-left space-y-1">
                 <h3 className="text-lg font-bold">{user?.name}</h3>
                 <p className="text-sm text-muted-foreground font-medium flex items-center justify-center md:justify-start gap-1.5">
                    <AtSign className="h-3.5 w-3.5" />
                    {user?.email}
                 </p>
                 <div className="flex flex-wrap gap-2 pt-3 justify-center md:justify-start">
                    <Button size="sm" variant="outline" className="font-bold text-xs">Update Avatar</Button>
                    <Button size="sm" variant="ghost" className="font-bold text-xs text-destructive hover:text-destructive hover:bg-destructive/5">
                       <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                       Remove
                    </Button>
                 </div>
              </div>
           </div>

           {/* Personal Info Form */}
           <div className="lms-card overflow-hidden">
              <div className="p-6 border-b border-border bg-muted/20">
                 <h2 className="text-base font-bold">Personal Information</h2>
                 <p className="text-xs text-muted-foreground font-medium">Update your profile details and bio.</p>
              </div>
              <div className="p-8">
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                       <div className="grid md:grid-cols-2 gap-6">
                          <FormField
                             control={form.control}
                             name="name"
                             render={({ field }) => (
                               <FormItem className="space-y-1.5">
                                 <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Full Name</FormLabel>
                                 <FormControl>
                                   <Input className="h-11 rounded-lg bg-muted/20 border-border font-medium" {...field} />
                                 </FormControl>
                                 <FormMessage />
                               </FormItem>
                             )}
                          />
                          <FormField
                             control={form.control}
                             name="email"
                             render={({ field }) => (
                               <FormItem className="space-y-1.5">
                                 <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email Address</FormLabel>
                                 <FormControl>
                                   <Input className="h-11 rounded-lg bg-muted/20 border-border font-medium opacity-60 cursor-not-allowed" {...field} disabled />
                                 </FormControl>
                                 <FormMessage />
                               </FormItem>
                             )}
                          />
                       </div>

                       <FormField
                          control={form.control}
                          name="headline"
                          render={({ field }) => (
                            <FormItem className="space-y-1.5">
                              <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Professional Headline</FormLabel>
                              <FormControl>
                                 <Input className="h-11 rounded-lg bg-muted/20 border-border font-medium" placeholder="e.g. Software Engineer at SkillForge" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                       />

                       <FormField
                          control={form.control}
                          name="bio"
                          render={({ field }) => (
                            <FormItem className="space-y-1.5">
                              <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Biography</FormLabel>
                              <FormControl>
                                <Textarea className="min-h-[120px] rounded-lg bg-muted/20 border-border font-medium resize-none" placeholder="Tell us about your background and learning goals..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                       />

                       <div className="pt-4 border-t border-border flex justify-end gap-3">
                          <Button type="button" variant="ghost" className="font-bold h-10">Discard</Button>
                          <Button 
                            type="submit" 
                            className="font-bold h-10 px-8"
                            disabled={updateProfile.isPending}
                          >
                             {updateProfile.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                             Save Changes
                          </Button>
                       </div>
                    </form>
                 </Form>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
