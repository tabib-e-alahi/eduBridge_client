"use client";

import { useUserDashboard } from "@/hooks/useDashboard";
import { Loading } from "@/components/shared/Loading";
import { ErrorState } from "@/components/shared/ErrorState";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  BookOpen, 
  PlayCircle,
  Clock,
  LayoutGrid,
  Filter,
  CheckCircle2,
  Trophy
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { Enrollment } from "@/types";

export default function MyCoursesPage() {
  const { data, isLoading, isError, refetch } = useUserDashboard();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const enrollments: Enrollment[] = data?.data?.enrolledCourses || [];
  
  const filtered = useMemo(() => {
    return enrollments.filter((e) => {
      const matchesSearch = e.course.title.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchesSearch) return false;
      
      if (activeTab === "active") return e.progress > 0 && e.progress < 100;
      if (activeTab === "completed") return e.progress === 100;
      return true;
    });
  }, [enrollments, searchTerm, activeTab]);

  if (isLoading) return <Loading />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Area */}
      <PageHeader 
        title="My Courses" 
        subtitle="Manage your enrolled programs and track your progress."
        actions={
          <>
            <Button variant="outline" className="font-semibold h-10 px-4">Download Certificates</Button>
            <Link href="/courses">
               <Button className="font-semibold h-10 px-6">Explore Academy</Button>
            </Link>
          </>
        }
      />

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Enrolled" 
          value={enrollments.length} 
          subtitle="Programs joined" 
          icon={BookOpen} 
          variant="blue" 
        />
        <StatCard 
          title="In Progress" 
          value={enrollments.filter(e => e.progress > 0 && e.progress < 100).length} 
          subtitle="Currently learning" 
          icon={PlayCircle} 
          variant="amber" 
        />
        <StatCard 
          title="Completed" 
          value={enrollments.filter(e => e.progress === 100).length} 
          subtitle="Finished programs" 
          icon={CheckCircle2} 
          variant="emerald" 
        />
        <StatCard 
          title="Achievement" 
          value="4" 
          subtitle="Earned badges" 
          icon={Trophy} 
          variant="primary" 
        />
      </div>

      {/* Main Content Area */}
      <div className="space-y-6">
        <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <TabsList className="bg-muted/50 border border-border h-11 p-1 rounded-lg">
              <TabsTrigger value="all" className="px-5 h-full rounded-md data-[state=active]:bg-card data-[state=active]:shadow-sm font-semibold text-sm">All Courses</TabsTrigger>
              <TabsTrigger value="active" className="px-5 h-full rounded-md data-[state=active]:bg-card data-[state=active]:shadow-sm font-semibold text-sm">In Progress</TabsTrigger>
              <TabsTrigger value="completed" className="px-5 h-full rounded-md data-[state=active]:bg-card data-[state=active]:shadow-sm font-semibold text-sm">Completed</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-3 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search your courses..." 
                  className="pl-10 h-11 rounded-lg bg-card border-border shadow-sm focus-visible:ring-primary/20"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="h-11 w-11 p-0 rounded-lg shrink-0">
                 <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <TabsContent value={activeTab} className="mt-0">
            {!filtered.length ? (
               <div className="py-24 text-center space-y-4 lms-card bg-muted/20 border-dashed">
                  <div className="h-16 w-16 bg-card rounded-full flex items-center justify-center mx-auto border border-border">
                     <BookOpen className="h-8 w-8 text-muted-foreground/30" />
                  </div>
                  <div className="space-y-1">
                     <h3 className="font-bold text-lg">No courses found</h3>
                     <p className="text-muted-foreground text-sm max-w-xs mx-auto">Try adjusting your search or explore our full curriculum to start learning.</p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                     <Link href="/courses">Explore Catalog</Link>
                  </Button>
               </div>
            ) : (
               <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                 {filtered.map((enrollment) => (
                   <div key={enrollment.id} className="lms-card lms-card-hover group flex flex-col h-full">
                     {/* Thumbnail */}
                     <div className="relative h-48 w-full overflow-hidden rounded-t-[0.625rem]">
                        <Image 
                          src={enrollment.course.thumbnailUrl || "/no_image.jpg"} 
                          className="object-cover group-hover:scale-105 transition-transform duration-700" 
                          alt={enrollment.course.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute top-3 left-3 flex gap-2">
                           <Badge className="bg-white/90 text-foreground border-none text-[10px] font-bold uppercase backdrop-blur-md">
                             {enrollment.course.category.name}
                           </Badge>
                           {enrollment.progress === 100 && (
                             <Badge className="bg-emerald-500 text-white border-none text-[10px] font-bold uppercase">
                               Completed
                             </Badge>
                           )}
                        </div>
                     </div>
                     
                     {/* Content */}
                     <div className="p-5 flex flex-col flex-1 gap-5">
                        <div className="space-y-2">
                           <h3 className="font-bold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                             {enrollment.course.title}
                           </h3>
                           <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                              <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                 {enrollment.course.instructor?.name?.charAt(0)}
                              </div>
                              {enrollment.course.instructor?.name}
                           </div>
                        </div>

                        <div className="space-y-3 mt-auto">
                           <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                              <span className="text-muted-foreground">Progression</span>
                              <span className={enrollment.progress === 100 ? "text-emerald-600" : "text-primary"}>
                                {Math.round(enrollment.progress)}%
                              </span>
                           </div>
                           <Progress 
                             value={enrollment.progress} 
                             className={`h-1.5 ${enrollment.progress === 100 ? "[&>div]:bg-emerald-500" : ""}`} 
                           />
                           <div className="flex items-center justify-between pt-2">
                              <div className="flex items-center gap-3 text-muted-foreground">
                                 <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    <span className="text-[10px] font-bold uppercase">12h</span>
                                 </div>
                                 <div className="flex items-center gap-1">
                                    <LayoutGrid className="h-3 w-3" />
                                    <span className="text-[10px] font-bold uppercase">24 Lessons</span>
                                 </div>
                              </div>
                              <Link href={`/learn/${enrollment.course.slug}`}>
                                 <Button variant="ghost" size="sm" className="h-8 font-bold text-primary hover:text-primary hover:bg-primary/5">
                                    {enrollment.progress === 100 ? 'Review' : 'Continue'}
                                 </Button>
                              </Link>
                           </div>
                        </div>
                     </div>
                   </div>
                 ))}
               </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
