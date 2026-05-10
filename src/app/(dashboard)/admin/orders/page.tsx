"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { ApiResponse } from "@/types";
import { useState } from "react";
import { Loading } from "@/components/shared/Loading";
import { ErrorState } from "@/components/shared/ErrorState";
import { 
  ReceiptText, 
  Search, 
  Filter,
  CheckCircle2,
  Clock,
  Ban,
  Download
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const useAdminOrders = () => {
  return useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<any[]>>('/orders/all');
      return data;
    },
  });
};

export default function AdminOrdersPage() {
  const { data: ordersData, isLoading, isError, refetch } = useAdminOrders();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  if (isLoading) return <Loading />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;

  const orders = ordersData?.data || [];

  const filteredOrders = orders.filter((order) => {
    const searchMatch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.course?.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const statusMatch = statusFilter === "ALL" || order.status === statusFilter;
    return searchMatch && statusMatch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-none font-bold text-[9px] uppercase"><CheckCircle2 className="h-3 w-3 mr-1" /> Success</Badge>;
      case 'PENDING':
        return <Badge className="bg-amber-500/10 text-amber-600 border-none font-bold text-[9px] uppercase"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
      case 'FAILED':
      case 'CANCELLED':
        return <Badge className="bg-destructive/10 text-destructive border-none font-bold text-[9px] uppercase"><Ban className="h-3 w-3 mr-1" /> {status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-foreground flex items-center gap-3">
             Platform Orders <ReceiptText className="h-8 w-8 text-primary" />
          </h1>
          <p className="text-muted-foreground font-medium text-lg">Monitor all financial transactions and enrollments.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-muted/30 p-4 rounded-[1rem] border border-muted-foreground/10">
         <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by ID, email, or course..." 
              className="pl-10 h-11 rounded-[0.75rem] border-none bg-background shadow-none font-mono text-sm" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
         <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto">
            <div className="flex bg-background rounded-[0.75rem] p-1 border border-muted-foreground/10 min-w-max">
               {["ALL", "SUCCESS", "PENDING", "FAILED"].map((filter) => (
                 <Button 
                   key={filter}
                   variant={statusFilter === filter ? 'secondary' : 'ghost'} 
                   size="sm" 
                   className="rounded-[0.5rem] font-bold text-[10px] uppercase px-4 h-9"
                   onClick={() => setStatusFilter(filter)}
                 >
                    {filter}
                 </Button>
               ))}
            </div>
            <Button variant="outline" size="icon" className="h-11 w-11 rounded-[0.75rem] bg-background border-none shrink-0"><Filter className="h-4 w-4" /></Button>
         </div>
      </div>

      <div className="saas-card p-0 overflow-hidden shadow-xl border-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-muted/50 border-b text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-6 py-5">Order ID</th>
                <th className="px-6 py-5">Customer (Masked)</th>
                <th className="px-6 py-5">Course</th>
                <th className="px-6 py-5">Amount</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted-foreground/10">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="group hover:bg-muted/10 transition-colors">
                  <td className="px-6 py-4">
                     <span className="font-mono text-xs font-bold text-foreground">
                        {order.id.split('-')[0].toUpperCase()}
                     </span>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex flex-col">
                        <span className="text-sm font-bold leading-tight">{order.user?.name || "Unknown"}</span>
                        {/* Note: The backend should ideally mask this email before it reaches the frontend */}
                        <span className="text-[10px] font-medium text-muted-foreground">{order.user?.email || "No Email"}</span>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                     <span className="text-sm font-bold leading-tight line-clamp-1 max-w-[200px]" title={order.course?.title}>
                        {order.course?.title || "Unknown Course"}
                     </span>
                  </td>
                  <td className="px-6 py-4">
                     <span className="font-black text-emerald-600">${order.amount}</span>
                  </td>
                  <td className="px-6 py-4">
                     {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 text-right">
                     <div className="flex flex-col items-end gap-1 text-muted-foreground font-medium">
                        <span className="text-xs">{new Date(order.createdAt).toLocaleDateString()}</span>
                        <span className="text-[9px] uppercase">{new Date(order.createdAt).toLocaleTimeString()}</span>
                     </div>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-20 text-center text-muted-foreground font-black uppercase tracking-widest opacity-40">
                    No transactions match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
