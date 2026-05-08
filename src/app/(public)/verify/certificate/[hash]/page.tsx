"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, XCircle, ExternalLink } from "lucide-react";
import Link from "next/link";

const useVerifyCertificate = (hash: string) =>
  useQuery({
    queryKey: ["certificate-verify", hash],
    queryFn: async () => {
      const { data } = await api.get(`/certificates/verify/${hash}`);
      return data;
    },
    enabled: !!hash,
  });

export default function VerifyCertificatePage() {
  const params = useParams();
  const hash = String((params as any)?.hash || "");

  const { data, isLoading, isError } = useVerifyCertificate(hash);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto py-12 space-y-8">
        <PageHeader
          title="Certificate Verification"
          subtitle="Verify the authenticity of an EduBridge certificate."
        />
        <div className="lms-card p-6 space-y-3">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-3 w-full" />
        </div>
      </div>
    );
  }

  const cert = data?.data;
  const isValid = !isError && !!cert;

  return (
    <div className="max-w-3xl mx-auto py-12 space-y-8">
      <PageHeader
        title="Certificate Verification"
        subtitle="Verify the authenticity of an EduBridge certificate."
      />

      <div className="lms-card p-8 space-y-6">
        <div className="flex items-start justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {isValid ? (
                <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] font-bold uppercase tracking-widest gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Valid
                </Badge>
              ) : (
                <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-[10px] font-bold uppercase tracking-widest gap-1.5">
                  <XCircle className="h-3.5 w-3.5" /> Invalid
                </Badge>
              )}
              {isValid && (
                <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest">
                  {cert.certificateNumber}
                </Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Certificate Details</h1>
            <p className="text-sm text-muted-foreground font-medium">
              {isValid
                ? "This certificate is issued by EduBridge and is verified as authentic."
                : "This verification link is not valid, or the certificate was not found."}
            </p>
          </div>
          <Link href="/courses">
            <Button variant="outline" className="font-bold h-10">
              Browse Courses <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>

        {isValid && (
          <div className="grid sm:grid-cols-2 gap-6 pt-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                Student
              </p>
              <p className="text-sm font-bold">{cert.student?.name || "—"}</p>
              <p className="text-xs text-muted-foreground font-medium">{cert.student?.email || ""}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                Course
              </p>
              <p className="text-sm font-bold">{cert.course?.title || "—"}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                Issued At
              </p>
              <p className="text-sm font-bold">
                {cert.issuedAt ? new Date(cert.issuedAt).toLocaleDateString() : "—"}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                Final Grade
              </p>
              <p className="text-sm font-bold text-emerald-600">{cert.grade}%</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

