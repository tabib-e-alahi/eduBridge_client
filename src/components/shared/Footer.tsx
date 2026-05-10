import Link from "next/link";
import { Mail, BookOpen } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-10 md:gap-16">
          <div className="col-span-2 md:col-span-4 space-y-8">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BookOpen className="text-primary-foreground w-4 h-4" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-foreground">
                EduBridge<span className="text-[#1A8FE3]">AI</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              The world's leading AI-powered learning platform. Empowering students and instructors with intelligent tools for the future of education.
            </p>
            <div className="flex items-center gap-4">
              {[Mail, Mail, Mail].map((Icon, i) => (
                <Link key={i} href="#" className="h-9 w-9 rounded-[0.625rem] border border-border flex items-center justify-center text-muted-foreground hover:text-[#1A8FE3] hover:border-[#1A8FE3]/40 hover:bg-[#1A8FE3]/5 transition-all">
                  <Icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>

          <div className="col-span-1 md:col-span-2 space-y-6">
            <h3 className="text-sm font-bold text-foreground">Product</h3>
            <ul className="space-y-4">
              <li><Link href="/courses" className="text-muted-foreground hover:text-[#1A8FE3] text-sm transition-colors">Browse Courses</Link></li>
              <li><Link href="/mentors" className="text-muted-foreground hover:text-[#1A8FE3] text-sm transition-colors">Our Mentors</Link></li>
              <li><Link href="/ai-tutor" className="text-muted-foreground hover:text-[#1A8FE3] text-sm transition-colors">AI Learning Tutor</Link></li>
              <li><Link href="/pricing" className="text-muted-foreground hover:text-[#1A8FE3] text-sm transition-colors">Pricing Plans</Link></li>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2 space-y-6">
            <h3 className="text-sm font-bold text-foreground">Platform</h3>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-muted-foreground hover:text-[#1A8FE3] text-sm transition-colors">About Us</Link></li>
              <li><Link href="/blog" className="text-muted-foreground hover:text-[#1A8FE3] text-sm transition-colors">Engineering Blog</Link></li>
              <li><Link href="/careers" className="text-muted-foreground hover:text-[#1A8FE3] text-sm transition-colors">Careers</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-[#1A8FE3] text-sm transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2 space-y-6">
            <h3 className="text-sm font-bold text-foreground">Community</h3>
            <ul className="space-y-4">
              <li><Link href="/community" className="text-muted-foreground hover:text-[#1A8FE3] text-sm transition-colors">Forums</Link></li>
              <li><Link href="/partners" className="text-muted-foreground hover:text-[#1A8FE3] text-sm transition-colors">Partnerships</Link></li>
              <li><Link href="/events" className="text-muted-foreground hover:text-[#1A8FE3] text-sm transition-colors">Live Events</Link></li>
              <li><Link href="/referral" className="text-muted-foreground hover:text-[#1A8FE3] text-sm transition-colors">Refer a Friend</Link></li>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2 space-y-6">
            <h3 className="text-sm font-bold text-foreground">Legal</h3>
            <ul className="space-y-4">
              <li><Link href="/privacy" className="text-muted-foreground hover:text-[#1A8FE3] text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-muted-foreground hover:text-[#1A8FE3] text-sm transition-colors">Terms of Service</Link></li>
              <li><Link href="/cookies" className="text-muted-foreground hover:text-[#1A8FE3] text-sm transition-colors">Cookie Policy</Link></li>
              <li><Link href="/security" className="text-muted-foreground hover:text-[#1A8FE3] text-sm transition-colors">Security Hub</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-medium text-muted-foreground">
          <p>© {new Date().getFullYear()} EduBridge AI Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              All Systems Operational
            </span>
            <span>Version 2.8.4</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
