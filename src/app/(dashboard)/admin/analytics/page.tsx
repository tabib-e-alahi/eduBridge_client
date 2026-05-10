"use client";

import { useAdminDashboard } from "@/hooks/useDashboard";
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
  PieChart,
  Pie,
  LineChart,
  Line,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import { 
  TrendingUp, 
  Calendar, 
  Download, 
  Filter,
  Users,
  Globe,
  Monitor,
  Smartphone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AdminAnalyticsPage() {
  const { data, isLoading, isError, refetch } = useAdminDashboard();

  if (isLoading) return <Loading />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;

  const { charts } = data?.data || {};

  const COLORS = [
    'var(--chart-1)', 
    'var(--chart-2)', 
    'var(--chart-3)', 
    'var(--chart-4)', 
    'var(--chart-5)'
  ];

  const deviceData = [
    { name: 'Desktop', value: 65, icon: Monitor },
    { name: 'Mobile', value: 25, icon: Smartphone },
    { name: 'Tablet', value: 10, icon: Globe },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Analytics</h1>
          <p className="text-muted-foreground">Deep dive into platform growth, engagement, and user behavior.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" /> Last 30 Days
           </Button>
           <Button className="gap-2">
              <Download className="h-4 w-4" /> Export Data
           </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Retention / Engagement Chart */}
        <Card className="lg:col-span-2 border-none shadow-sm bg-card">
          <CardHeader>
             <div className="flex items-center justify-between">
                <div>
                   <CardTitle className="text-lg">User Engagement</CardTitle>
                   <CardDescription>Daily active users and session length.</CardDescription>
                </div>
                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-none">
                   +18% Growing
                </Badge>
             </div>
          </CardHeader>
          <CardContent className="h-[400px]">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={charts?.monthlyEnrollments}>
                   <defs>
                      <linearGradient id="colorEngage" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3}/>
                         <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0}/>
                      </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                   <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                   <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                   <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                   />
                   <Area type="monotone" dataKey="count" stroke="var(--chart-1)" fillOpacity={1} fill="url(#colorEngage)" strokeWidth={3} />
                </AreaChart>
             </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Device Distribution */}
        <Card className="border-none shadow-sm bg-card">
           <CardHeader>
              <CardTitle className="text-lg">Device Usage</CardTitle>
              <CardDescription>Platforms used by students.</CardDescription>
           </CardHeader>
           <CardContent className="space-y-8">
              <div className="h-[200px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie
                          data={deviceData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={8}
                          dataKey="value"
                       >
                          {deviceData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                       </Pie>
                    </PieChart>
                 </ResponsiveContainer>
              </div>
              <div className="space-y-4">
                 {deviceData.map((device, i) => {
                   const Icon = device.icon;
                   return (
                     <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <div className="p-2 rounded-lg bg-muted">
                              <Icon className="h-4 w-4 text-muted-foreground" />
                           </div>
                           <span className="text-sm font-medium">{device.name}</span>
                        </div>
                        <div className="flex items-center gap-4">
                           <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div className="h-full" style={{ width: `${device.value}%`, backgroundColor: COLORS[i % COLORS.length] }} />
                           </div>
                           <span className="text-sm font-bold">{device.value}%</span>
                        </div>
                     </div>
                   );
                 })}
              </div>
           </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
         {/* Category Revenue Growth */}
         <Card className="border-none shadow-sm bg-card">
            <CardHeader>
               <CardTitle className="text-lg">Revenue by Category</CardTitle>
               <CardDescription>Income distribution across learning domains.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts?.categoryDistribution}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                     <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                     <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                     <Tooltip 
                        cursor={{ fill: 'var(--muted)', opacity: 0.4 }}
                        contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '12px' }}
                     />
                     <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {charts?.categoryDistribution?.map((entry: any, index: number) => (
                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                     </Bar>
                  </BarChart>
               </ResponsiveContainer>
            </CardContent>
         </Card>

         {/* Geographical Distribution Mock */}
         <Card className="border-none shadow-sm bg-card">
            <CardHeader>
               <CardTitle className="text-lg">Global Reach</CardTitle>
               <CardDescription>User distribution by region.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
               {[
                 { region: "North America", value: 45, color: "var(--chart-1)" },
                 { region: "Europe", value: 30, color: "var(--chart-2)" },
                 { region: "Asia", value: 15, color: "var(--chart-3)" },
                 { region: "Other", value: 10, color: "var(--chart-4)" },
               ].map((region, i) => (
                 <div key={i} className="space-y-2">
                    <div className="flex justify-between text-sm">
                       <span className="font-medium">{region.region}</span>
                       <span className="font-bold">{region.value}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                       <div className="h-full transition-all duration-1000" style={{ width: `${region.value}%`, backgroundColor: region.color }} />
                    </div>
                 </div>
               ))}
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
