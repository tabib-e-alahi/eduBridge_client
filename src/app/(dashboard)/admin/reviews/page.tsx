"use client";

import { useState } from "react";
import { useAdminReviews, useModerateReview, useDeleteReview } from "@/hooks/useReviewData";
import { Loading } from "@/components/shared/Loading";
import { ErrorState } from "@/components/shared/ErrorState";
import { 
  ShieldCheck, 
  EyeOff, 
  Eye, 
  Trash2, 
  Search, 
  Filter, 
  Star,
  User,
  AlertTriangle,
  CheckCircle2,
  MoreVertical
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export default function AdminReviewModerationPage() {
  const { data: reviewsData, isLoading, isError, refetch } = useAdminReviews();
  const moderateMutation = useModerateReview();
  const deleteMutation = useDeleteReview();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  if (isLoading) return <Loading />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;

  const reviews = reviewsData?.data || [];
  const filteredReviews = reviews.filter((r) => {
    const matchesSearch = r.user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || 
                          (statusFilter === "HIDDEN" && r.isHidden) || 
                          (statusFilter === "VISIBLE" && !r.isHidden);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-foreground">Moderation.</h1>
          <p className="text-muted-foreground font-medium">Enforce community standards and manage platform discourse.</p>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-muted/30 p-4 rounded-[1rem] border border-muted-foreground/10">
         <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Filter reviews by student, course, or content..." 
              className="pl-10 h-11 rounded-[0.75rem] border-none bg-background shadow-none" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
         <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex bg-background rounded-[0.75rem] p-1 border border-muted-foreground/10">
               <Button 
                 variant={statusFilter === 'ALL' ? 'secondary' : 'ghost'} 
                 size="sm" 
                 className="rounded-[0.5rem] font-bold text-[10px] uppercase px-4 h-9"
                 onClick={() => setStatusFilter('ALL')}
               >
                  All
               </Button>
               <Button 
                 variant={statusFilter === 'VISIBLE' ? 'secondary' : 'ghost'} 
                 size="sm" 
                 className="rounded-[0.5rem] font-bold text-[10px] uppercase px-4 h-9"
                 onClick={() => setStatusFilter('VISIBLE')}
               >
                  Visible
               </Button>
               <Button 
                 variant={statusFilter === 'HIDDEN' ? 'secondary' : 'ghost'} 
                 size="sm" 
                 className="rounded-[0.5rem] font-bold text-[10px] uppercase px-4 h-9"
                 onClick={() => setStatusFilter('HIDDEN')}
               >
                  Hidden
               </Button>
            </div>
            <Button variant="outline" size="icon" className="h-11 w-11 rounded-[0.75rem] bg-background border-none"><Filter className="h-4 w-4" /></Button>
         </div>
      </div>

      {/* Moderation Table */}
      <div className="saas-card p-0 overflow-hidden shadow-xl border-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-muted/50 border-b text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-6 py-5">Review Origin</th>
                <th className="px-6 py-5">Content Preview</th>
                <th className="px-6 py-5">Rating</th>
                <th className="px-6 py-5">State</th>
                <th className="px-6 py-5 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted-foreground/10">
              {filteredReviews.map((review) => (
                <tr key={review.id} className={cn("group transition-colors", review.isHidden ? "bg-muted/5 opacity-80" : "hover:bg-muted/10")}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 rounded-[0.75rem] border border-muted-foreground/10">
                        <AvatarImage src={review.user.image} />
                        <AvatarFallback className="font-black text-xs">{review.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-black truncate">{review.user.name}</p>
                        <p className="text-[10px] font-bold text-primary truncate uppercase tracking-wider">{review.course.title}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-md">
                    <p className="text-xs font-medium text-muted-foreground line-clamp-2 italic">
                      "{review.comment}"
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 font-black text-sm text-amber-500">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span>{review.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {review.isHidden ? (
                      <Badge className="bg-destructive/10 text-destructive border-none font-black text-[9px] uppercase tracking-widest px-2">
                        <EyeOff className="h-3 w-3 mr-1" /> Hidden
                      </Badge>
                    ) : (
                      <Badge className="bg-emerald-500/10 text-emerald-600 border-none font-black text-[9px] uppercase tracking-widest px-2">
                        <Eye className="h-3 w-3 mr-1" /> Public
                      </Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                       <Button 
                         variant="ghost" 
                         size="icon" 
                         className={cn(
                           "h-9 w-9 rounded-[0.625rem] transition-colors",
                           review.isHidden ? "hover:bg-emerald-500/10 hover:text-emerald-600" : "hover:bg-amber-500/10 hover:text-amber-600"
                         )}
                         onClick={() => moderateMutation.mutate({ reviewId: review.id, isHidden: !review.isHidden })}
                       >
                          {review.isHidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                       </Button>
                       <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                             <Button variant="ghost" size="icon" className="h-9 w-9 rounded-[0.625rem]">
                                <MoreVertical className="h-4 w-4" />
                             </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56 p-2 rounded-[0.75rem] font-bold">
                             <DropdownMenuLabel className="px-2 py-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">Admin Actions</DropdownMenuLabel>
                             <DropdownMenuSeparator />
                             <DropdownMenuItem 
                               className="gap-2 text-destructive focus:text-destructive cursor-pointer"
                               onClick={() => {
                                 if(confirm("Permanently delete this review? This cannot be undone.")) {
                                   deleteMutation.mutate(review.id);
                                 }
                               }}
                             >
                                <Trash2 className="h-4 w-4" /> Permanent Delete
                             </DropdownMenuItem>
                             <DropdownMenuItem className="gap-2 cursor-pointer">
                                <User className="h-4 w-4" /> View Student Profile
                             </DropdownMenuItem>
                          </DropdownMenuContent>
                       </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredReviews.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-muted-foreground font-black uppercase tracking-widest opacity-40">
                    No reviews require moderation at this time.
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
