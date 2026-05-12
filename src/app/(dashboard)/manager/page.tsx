"use client";

import { useInstructorDashboard } from "@/hooks/useInstructorData";
import { Loading } from "@/components/shared/Loading";
import { ErrorState } from "@/components/shared/ErrorState";
import {
  Users,
  Star,
  MessageSquare,
  Plus,
  TrendingUp,
  Award,
  ExternalLink
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
import { PageHeader } from "@/components/dashboard/PageHeader";
import { cn } from "@/lib/utils";

import { useAuth } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function InstructorDashboardPage() {
  const { data: session, isPending: isAuthLoading } = useAuth();
  const router = useRouter();
  const { data: dashboardData, isLoading, isError, refetch } = useInstructorDashboard();

  useEffect(() => {
    if (!isAuthLoading && !session) {
      router.push("/auth/login");
    } else if (session && !["INSTRUCTOR", "MANAGER", "ADMIN"].includes((session.user as any).role)) {
      router.push("/dashboard");
    }
  }, [session, isAuthLoading, router]);

  if (isLoading || isAuthLoading) return <Loading />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;

  const { stats, courses, recentEnrollments, recentReviews, charts } = dashboardData?.data || {};
  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];

  return (
    <div className="flex flex-col gap-8">
      
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Studio</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Overview of your performance and recent activity.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="text-sm font-medium">
            Export Data
          </Button>
          <Link href="/manager/courses/create">
            <Button className="text-sm font-medium gap-2">
              <Plus className="h-4 w-4" /> Create Course
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Revenue", value: `$${stats?.totalRevenue?.toLocaleString() || '0'}`, icon: TrendingUp, trend: "+12.5%", trendColor: "text-emerald-600" },
          { label: "Active Students", value: stats?.totalStudents || 0, icon: Users, trend: "+5.2%", trendColor: "text-emerald-600" },
          { label: "Avg. Rating", value: stats?.avgRating || 0, icon: Star, trend: "Stable", trendColor: "text-muted-foreground" },
          { label: "Total Reviews", value: stats?.totalReviews || 0, icon: MessageSquare, trend: "+8.1%", trendColor: "text-emerald-600" },
        ].map((stat, i) => (
          <div 
            key={i} 
            className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 transition-colors hover:border-border/80"
          >
            <div className="flex flex-row items-center justify-between pb-2">
              <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
              <span className={cn("text-xs font-medium", stat.trendColor)}>
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-12">
        
        {/* Enrollment Trend */}
        <div className="lg:col-span-8 rounded-xl border bg-card shadow-sm">
          <div className="p-6 pb-2">
            <h3 className="text-lg font-semibold">Enrollment Trends</h3>
            <p className="text-sm text-muted-foreground">Monthly student sign-ups over the last year.</p>
          </div>
          <div className="p-6 pt-2 h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts?.monthlyEnrollments}>
                <defs>
                  <linearGradient id="colorEnroll" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis 
                  dataKey="month" 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} 
                />
                <YAxis 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2} 
                  fill="url(#colorEnroll)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="lg:col-span-4 rounded-xl border bg-card shadow-sm">
          <div className="p-6 pb-2">
            <h3 className="text-lg font-semibold">Reputation</h3>
            <p className="text-sm text-muted-foreground">Distribution of student reviews.</p>
          </div>
          <div className="p-6 pt-2 h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts?.ratingDistribution} layout="vertical">
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} 
                  width={40} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))', 
                    borderRadius: '8px' 
                  }} 
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={12}>
                  {charts?.ratingDistribution?.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 lg:grid-cols-12">
        
         {/* Course Completion Rates */}
         <div className="lg:col-span-4 rounded-xl border bg-card shadow-sm">
            <div className="p-6 pb-2">
               <h3 className="text-lg font-semibold">Completion Rate</h3>
               <p className="text-sm text-muted-foreground">Student progress by course.</p>
            </div>
            <div className="p-6 pt-2 h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts?.completionRates}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                     <XAxis 
                       dataKey="name" 
                       tickLine={false} 
                       axisLine={false} 
                       tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} 
                     />
                     <YAxis 
                       tickLine={false} 
                       axisLine={false} 
                       tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} 
                     />
                     <Tooltip 
                       contentStyle={{ 
                         backgroundColor: 'hsl(var(--card))', 
                         border: '1px solid hsl(var(--border))', 
                         borderRadius: '8px' 
                       }} 
                     />
                     <Bar dataKey="rate" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} fillOpacity={0.8} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Course Performance Table */}
         <div className="lg:col-span-8 rounded-xl border bg-card shadow-sm">
            <div className="p-6 flex flex-row items-center justify-between">
               <div>
                 <h3 className="text-lg font-semibold">Course Performance</h3>
                 <p className="text-sm text-muted-foreground">Your top performing content.</p>
               </div>
               <Link href="/manager/courses" className="text-sm font-medium text-primary hover:underline underline-offset-4 flex items-center gap-1">
                 View All <ExternalLink className="h-3 w-3" />
               </Link>
            </div>
            <div className="border-t">
               <table className="w-full">
                  <thead>
                     <tr className="border-b bg-muted/30">
                        <th className="h-12 px-6 text-left align-middle text-xs font-medium text-muted-foreground">Course Name</th>
                        <th className="h-12 px-6 text-left align-middle text-xs font-medium text-muted-foreground">Enrollment</th>
                        <th className="h-12 px-6 text-left align-middle text-xs font-medium text-muted-foreground">Rating</th>
                        <th className="h-12 px-6 text-right align-middle text-xs font-medium text-muted-foreground">Status</th>
                     </tr>
                  </thead>
                  <tbody>
                     {courses?.slice(0, 5).map((course: any) => (
                        <tr key={course.id} className="border-b last:border-0 transition-colors hover:bg-muted/20">
                           <td className="p-6 align-middle">
                              <p className="text-sm font-medium truncate max-w-[200px]">{course.title}</p>
                           </td>
                           <td className="p-6 align-middle">
                              <span className="text-sm text-muted-foreground">{course._count.enrollments}</span>
                           </td>
                           <td className="p-6 align-middle">
                              <div className="flex items-center gap-1.5">
                                 <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                 <span className="text-sm font-medium">
                                    {course.reviews?.length > 0 ? (course.reviews.reduce((s:any, r:any)=>s+r.rating,0)/course.reviews.length).toFixed(1) : "0.0"}
                                 </span>
                              </div>
                           </td>
                           <td className="p-6 align-middle text-right">
                              <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                 Active
                              </Badge>
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