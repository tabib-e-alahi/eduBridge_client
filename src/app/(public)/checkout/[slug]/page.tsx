"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCourseBySlug } from "@/hooks/useCourses";
import { useCreateOrder, useCheckout } from "@/hooks/useOrders";
import { useAuth } from "@/lib/auth-client";
import { Loading } from "@/components/shared/Loading";
import { ErrorState } from "@/components/shared/ErrorState";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Lock, CreditCard, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";
import Image from "next/image";

export default function CheckoutPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const { data: session, isPending: isAuthLoading } = useAuth();
  const user = session?.user;
  
  const { data: courseData, isLoading: isCourseLoading, isError } = useCourseBySlug(slug);
  const createOrderMutation = useCreateOrder();
  const checkoutMutation = useCheckout();

  const [order, setOrder] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const course = courseData?.data;
  const courseId = course?.id;

  // Initialize Order
  useEffect(() => {
    if (user && courseId && !order && !createOrderMutation.isPending && !createOrderMutation.isSuccess) {
      createOrderMutation.mutate(courseId, {
        onSuccess: (res) => {
          setOrder(res.data);
        }
      });
    }
  }, [user, courseId, order, createOrderMutation]);

  if (isAuthLoading || isCourseLoading) return <Loading />;
  
  if (!user) {
     router.push(`/login?redirect=/checkout/${slug}`);
     return <Loading />;
  }

  if (isError || !course) return <ErrorState message="Failed to load course details." />;

  const handleSimulatePayment = () => {
    if (!order) return;
    setIsProcessing(true);
    
    // Simulate payment delay
    setTimeout(() => {
      checkoutMutation.mutate({
        orderId: order.id,
        transactionId: `txn_sim_${Math.random().toString(36).substring(7)}`,
        paymentMethod: "simulated_card"
      }, {
        onSuccess: () => {
           router.push(`/learn/${course?.slug || course?.id}`);
        },
        onSettled: () => {
           setIsProcessing(false);
        }
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-muted/10 py-20">
      <div className="container mx-auto px-4 max-w-5xl">
         
         <div className="mb-10 text-center">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3">Secure Checkout</h1>
            <p className="text-muted-foreground font-medium flex items-center justify-center gap-2">
               <Lock className="h-4 w-4 text-emerald-500" /> End-to-end encrypted transaction
            </p>
         </div>

         <div className="grid lg:grid-cols-12 gap-10 items-start">
            
            {/* Left: Checkout Form */}
            <div className="lg:col-span-7 space-y-6">
               <Card className="saas-card shadow-sm border-muted-foreground/20">
                  <CardHeader className="pb-4">
                     <CardTitle className="text-xl font-black flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-primary" /> Payment Method
                     </CardTitle>
                     <CardDescription className="font-medium">
                        This is a simulated checkout environment. No real funds will be processed.
                     </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                     <div className="bg-primary/5 border border-primary/20 rounded-[0.75rem] p-4 flex items-start gap-3">
                        <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <div className="text-sm font-medium text-muted-foreground leading-relaxed">
                           <strong className="text-foreground">Sandbox Mode Active.</strong> 
                           You are testing the EduBridge AI platform. Click the button below to simulate a successful payment and instantly enroll in the course.
                        </div>
                     </div>

                     <div className="space-y-4 opacity-50 pointer-events-none select-none">
                        <div className="space-y-2">
                           <Label className="font-bold">Card Information</Label>
                           <Input className="h-12 rounded-[0.5rem] font-mono" placeholder="4242 4242 4242 4242" readOnly />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                              <Label className="font-bold">Expiry Date</Label>
                              <Input className="h-12 rounded-[0.5rem] font-mono" placeholder="MM/YY" readOnly />
                           </div>
                           <div className="space-y-2">
                              <Label className="font-bold">CVC</Label>
                              <Input className="h-12 rounded-[0.5rem] font-mono" placeholder="123" readOnly />
                           </div>
                        </div>
                     </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                     <Button 
                       className="w-full h-14 rounded-[0.75rem] font-black text-lg shadow-lg shadow-primary/20 gap-2 transition-all"
                       onClick={handleSimulatePayment}
                       disabled={isProcessing || !order}
                     >
                       {isProcessing ? "Processing Transaction..." : `Pay $${course?.price || 0} & Enroll`}
                       {!isProcessing && <ArrowRight className="h-5 w-5" />}
                     </Button>
                  </CardFooter>
               </Card>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-5">
               <Card className="saas-card shadow-xl border-border bg-card sticky top-24">
                  <CardHeader className="pb-4 border-b border-border/50">
                     <CardTitle className="text-lg font-black uppercase tracking-widest text-muted-foreground">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                     <div className="flex gap-4 items-start">
                        <div className="relative w-24 h-16 rounded-md overflow-hidden shrink-0 border">
                           <Image 
                             src={course?.thumbnailUrl || "/no_image.jpg"} 
                             alt="Course" 
                             fill 
                             className="object-cover" 
                           />
                        </div>
                        <div>
                           <h3 className="font-black leading-tight text-foreground line-clamp-2 mb-1">{course?.title || "Loading Course..."}</h3>
                           <p className="text-xs font-bold text-muted-foreground">{course?.instructor?.name || "Instructor"}</p>
                        </div>
                     </div>

                     <Separator />

                     <div className="space-y-3 font-medium text-sm">
                        <div className="flex justify-between text-muted-foreground">
                           <span>Original Price</span>
                           <span>${course?.price || 0}</span>
                        </div>
                        <div className="flex justify-between text-emerald-600 font-bold">
                           <span>Platform Discount</span>
                           <span>-$0.00</span>
                        </div>
                     </div>

                     <Separator />

                     <div className="flex justify-between items-center">
                        <span className="font-black text-lg">Total</span>
                        <span className="font-black text-3xl">${course?.price || 0}</span>
                     </div>
                  </CardContent>
                  <CardFooter className="bg-muted/30 p-4 border-t border-border/50 rounded-b-[1.25rem]">
                     <div className="w-full text-center space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center justify-center gap-1">
                           <CheckCircle2 className="h-3 w-3" /> 30-Day Money-Back Guarantee
                        </p>
                     </div>
                  </CardFooter>
               </Card>
            </div>

         </div>
      </div>
    </div>
  );
}
