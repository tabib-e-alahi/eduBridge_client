"use client";

import { useMyOrders } from "@/hooks/useOrders";
import { Loading } from "@/components/shared/Loading";
import { ErrorState } from "@/components/shared/ErrorState";
import { 
  ReceiptText, 
  Download, 
  Calendar,
  CheckCircle2,
  Clock,
  Ban
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/dashboard/PageHeader";

export default function UserOrdersPage() {
  const { data: ordersData, isLoading, isError, refetch } = useMyOrders();

  if (isLoading) return <Loading />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;

  const orders = ordersData?.data || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-none"><CheckCircle2 className="h-3 w-3 mr-1" /> Paid</Badge>;
      case 'PENDING':
        return <Badge className="bg-amber-500/10 text-amber-600 border-none"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
      case 'FAILED':
      case 'CANCELLED':
        return <Badge className="bg-destructive/10 text-destructive border-none"><Ban className="h-3 w-3 mr-1" /> {status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader 
        title="Order History" 
        subtitle="Track your purchases and download receipts."
      />

      <div className="grid gap-6">
        {orders.map((order: any) => (
          <div key={order.id} className="saas-card group bg-card border-muted-foreground/10 hover:border-primary/40 transition-all shadow-sm p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              
              <div className="flex items-center gap-4 flex-1">
                 <div className="relative w-24 h-16 rounded-md overflow-hidden shrink-0 border border-muted-foreground/20">
                    <Image 
                      src={order.course?.thumbnailUrl || "/no_image.jpg"} 
                      alt="Course" 
                      fill 
                      className="object-cover" 
                    />
                 </div>
                 <div className="space-y-1">
                    <h3 className="font-black text-lg leading-tight line-clamp-1">{order.course?.title || "Unknown Course"}</h3>
                    <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground">
                       <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {new Date(order.createdAt).toLocaleDateString()}
                       </span>
                       <span>•</span>
                       <span className="font-mono opacity-60">ID: {order.id.split('-')[0].toUpperCase()}</span>
                    </div>
                 </div>
              </div>

              <div className="flex items-center gap-6 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
                 <div className="flex flex-col items-end gap-1">
                    <span className="font-black text-xl">${order.amount}</span>
                    {getStatusBadge(order.status)}
                 </div>
                 
                 <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 rounded-[0.5rem] bg-muted/30 hover:bg-muted" title="Download Receipt">
                    <Download className="h-4 w-4" />
                 </Button>
              </div>

            </div>
          </div>
        ))}

        {orders.length === 0 && (
           <div className="py-24 text-center saas-card bg-transparent border-dashed border-2 flex flex-col items-center gap-4 border-muted-foreground/20">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-2">
                 <ReceiptText className="h-8 w-8 opacity-50" />
              </div>
              <h3 className="text-2xl font-black text-foreground/80 tracking-tight">No Order History.</h3>
              <p className="text-muted-foreground max-w-sm mx-auto font-medium">
                 You haven't purchased any courses yet. Explore our catalog to start learning!
              </p>
              <Link href="/courses">
                 <Button className="mt-4 font-black rounded-xl h-12 px-8">Browse Courses</Button>
              </Link>
           </div>
        )}
      </div>
    </div>
  );
}
