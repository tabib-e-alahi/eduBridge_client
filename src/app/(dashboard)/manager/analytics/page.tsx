"use client";

import { useInstructorDashboard } from "@/hooks/useDashboard";
import { Loading } from "@/components/shared/Loading";
import { ErrorState } from "@/components/shared/ErrorState";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import { 
  TrendingUp, 
  Users, 
  BookOpen, 
  DollarSign,
  Download,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function InstructorAnalyticsPage() {
  const { data, isLoading, isError, refetch } = useInstructorDashboard();

  if (isLoading) return <Loading />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;

  const { courses, stats } = data?.data || {};

  const COLORS = [
    'var(--chart-1)', 
    'var(--chart-2)', 
    'var(--chart-3)', 
    'var(--chart-4)', 
    'var(--chart-5)'
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Performance Analytics</h1>
          <p className="text-muted-foreground">Deep dive into your course sales, engagement, and student growth.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" /> This Year
           </Button>
           <Button className="gap-2">
              <Download className="h-4 w-4" /> Export CSV
           </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
         <Card className="border-none shadow-sm bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
               <CardTitle className="text-sm font-medium">Estimated Revenue</CardTitle>
               <DollarSign className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">$12,450</div>
               <div className="flex items-center text-xs text-emerald-500 mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" /> +12% from last month
               </div>
            </CardContent>
         </Card>
         <Card className="border-none shadow-sm bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
               <CardTitle className="text-sm font-medium">Active Students</CardTitle>
               <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">{stats?.totalStudents || 0}</div>
               <p className="text-xs text-muted-foreground">Across {stats?.totalCourses} courses</p>
            </CardContent>
         </Card>
         <Card className="border-none shadow-sm bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
               <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
               <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">78%</div>
               <p className="text-xs text-muted-foreground">Industry avg is 62%</p>
            </CardContent>
         </Card>
         <Card className="border-none shadow-sm bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
               <CardTitle className="text-sm font-medium">Course Watch Time</CardTitle>
               <BookOpen className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">1,240h</div>
               <p className="text-xs text-muted-foreground">Total across all lessons</p>
            </CardContent>
         </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
         {/* Enrollment Trends */}
         <Card className="lg:col-span-2 border-none shadow-sm bg-card">
            <CardHeader>
               <CardTitle className="text-lg">Student Enrollment Trends</CardTitle>
               <CardDescription>Visualizing your growth over time.</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[
                    { month: 'Jan', count: 45 },
                    { month: 'Feb', count: 52 },
                    { month: 'Mar', count: 85 },
                    { month: 'Apr', count: 65 },
                    { month: 'May', count: 120 },
                  ]}>
                     <defs>
                        <linearGradient id="colorEnroll" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                     <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                     <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                     <Tooltip 
                        contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '12px' }}
                     />
                     <Area type="monotone" dataKey="count" stroke="var(--chart-1)" fillOpacity={1} fill="url(#colorEnroll)" strokeWidth={3} />
                  </AreaChart>
               </ResponsiveContainer>
            </CardContent>
         </Card>

         {/* Course Comparison */}
         <Card className="border-none shadow-sm bg-card">
            <CardHeader>
               <CardTitle className="text-lg">Course Comparison</CardTitle>
               <CardDescription>Enrollments per course.</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={courses?.slice(0, 5)} layout="vertical">
                     <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                     <XAxis type="number" hide />
                     <YAxis 
                        type="category" 
                        dataKey="title" 
                        stroke="var(--muted-foreground)" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false} 
                        width={100}
                        tickFormatter={(val) => val.length > 15 ? val.substring(0, 15) + '...' : val}
                     />
                     <Tooltip 
                        contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '12px' }}
                     />
                     <Bar dataKey="_count.enrollments" radius={[0, 4, 4, 0]}>
                        {courses?.map((entry: any, index: number) => (
                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                     </Bar>
                  </BarChart>
               </ResponsiveContainer>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
