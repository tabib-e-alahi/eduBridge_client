"use client";

import { useInstructorDashboard } from "@/hooks/useInstructorData";
import { Loading } from "@/components/shared/Loading";
import { ErrorState } from "@/components/shared/ErrorState";
import {
  Users,
  Star,
  MessageSquare,
  Plus,
  ArrowRight,
  DollarSign,
  TrendingUp,
  Award,
  MoreVertical,
  ArrowUpRight
} from "lucide-react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  AreaChart,
  Cell
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { cn } from "@/lib/utils";

export default function InstructorDashboardPage() {
  const { data: dashboardData, isLoading, isError, refetch } = useInstructorDashboard();

  if (isLoading) return <Loading />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;

  const { stats, courses, recentEnrollments, recentReviews, charts } = dashboardData?.data || {};
  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <PageHeader 
        title="Studio" 
        subtitle="Your high-impact educational command center."
        actions={
          <>
            <Button variant="outline" className="font-bold h-10 px-4 rounded-lg">
               Export Data
            </Button>
            <Link href="/manager/courses/create">
              <Button className="font-bold h-10 px-6 rounded-lg gap-2">
                  <Plus className="h-4 w-4" /> Create Course
              </Button>
            </Link>
          </>
        }
      />

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Revenue", value: `$${stats?.totalRevenue?.toLocaleString() || '0'}`, icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10", trend: "+12.5%" },
          { label: "Active Students", value: stats?.totalStudents || 0, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10", trend: "+5.2%" },
          { label: "Avg. Rating", value: stats?.avgRating || 0, icon: Star, color: "text-amber-500", bg: "bg-amber-500/10", trend: "Stable" },
          { label: "Total Reviews", value: stats?.totalReviews || 0, icon: MessageSquare, color: "text-purple-500", bg: "bg-purple-500/10", trend: "+8.1%" },
        ].map((stat, i) => (
          <div key={i} className="saas-card group relative overflow-hidden border shadow-sm">
             <div className="flex justify-between items-start mb-4">
                <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", stat.bg)}>
                   <stat.icon className={cn("h-6 w-6", stat.color)} />
                </div>
                <Badge variant="outline" className="font-bold text-[10px] uppercase tracking-widest border-none bg-muted/50">
                  {stat.trend}
                </Badge>
             </div>
             <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-2">{stat.label}</p>
                <p className="text-3xl font-black tracking-tight">{stat.value}</p>
             </div>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Enrollment Trend */}
        <div className="lg:col-span-8 saas-card p-0 flex flex-col border shadow-sm h-full">
           <div className="p-6 border-b flex items-center justify-between bg-muted/5">
              <div>
                 <h2 className="text-xl font-black flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" /> Enrollment Velocity
                 </h2>
                 <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Institutional Growth Data</p>
              </div>
           </div>
           <div className="p-6 h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={charts?.monthlyEnrollments}>
                  <defs>
                    <linearGradient id="colorEnroll" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.3} />
                  <XAxis dataKey="month" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} />
                  <YAxis fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} />
                  <Tooltip 
                     contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }}
                  />
                  <Area type="monotone" dataKey="count" stroke="var(--primary)" strokeWidth={4} fill="url(#colorEnroll)" />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Rating Distribution */}
        <div className="lg:col-span-4 saas-card p-0 flex flex-col border shadow-sm h-full">
           <div className="p-6 border-b bg-muted/5">
              <h2 className="text-xl font-black flex items-center gap-2">
                 <Star className="h-5 w-5 text-amber-500" /> Reputation
              </h2>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Sentiment Analysis</p>
           </div>
           <div className="p-6 h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={charts?.ratingDistribution} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} width={60} />
                    <Tooltip 
                       contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }}
                    />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                       {charts?.ratingDistribution?.map((entry: any, index: number) => (
                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                       ))}
                    </Bar>
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
         {/* Course Completion Rates */}
         <div className="lg:col-span-4 saas-card p-0 border shadow-sm flex flex-col">
            <div className="p-6 border-b bg-muted/5">
               <h2 className="text-xl font-black flex items-center gap-2">
                  <Award className="h-5 w-5 text-emerald-500" /> Graduation Rate
               </h2>
               <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Student Success Metrics</p>
            </div>
            <div className="p-6 h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts?.completionRates}>
                     <XAxis dataKey="name" fontSize={8} fontWeight="bold" axisLine={false} tickLine={false} />
                     <YAxis fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                     <Tooltip />
                     <Bar dataKey="rate" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Course Performance Table */}
         <div className="lg:col-span-8 saas-card p-0 border shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b flex items-center justify-between bg-muted/5">
               <h2 className="text-xl font-black">Curriculum Analytics</h2>
               <Link href="/manager/courses">
                  <Button variant="ghost" size="sm" className="font-bold text-xs">View All</Button>
               </Link>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead className="bg-muted/30 border-b text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                     <tr>
                        <th className="px-6 py-4">Title</th>
                        <th className="px-6 py-4">Enrollment</th>
                        <th className="px-6 py-4">Avg Rating</th>
                        <th className="px-6 py-4 text-right">Performance</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-muted-foreground/10">
                     {courses?.slice(0, 5).map((course: any) => (
                        <tr key={course.id} className="group hover:bg-muted/10 transition-colors">
                           <td className="px-6 py-4">
                              <p className="text-sm font-black truncate max-w-[200px] group-hover:text-primary transition-colors">{course.title}</p>
                           </td>
                           <td className="px-6 py-4">
                              <Badge variant="secondary" className="font-black text-xs">{course._count.enrollments}</Badge>
                           </td>
                           <td className="px-6 py-4">
                              <div className="flex items-center gap-1 font-black text-sm text-amber-500">
                                 <Star className="h-3.5 w-3.5 fill-current" />
                                 {course.reviews?.length > 0 ? (course.reviews.reduce((s:any, r:any)=>s+r.rating,0)/course.reviews.length).toFixed(1) : "0.0"}
                              </div>
                           </td>
                           <td className="px-6 py-4 text-right">
                              <div className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-600">
                                 <TrendingUp className="h-3 w-3" />
                                 High
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
    </div>
  );
}
