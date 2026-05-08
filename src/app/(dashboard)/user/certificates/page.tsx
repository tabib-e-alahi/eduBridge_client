"use client";

import { Award, Download, Share2, Lock, CheckCircle2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyCertificates } from "@/hooks/useStudentData";
import { ErrorState } from "@/components/shared/ErrorState";

export default function CertificatesPage() {
  const { data, isLoading, isError, refetch } = useMyCertificates();

  if (isLoading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <PageHeader
          title="Certificates & Achievements"
          subtitle="Verified credentials for your completed learning milestones."
        />
        <div className="lms-card p-6 space-y-3">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-9 w-2/3" />
          <Skeleton className="h-3 w-full" />
        </div>
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Skeleton className="h-4 w-1/3" />
            <div className="lms-card p-6 space-y-3">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-4 w-1/3" />
            <div className="lms-card p-6 space-y-3">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-2 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) return <ErrorState onRetry={() => refetch()} />;

  const earned = data?.data?.earned || [];
  const inProgress = data?.data?.inProgress || [];

  const handleCopyLink = async (cert: any) => {
    try {
      const url = `${window.location.origin}/verify/certificate/${cert.verificationHash}`;
      await navigator.clipboard.writeText(url);
      toast.success("Certificate verification link copied.");
    } catch {
      toast.error("Failed to copy link.");
    }
  };

  const handleDownload = (cert: any) => {
    window.open(`/api/v1/certificates/${cert.id}/download`, "_blank");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader 
        title="Certificates & Achievements" 
        subtitle="Verified credentials for your completed learning milestones."
      />

      {/* Hero Achievement Section */}
      <div className="lms-card p-0 overflow-hidden bg-foreground text-background dark:bg-card dark:text-foreground">
        <div className="p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

          <div className="space-y-4 max-w-xl relative z-10 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Badge className="bg-emerald-500/20 text-emerald-400 border-none font-bold text-[10px] uppercase tracking-widest px-3 py-1">
                Verified Credentials
              </Badge>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              {earned.length > 0
                ? `You've earned ${earned.length} certificate${earned.length > 1 ? "s" : ""}!`
                : "Complete courses to earn certificates"}
            </h2>
            <p className="text-sm font-medium text-muted-foreground opacity-90 leading-relaxed">
              Share your certificate verification link with employers and your network.
            </p>
          </div>

          <div className="flex items-center gap-4 relative z-10">
            <div className="h-20 w-20 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <Award className="h-10 w-10" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-6">
           <h2 className="text-lg font-bold flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              Earned Credentials
           </h2>
           
           <div className="space-y-4">
              {earned.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center gap-4 lms-card border-dashed border-2 bg-transparent shadow-none">
                  <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center">
                    <Lock className="h-8 w-8 text-muted-foreground/40" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">No certificates yet</h3>
                    <p className="text-sm text-muted-foreground max-w-xs">
                      Complete a course to unlock your first certificate.
                    </p>
                  </div>
                </div>
              ) : (
                earned.map((cert: any) => (
                  <div key={cert.id} className="lms-card p-0 overflow-hidden group">
                    <div className="p-6 border-b border-border bg-muted/20 flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <h3 className="font-bold text-base leading-tight group-hover:text-primary transition-colors">
                          {cert.course?.title}
                        </h3>
                        <p className="text-xs font-medium text-muted-foreground">
                          Instructor: {cert.course?.instructor?.name || "—"}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className="font-bold text-[10px] bg-card uppercase border-emerald-500/20 text-emerald-600"
                      >
                        {cert.certificateNumber}
                      </Badge>
                    </div>

                    <div className="p-6 grid grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Issued</p>
                        <p className="font-bold text-xs">
                          {new Date(cert.issuedAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Grade</p>
                        <p className="font-bold text-emerald-600 text-xs">{cert.grade}%</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Category</p>
                        <p className="font-bold text-xs">{cert.course?.category?.name || "—"}</p>
                      </div>
                    </div>

                    <div className="p-4 bg-muted/10 border-t border-border flex gap-2">
                      <Button className="flex-1 h-9 font-bold text-xs" size="sm" onClick={() => handleDownload(cert)}>
                        <Download className="h-3.5 w-3.5 mr-2" /> Download PDF
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 h-9 font-bold text-xs"
                        size="sm"
                        onClick={() => handleCopyLink(cert)}
                      >
                        <Share2 className="h-3.5 w-3.5 mr-2" /> Copy Link
                      </Button>
                      <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 border border-border" asChild>
                        <a href={`/verify/certificate/${cert.verificationHash}`} target="_blank" rel="noreferrer">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </Button>
                    </div>
                  </div>
                ))
              )}
           </div>
        </div>

        <div className="space-y-6">
           <h2 className="text-lg font-bold flex items-center gap-2">
              <Lock className="h-5 w-5 text-muted-foreground" />
              Upcoming Milestones
           </h2>
           
           <div className="space-y-4">
              {inProgress.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center gap-4 lms-card border-dashed border-2 bg-transparent shadow-none">
                  <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8 text-emerald-500/40" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">No active milestones</h3>
                    <p className="text-sm text-muted-foreground max-w-xs">
                      Enroll in a course and complete it to earn new certificates.
                    </p>
                  </div>
                </div>
              ) : (
                inProgress.map((enrollment: any) => (
                  <div key={enrollment.id} className="lms-card p-6 flex flex-col gap-4 opacity-90">
                    <div className="flex gap-4 items-start">
                      <div className="h-10 w-10 rounded-2xl bg-muted flex items-center justify-center shrink-0 border border-border">
                        <Lock className="h-5 w-5 text-muted-foreground/60" />
                      </div>
                      <div className="space-y-1 flex-1">
                        <h3 className="font-bold text-sm leading-tight">{enrollment.course?.title}</h3>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                          Complete to unlock
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold uppercase text-muted-foreground tracking-widest">
                        <span>Progress</span>
                        <span>{Math.round(enrollment.progress)}%</span>
                      </div>
                      <Progress value={enrollment.progress} className="h-1.5" />
                    </div>
                  </div>
                ))
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
