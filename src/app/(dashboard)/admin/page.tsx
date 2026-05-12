"use client";

import { useAdminDashboard } from "@/hooks/useDashboard";
import { Loading } from "@/components/shared/Loading";
import { ErrorState } from "@/components/shared/ErrorState";
import {
  Users,
  BookOpen,
  GraduationCap,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  PieChart as PieChartIcon,
  Activity
} from "lucide-react";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  AreaChart,
  Area,
  CartesianGrid,
  BarChart,
  Bar
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { User, Course } from "@/types";
import { cn } from "@/lib/utils";

export default function AdminDashboardPage() {
  const { data, isLoading, isError, refetch } = useAdminDashboard();

  if (isLoading) return <Loading />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;

  const { stats, charts, recentUsers, topCourses } = data?.data || {};

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <PageHeader 
        title="System" 
        subtitle="Centralized platform intelligence & global telemetry."
        actions={
          <>
            <Button variant="outline" className="font-bold h-10 px-4 rounded-lg">System Logs</Button>
            <Button className="font-bold h-10 px-6 rounded-lg">Platform Settings</Button>
          </>
        }
      />

      {/* Instructor Approval Alert (Conditional) */}
      {(stats?.pendingInstructors || 0) > 0 && (
         <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="flex items-center gap-5 text-left">
               <div className="h-14 w-14 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-600 shadow-sm">
                  <ShieldCheck className="h-7 w-7" />
               </div>
               <div>
                  <h3 className="text-xl font-black text-amber-900">Instructor Verification Required</h3>
                  <p className="text-amber-700/80 font-medium">There are <span className="font-bold underline">{stats?.pendingInstructors}</span> pending instructor applications awaiting board review.</p>
               </div>
            </div>
            <Link href="/admin/instructors">
               <Button className="bg-amber-600 hover:bg-amber-700 text-white font-black px-8 h-12 rounded-xl shadow-lg shadow-amber-600/20 flex gap-2">
                  Launch Approval Studio <ArrowUpRight className="h-4 w-4" />
               </Button>
            </Link>
         </div>
      )}

      {/* Analytics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        {[
          { label: "Total Users", value: stats?.totalUsers || 0, icon: Users, change: "+12%", up: true, color: "text-blue-600", bg: "bg-blue-500/10" },
          { label: "Platform Revenue", value: `$${(stats?.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, change: "+24%", up: true, color: "text-emerald-600", bg: "bg-emerald-500/10" },
          { label: "Total Courses", value: stats?.totalCourses || 0, icon: BookOpen, change: "+5%", up: true, color: "text-amber-600", bg: "bg-amber-500/10" },
          { label: "Enrollments", value: stats?.totalEnrollments || 0, icon: GraduationCap, change: "+18%", up: true, color: "text-purple-600", bg: "bg-purple-500/10" },
          { label: "AI Operations", value: stats?.totalAiLogs || 0, icon: Zap, change: "Optimized", up: true, color: "text-indigo-600", bg: "bg-indigo-500/10" },
        ].map((stat, i) => (
          <div key={i} className="saas-card flex flex-col gap-4 border shadow-sm group">
             <div className="flex justify-between items-start">
                <div className={cn("p-3 rounded-2xl transition-transform group-hover:scale-110", stat.bg)}>
                   <stat.icon className={cn("h-5 w-5", stat.color)} />
                </div>
                <div className={`flex items-center text-[10px] font-black ${stat.up ? 'text-emerald-500' : 'text-rose-500'} bg-muted/50 px-2 py-1 rounded-full`}>
                   {stat.up ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
                   {stat.change}
                </div>
             </div>
             <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1.5">{stat.label}</p>
                <p className="text-3xl font-black tracking-tight">{stat.value}</p>
             </div>
          </div>
        ))}
      </div>

      {/* Main Charts Area */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Revenue & Enrollment Combined */}
        <div className="lg:col-span-8 saas-card p-0 flex flex-col border shadow-sm h-full overflow-hidden">
           <div className="p-6 border-b flex items-center justify-between bg-muted/5">
              <div>
                 <h2 className="text-xl font-black flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" /> Growth Intelligence
                 </h2>
                 <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Enrollment Trends vs Time</p>
              </div>
           </div>
           <div className="p-8 h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={charts?.monthlyEnrollments}>
                  <defs>
                    <linearGradient id="colorEnrollAdmin" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.3} />
                  <XAxis dataKey="month" fontSize={10} fontWeight="black" tickLine={false} axisLine={false} />
                  <YAxis fontSize={10} fontWeight="black" tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="count" stroke="var(--primary)" fillOpacity={1} fill="url(#colorEnrollAdmin)" strokeWidth={4} />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* AI Feature Usage */}
        <div className="lg:col-span-4 saas-card p-0 flex flex-col border shadow-sm h-full overflow-hidden">
           <div className="p-6 border-b bg-muted/5">
              <h2 className="text-xl font-black flex items-center gap-2">
                 <Zap className="h-5 w-5 text-indigo-500" /> AI Distribution
              </h2>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Feature Engagement Metrics</p>
           </div>
           <div className="p-6 h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={charts?.aiUsage} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis dataKey="feature" type="category" fontSize={10} fontWeight="black" axisLine={false} tickLine={false} width={80} />
                    <Tooltip 
                       contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }}
                    />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                       {charts?.aiUsage?.map((entry: any, index: number) => (
                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                       ))}
                    </Bar>
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
         {/* Category Share */}
         <div className="lg:col-span-4 saas-card p-0 flex flex-col border shadow-sm h-full relative overflow-hidden">
            <div className="p-6 border-b bg-muted/5">
               <h2 className="text-xl font-black flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5 text-amber-500" /> Domain Focus
               </h2>
               <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Content Distribution</p>
            </div>
            <div className="flex-1 flex items-center justify-center relative min-h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={charts?.categoryDistribution}
                     cx="50%"
                     cy="50%"
                     innerRadius={70}
                     outerRadius={100}
                     paddingAngle={8}
                     dataKey="count"
                     strokeWidth={0}
                   >
                     {charts?.categoryDistribution?.map((entry: any, index: number) => (
                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                     ))}
                   </Pie>
                   <Tooltip />
                 </PieChart>
               </ResponsiveContainer>
               <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-4xl font-black tracking-tighter">{stats?.totalCourses}</span>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Modules</span>
               </div>
            </div>
         </div>

         {/* Performance Tables */}
         <div className="lg:col-span-8 saas-card p-0 border shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b flex items-center justify-between bg-muted/5">
               <h2 className="text-xl font-black flex items-center gap-2">
                  <Activity className="h-5 w-5 text-emerald-500" /> Top Performing Assets
               </h2>
                <Link href="/admin/courses">
                  <Button variant="ghost" size="sm" className="font-bold text-xs uppercase tracking-widest">Manage Catalog</Button>
               </Link>
            </div>
            <div className="overflow-x-auto">
               <Table>
                 <TableHeader className="bg-muted/20 border-b">
                   <TableRow>
                     <TableHead className="font-black text-[10px] uppercase tracking-widest px-6 h-12">Asset Name</TableHead>
                     <TableHead className="font-black text-[10px] uppercase tracking-widest text-center h-12">Engagement</TableHead>
                     <TableHead className="font-black text-[10px] uppercase tracking-widest text-right px-6 h-12">Revenue Yield</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {topCourses?.map((course: any) => (
                     <TableRow key={course.id} className="group hover:bg-muted/10 transition-colors h-16">
                       <TableCell className="px-6">
                          <span className="font-black text-sm truncate block max-w-[250px] group-hover:text-primary transition-colors">{course.title}</span>
                       </TableCell>
                       <TableCell className="text-center">
                          <Badge variant="secondary" className="font-black px-3">{course.enrolledCount}</Badge>
                       </TableCell>
                       <TableCell className="text-right px-6">
                          <span className="text-sm font-black text-emerald-600">${((course.price || 0) * course.enrolledCount).toLocaleString()}</span>
                       </TableCell>
                     </TableRow>
                   ))}
                 </TableBody>
               </Table>
            </div>
         </div>
      </div>
    </div>
  );
}
