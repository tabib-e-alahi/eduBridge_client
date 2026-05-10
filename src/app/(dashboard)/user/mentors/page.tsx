"use client";

import { useState } from "react";
import { 
  Users, 
  MessageCircle, 
  Calendar, 
  Star, 
  Clock, 
  Search, 
  Filter 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useMentors, Mentor } from "@/hooks/useStudentData";
import { Loading } from "@/components/shared/Loading";
import { ErrorState } from "@/components/shared/ErrorState";
import { PageHeader } from "@/components/dashboard/PageHeader";

export default function MentorsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading, isError, refetch } = useMentors();

  if (isLoading) return <Loading />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;

  const mentors: Mentor[] = data?.data || [];

  const filteredMentors = mentors.filter(m => 
    m.user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.expertise.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader 
        title="Mentors" 
        subtitle="Connect with industry experts for guidance and code reviews."
      />

      <div className="saas-card p-0 overflow-hidden border-none shadow-xl bg-gradient-to-br from-primary to-blue-600 text-primary-foreground relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center justify-between">
          <div className="space-y-4 max-w-xl">
            <h2 className="text-2xl md:text-3xl font-black leading-tight">Need Help with Your Project?</h2>
            <p className="text-primary-foreground/80 font-medium">
              Book a 1-on-1 session with a mentor to get unblocked, review your code, or discuss your career path.
            </p>
          </div>
          <Button className="h-14 px-8 rounded-xl bg-white text-primary hover:bg-white/90 font-black text-base shadow-lg w-full md:w-auto shrink-0">
            Find a Mentor
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name or skill..." 
            className="pl-9 h-11 rounded-[0.625rem] bg-card shadow-sm border-muted"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-11 rounded-[0.625rem] font-bold gap-2 bg-card shadow-sm">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMentors.map((mentor) => (
          <div key={mentor.id} className="saas-card p-0 overflow-hidden flex flex-col group hover:border-primary/30 transition-colors">
            <div className="p-6 pb-0 flex gap-4 items-start">
              <Avatar className="h-16 w-16 border-2 border-background shadow-md">
                <AvatarImage src={mentor.user.image || ''} />
                <AvatarFallback className="bg-primary/10 text-primary font-black text-xl">
                  {mentor.user.name?.split(' ').map(n => n[0]).join('') || '?'}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1 pt-1">
                <h3 className="font-black text-lg leading-tight group-hover:text-primary transition-colors">{mentor.user.name}</h3>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{mentor.experienceYears}+ years experience</p>
                <div className="flex items-center gap-2 pt-1 text-sm font-medium text-muted-foreground">
                  <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                  <span className="font-bold text-foreground">{mentor.averageRating.toFixed(1)}</span>
                  <span>({mentor.totalStudents} students)</span>
                </div>
              </div>
            </div>
            
            <div className="p-6 space-y-4 flex-1">
              <div className="flex flex-wrap gap-2">
                {mentor.expertise.map((skill, i) => (
                  <Badge key={i} variant="secondary" className="bg-muted/50 hover:bg-muted font-semibold border-none text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
              
              <p className="text-sm text-muted-foreground line-clamp-2">{mentor.bio}</p>
            </div>
            
            <div className="p-4 bg-muted/10 border-t flex gap-3">
              <Link href={`/user/messages?user=${mentor.userId}`} className="flex-1">
                <Button variant="outline" className="w-full h-10 rounded-[0.625rem] font-bold gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Message
                </Button>
              </Link>
              <Button className="flex-1 h-10 rounded-[0.625rem] font-bold gap-2 shadow-md">
                <Calendar className="h-4 w-4" />
                Book Session
              </Button>
            </div>
          </div>
        ))}
        {filteredMentors.length === 0 && (
          <div className="col-span-full p-12 text-center text-muted-foreground flex flex-col items-center saas-card bg-transparent border-dashed">
            <Users className="h-10 w-10 opacity-20 mb-3" />
            <p className="font-bold">No mentors found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
