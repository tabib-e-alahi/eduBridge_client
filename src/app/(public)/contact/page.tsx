"use client";

import { useState } from "react";
import { 
  Mail, 
  MessageSquare, 
  MapPin, 
  Send, 
  CheckCircle2, 
  Clock,
  ExternalLink,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import api from "@/lib/axios";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    try {
      await api.post("/support/ticket", data);
      setSuccess(true);
      toast.success("Support ticket created successfully!");
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      title: "Email Support",
      value: "support@edubridge.ai",
      description: "Our team will respond within 24 hours.",
      icon: Mail,
      action: "mailto:support@edubridge.ai"
    },
    {
      title: "Help Center",
      value: "docs.edubridge.ai",
      description: "Explore our documentation and tutorials.",
      icon: ExternalLink,
      action: "https://docs.edubridge.ai"
    },
    {
      title: "Global Headquarters",
      value: "San Francisco, CA",
      description: "Innovation Hub, Silicon Valley.",
      icon: MapPin,
      action: "#"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-[#FDFCF8] dark:bg-[#262626] border-b border-border relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl space-y-6 text-center mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Contact <span className="text-primary">Support</span></h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have questions or need assistance? Our support team is available 24/7 to ensure your learning journey is seamless.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div className="lg:col-span-7">
               <div className="saas-card p-8 md:p-10 rounded-[0.625rem]">
                  {!success ? (
                    <>
                      <div className="space-y-2 mb-8">
                        <h2 className="text-2xl font-extrabold tracking-tight">Send a message</h2>
                        <p className="text-muted-foreground text-sm">Fill out the form below and we'll get back to you as soon as possible.</p>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name</Label>
                            <Input id="name" name="name" placeholder="John Doe" required className="h-12 rounded-[0.625rem] bg-background border-border shadow-sm focus-visible:ring-primary font-medium" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address</Label>
                            <Input id="email" name="email" type="email" placeholder="john@example.com" required className="h-12 rounded-[0.625rem] bg-background border-border shadow-sm focus-visible:ring-primary font-medium" />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="subject" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Subject</Label>
                          <Input id="subject" name="subject" placeholder="What can we help you with?" required className="h-12 rounded-[0.625rem] bg-background border-border shadow-sm focus-visible:ring-primary font-medium" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Message</Label>
                          <Textarea id="message" name="message" placeholder="Describe your inquiry in detail..." required className="min-h-[150px] rounded-[0.625rem] bg-background border-border shadow-sm focus-visible:ring-primary font-medium resize-none" />
                        </div>

                        <Button type="submit" disabled={loading} className="w-full h-12 rounded-[0.625rem] font-bold gap-2 text-base">
                          {loading ? "Sending..." : (
                            <>
                              Send Message <Send className="h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </form>
                    </>
                  ) : (
                    <div className="py-16 text-center space-y-6">
                       <div className="h-20 w-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-emerald-500">
                          <CheckCircle2 className="h-10 w-10" />
                       </div>
                       <div className="space-y-2">
                          <h2 className="text-3xl font-extrabold tracking-tight">Message Sent!</h2>
                          <p className="text-muted-foreground max-w-sm mx-auto">Thank you for reaching out. We have received your ticket and will get back to you within 24 hours.</p>
                       </div>
                       <Button variant="outline" className="h-12 px-8 rounded-[0.625rem] font-bold mt-4" onClick={() => setSuccess(false)}>Send another message</Button>
                    </div>
                  )}
               </div>
            </div>

            {/* Sidebar info */}
            <div className="lg:col-span-5 space-y-8">
               <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-xl font-extrabold tracking-tight">Contact Information</h3>
                    <p className="text-muted-foreground text-sm">Choose the most convenient way to connect with us.</p>
                  </div>
                  
                  <div className="space-y-4">
                    {contactInfo.map((info, i) => (
                      <a 
                        key={i} 
                        href={info.action} 
                        target={info.action.startsWith("http") ? "_blank" : undefined}
                        className="flex items-start gap-4 p-5 rounded-[0.625rem] saas-card transition-all group hover:border-primary/50"
                      >
                         <div className="h-10 w-10 rounded-[0.625rem] bg-primary/10 flex items-center justify-center text-primary">
                            <info.icon className="h-5 w-5" />
                         </div>
                         <div className="flex-1 space-y-1">
                            <h4 className="font-bold">{info.title}</h4>
                            <p className="text-primary font-bold text-sm">{info.value}</p>
                            <p className="text-xs text-muted-foreground">{info.description}</p>
                         </div>
                      </a>
                    ))}
                  </div>
               </div>

               <div className="p-6 rounded-[0.625rem] bg-muted/50 border border-border space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-md bg-background border shadow-sm flex items-center justify-center text-muted-foreground">
                      <Clock className="h-4 w-4" />
                    </div>
                    <h4 className="font-bold">Operating Hours</h4>
                  </div>
                  <div className="space-y-3 text-sm">
                     <div className="flex justify-between items-center pb-2 border-b border-border">
                        <span className="text-muted-foreground">Support Tickets</span>
                        <span className="font-bold text-primary">24 / 7 / 365</span>
                     </div>
                     <div className="flex justify-between items-center pb-2 border-b border-border">
                        <span className="text-muted-foreground">Live Chat</span>
                        <span className="font-semibold">9:00 AM - 6:00 PM (EST)</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Mentor Sessions</span>
                        <span className="font-semibold">Scheduled basis</span>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
