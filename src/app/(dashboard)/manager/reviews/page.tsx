"use client";

import { useState } from "react";
import { useInstructorReviews } from "@/hooks/useReviewData";
import { Loading } from "@/components/shared/Loading";
import { ErrorState } from "@/components/shared/ErrorState";
import { 
  Star, 
  MessageSquare, 
  Filter, 
  Search, 
  ArrowRight,
  TrendingUp,
  ThumbsUp,
  ThumbsDown,
  User,
  Quote
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export default function InstructorReviewsPage() {
  const { data: reviewsData, isLoading, isError, refetch } = useInstructorReviews();
  const [ratingFilter, setRatingFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  if (isLoading) return <Loading />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;

  const reviews = reviewsData?.data || [];
  const filteredReviews = reviews.filter((r) => {
    const matchesRating = ratingFilter === "ALL" || r.rating.toString() === ratingFilter;
    const matchesSearch = r.course?.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.comment?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRating && matchesSearch;
  });

  const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const recommendationRate = reviews.length > 0 ? (reviews.filter(r => r.isRecommended).length / reviews.length) * 100 : 0;

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-foreground">Feedback.</h1>
          <p className="text-muted-foreground font-medium">Monitor your course reputation and student sentiment.</p>
        </div>
      </div>

      {/* Stats Summary Area */}
      <div className="grid gap-6 md:grid-cols-3">
         <div className="saas-card bg-primary/5 border-primary/20">
            <div className="flex justify-between items-start mb-2">
               <p className="text-[10px] font-black uppercase tracking-widest text-primary">Global Satisfaction</p>
               <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <p className="text-4xl font-black">{avgRating.toFixed(1)}</p>
            <div className="flex gap-0.5 text-amber-500 mt-2">
               {[1,2,3,4,5].map(i => <Star key={i} className={cn("h-4 w-4", i <= Math.round(avgRating) ? "fill-current" : "opacity-30")} />)}
            </div>
         </div>
         <div className="saas-card bg-emerald-500/5 border-emerald-500/20">
            <div className="flex justify-between items-start mb-2">
               <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Recommendation Rate</p>
               <ThumbsUp className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="text-4xl font-black">{recommendationRate.toFixed(0)}%</p>
            <p className="text-[10px] font-bold text-emerald-600/70 mt-2 uppercase tracking-widest">Positive Student Endorsement</p>
         </div>
         <div className="saas-card bg-muted/30 border-muted-foreground/10">
            <div className="flex justify-between items-start mb-2">
               <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Responses</p>
               <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-4xl font-black">{reviews.length}</p>
            <p className="text-[10px] font-bold text-muted-foreground/70 mt-2 uppercase tracking-widest">Verified Student Reviews</p>
         </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-muted/30 p-4 rounded-[1rem] border border-muted-foreground/10">
         <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search in reviews or courses..." 
              className="pl-10 h-11 rounded-[0.75rem] border-none bg-background shadow-none" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
         <div className="flex items-center gap-3 w-full md:w-auto">
            <Button variant="outline" size="icon" className="h-11 w-11 rounded-[0.75rem] bg-background border-none"><Filter className="h-4 w-4" /></Button>
         </div>
      </div>

      {/* Reviews List */}
      <div className="grid gap-6">
         {filteredReviews.map((review) => (
           <div key={review.id} className="saas-card group bg-card border-muted-foreground/10 hover:border-primary/30 transition-all">
              <div className="flex flex-col md:flex-row gap-6">
                 <div className="flex items-start gap-4 md:w-64 shrink-0 border-b md:border-b-0 md:border-r border-muted-foreground/10 pb-4 md:pb-0 md:pr-6">
                    <Avatar className="h-12 w-12 rounded-[0.75rem] border">
                       <AvatarImage src={review.user?.image} />
                       <AvatarFallback className="font-black text-xs">{review.user?.name?.charAt(0) || "?"}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                       <p className="text-sm font-black truncate">{review.user?.name || "Anonymous"}</p>
                       <p className="text-[10px] font-bold text-muted-foreground uppercase mt-0.5 tracking-wider">Student</p>
                       <div className="flex gap-0.5 text-amber-500 mt-2">
                          {[...Array(5)].map((_, i) => (
                             <Star key={i} className={cn("h-3 w-3", i < review.rating ? "fill-current" : "opacity-20")} />
                          ))}
                       </div>
                    </div>
                 </div>
                 
                 <div className="flex-1 space-y-4 pt-1">
                    <div className="flex justify-between items-start">
                       <Badge variant="outline" className="font-black text-[9px] uppercase tracking-widest bg-primary/5 text-primary border-none px-2 py-1">
                          {review.course?.title || "Unknown Course"}
                       </Badge>
                       <span className="text-[10px] font-black text-muted-foreground uppercase">{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="relative">
                       <Quote className="absolute -left-2 -top-2 h-8 w-8 text-primary/5 -z-0" />
                       <p className="text-sm font-medium leading-relaxed italic relative z-10">
                         "{review.comment}"
                       </p>
                    </div>

                    <div className="flex items-center gap-4 pt-2">
                       {review.isRecommended ? (
                          <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[10px] uppercase tracking-widest">
                             <ThumbsUp className="h-3 w-3" /> Recommended Asset
                          </div>
                       ) : (
                          <div className="flex items-center gap-1.5 text-destructive font-bold text-[10px] uppercase tracking-widest">
                             <ThumbsDown className="h-3 w-3" /> Not Recommended
                          </div>
                       )}
                       <Separator orientation="vertical" className="h-4" />
                       <Button variant="link" className="p-0 h-auto text-[10px] font-black uppercase tracking-widest text-primary hover:no-underline group/btn">
                          View Student Progress <ArrowRight className="ml-1 h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
                       </Button>
                    </div>
                 </div>
              </div>
           </div>
         ))}

         {filteredReviews.length === 0 && (
           <div className="py-20 text-center saas-card bg-transparent border-dashed border-2 flex flex-col items-center gap-4 border-muted-foreground/20">
              <MessageSquare className="h-12 w-12 text-muted-foreground opacity-20" />
              <h3 className="text-xl font-bold">No matching feedback</h3>
              <p className="text-muted-foreground max-w-sm mx-auto font-medium">Try adjusting your filters to see more student responses.</p>
           </div>
         )}
      </div>
    </div>
  );
}
