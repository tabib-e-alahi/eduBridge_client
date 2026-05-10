"use client";

import { useState, useMemo } from "react";
import { 
  PlayCircle,
  Calendar as CalendarIcon,
  Clock,
  Video,
  Users,
  Search,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserLiveClasses, LiveClass } from "@/hooks/useStudentData";
import { Loading } from "@/components/shared/Loading";
import { ErrorState } from "@/components/shared/ErrorState";
import { PageHeader } from "@/components/dashboard/PageHeader";

function getClassStatus(cls: LiveClass): 'live' | 'upcoming' | 'recorded' {
  const now = new Date();
  const start = new Date(cls.startTime);
  const end = new Date(start.getTime() + cls.duration * 60000);
  
  if (now >= start && now <= end) return 'live';
  if (now < start) return 'upcoming';
  return 'recorded';
}

function formatRelativeTime(dateStr: string): string {
  const now = new Date();
  const target = new Date(dateStr);
  const diffMs = target.getTime() - now.getTime();
  const diffMins = Math.round(diffMs / 60000);

  if (diffMins < 0) return 'Ended';
  if (diffMins < 60) return `In ${diffMins} minutes`;
  if (diffMins < 1440) return `In ${Math.round(diffMins / 60)} hours`;
  return `In ${Math.round(diffMins / 1440)} days`;
}

export default function LiveClassesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading, isError, refetch } = useUserLiveClasses();

  if (isLoading) return <Loading />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;

  const rawClasses: LiveClass[] = data?.data || [];

  // Enrich with computed status
  const classes = rawClasses.map(cls => ({
    ...cls,
    status: getClassStatus(cls),
    courseName: cls.course?.title || 'Unknown Course',
    instructorName: cls.course?.instructor?.name || 'Instructor',
  }));

  const filteredClasses = classes.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.courseName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Find the next upcoming or live class for the banner
  const nextLiveOrUpcoming = classes.find(c => c.status === 'live') || classes.find(c => c.status === 'upcoming');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "live":
        return (
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-500">Live Now</span>
          </div>
        );
      case "upcoming":
        return <Badge variant="outline" className="border-blue-500 text-blue-500 font-bold uppercase text-[10px] bg-blue-500/5">Upcoming</Badge>;
      case "recorded":
        return <Badge variant="outline" className="border-muted-foreground text-muted-foreground font-bold uppercase text-[10px] bg-muted/30">Completed</Badge>;
      default:
        return null;
    }
  };

  const renderClassList = (statusFilter?: string) => {
     const list = statusFilter 
        ? filteredClasses.filter(c => c.status === statusFilter)
        : filteredClasses;

     if (list.length === 0) {
        return (
           <div className="p-16 text-center text-muted-foreground">
              <CalendarIcon className="h-10 w-10 mx-auto mb-4 opacity-20" />
              <p className="font-bold text-lg">No classes found.</p>
              <p className="text-sm">Try adjusting your filters or check back later.</p>
           </div>
        );
     }

     return (
        <div className="divide-y">
           {list.map((cls) => (
             <div key={cls.id} className="p-6 hover:bg-muted/10 transition-colors flex flex-col md:flex-row justify-between gap-6 md:items-center group">
               <div className="flex gap-5 items-start">
                 <div className={`h-12 w-12 rounded-[0.625rem] flex items-center justify-center shrink-0 ${
                   cls.status === 'live' ? 'bg-red-500/10 text-red-500' :
                   cls.status === 'upcoming' ? 'bg-blue-500/10 text-blue-500' :
                   'bg-muted text-muted-foreground'
                 }`}>
                   <Video className="h-6 w-6" />
                 </div>
                 <div className="space-y-1">
                   <div className="flex items-center gap-3 mb-1">
                     {getStatusBadge(cls.status)}
                   </div>
                   <h3 className="font-bold text-lg group-hover:text-primary transition-colors leading-tight">{cls.title}</h3>
                   <p className="text-sm font-medium text-muted-foreground">{cls.courseName} • {cls.instructorName}</p>
                 </div>
               </div>
               
               <div className="flex flex-col md:flex-row items-start md:items-center gap-6 w-full md:w-auto">
                 <div className="flex md:flex-col gap-4 md:gap-1 text-sm md:text-right">
                   <div className="flex items-center gap-1.5 font-bold text-foreground">
                     <CalendarIcon className="h-4 w-4 md:hidden text-muted-foreground" />
                     {new Date(cls.startTime).toLocaleDateString()}
                   </div>
                   <div className="flex items-center gap-1.5 font-medium text-muted-foreground">
                     <Clock className="h-4 w-4 md:hidden" />
                     {new Date(cls.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({cls.duration}m)
                   </div>
                 </div>
                 
                 {cls.status === "live" && (
                   <a href={cls.meetingUrl} target="_blank" rel="noopener noreferrer">
                     <Button className="w-full md:w-auto h-10 rounded-[0.625rem] font-bold bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 gap-2">
                       <ExternalLink className="h-4 w-4" /> Join Room
                     </Button>
                   </a>
                 )}
                 {cls.status === "upcoming" && (
                   <Button variant="outline" className="w-full md:w-auto h-10 rounded-[0.625rem] font-bold">
                     Add to Calendar
                   </Button>
                 )}
                 {cls.status === "recorded" && (
                   <Button variant="secondary" className="w-full md:w-auto h-10 rounded-[0.625rem] font-bold gap-2">
                     <PlayCircle className="h-4 w-4" />
                     Watch Recording
                   </Button>
                 )}
               </div>
             </div>
           ))}
        </div>
     );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader 
        title="Live Sessions" 
        subtitle="Join upcoming sessions or watch recorded lectures."
      />

      {/* Dynamic Banner — only shows if there's a live or upcoming class */}
      {nextLiveOrUpcoming && (
        <div className="saas-card p-0 overflow-hidden border-none shadow-xl bg-gradient-to-br from-primary to-blue-600 text-primary-foreground relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center justify-between">
            <div className="space-y-4 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-red-100">
                  {nextLiveOrUpcoming.status === 'live' ? 'Happening Now' : 'Starting Soon'}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black leading-tight">{nextLiveOrUpcoming.title}</h2>
              <div className="flex flex-wrap gap-4 text-sm font-medium text-primary-foreground/80">
                <span className="flex items-center gap-1.5"><CalendarIcon className="h-4 w-4" /> {new Date(nextLiveOrUpcoming.startTime).toLocaleDateString()}</span>
                <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {formatRelativeTime(nextLiveOrUpcoming.startTime)}</span>
              </div>
            </div>
            <a href={nextLiveOrUpcoming.meetingUrl} target="_blank" rel="noopener noreferrer">
              <Button className="h-14 px-8 rounded-xl bg-white text-primary hover:bg-white/90 font-black text-base shadow-lg w-full md:w-auto shrink-0">
                {nextLiveOrUpcoming.status === 'live' ? 'Join Room Now' : 'Set Reminder'}
              </Button>
            </a>
          </div>
        </div>
      )}

      <div className="saas-card p-0 overflow-hidden">
        <div className="p-6 border-b flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search classes..." 
              className="pl-9 h-10 rounded-[0.625rem] bg-muted/30"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <div className="px-6 pt-4 border-b">
            <TabsList className="bg-transparent h-10 p-0 space-x-6 overflow-x-auto overflow-y-hidden whitespace-nowrap flex w-full justify-start pb-4">
              <TabsTrigger value="all" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded- px-0 pb-3 font-bold">All Schedule</TabsTrigger>
              <TabsTrigger value="live" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3 font-bold">Live Now</TabsTrigger>
              <TabsTrigger value="upcoming" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3 font-bold">Upcoming</TabsTrigger>
              <TabsTrigger value="recorded" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3 font-bold">Completed</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="all" className="m-0">{renderClassList()}</TabsContent>
          <TabsContent value="live" className="m-0">{renderClassList('live')}</TabsContent>
          <TabsContent value="upcoming" className="m-0">{renderClassList('upcoming')}</TabsContent>
          <TabsContent value="recorded" className="m-0">{renderClassList('recorded')}</TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
