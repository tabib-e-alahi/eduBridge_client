"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle2,
  ClipboardCheck,
  Download,
  GraduationCap,
  Mail,
  MessageSquare,
  Printer,
  Send,
  Trophy,
  UserRound,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Loading } from "@/components/shared/Loading";
import { ErrorState } from "@/components/shared/ErrorState";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useStudentProgressDetail } from "@/hooks/useInstructorData";
import { useAuth } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

function getParamValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value || "";
}

function formatDate(value?: string) {
  if (!value) return "Not available";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function getInitials(name?: string) {
  if (!name) return "ST";

  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function StatCard({
  label,
  value,
  trend,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  trend: string;
  icon: typeof GraduationCap;
}) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</p>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <p className="text-2xl font-bold tabular-nums">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{trend}</p>
    </div>
  );
}

function StatusBadge({ status }: { status?: string }) {
  const normalized = (status || "PENDING").toUpperCase();
  const isGood = ["ACTIVE", "COMPLETED", "GRADED", "PASSED"].includes(normalized);
  const isWarning = ["PENDING", "IN_PROGRESS"].includes(normalized);

  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-md",
        isGood && "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300",
        isWarning && "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-300",
        !isGood && !isWarning && "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300"
      )}
    >
      {normalized.replace(/_/g, " ")}
    </Badge>
  );
}

function EmptySection({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof BookOpen;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 rounded-full bg-muted p-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function CourseThumbnail({ src, title }: { src?: string; title: string }) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt="" className="h-20 w-28 rounded-lg border object-cover sm:h-24 sm:w-36" />
    );
  }

  return (
    <div className="grid h-20 w-28 shrink-0 place-items-center rounded-lg border bg-muted sm:h-24 sm:w-36">
      <BookOpen className="h-7 w-7 text-muted-foreground" />
      <span className="sr-only">{title}</span>
    </div>
  );
}

export default function StudentProgressDetailPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = getParamValue(params.studentId);
  const { data: session, isPending: isAuthLoading } = useAuth();
  const { data: progressResponse, isLoading, isError, refetch } = useStudentProgressDetail(studentId);

  const [messageOpen, setMessageOpen] = useState(false);
  const [messageSubject, setMessageSubject] = useState("");
  const [messageBody, setMessageBody] = useState("");

  useEffect(() => {
    if (!isAuthLoading && !session) {
      router.push("/auth/login");
    } else if (session && !["INSTRUCTOR", "MANAGER", "ADMIN"].includes((session.user as { role?: string }).role || "")) {
      router.push("/dashboard");
    }
  }, [session, isAuthLoading, router]);

  const detail = progressResponse?.data;
  const student = detail?.student;
  const enrollments = useMemo(() => detail?.enrollments || [], [detail?.enrollments]);
  const quizAttempts = detail?.quizAttempts || [];
  const submissions = detail?.submissions || [];

  const lastActiveDate = useMemo(() => {
    const dates = enrollments
      .flatMap((enrollment) => [
        enrollment.updatedAt,
        ...enrollment.lessonProgress.map((progress) => progress.completedAt).filter(Boolean),
      ])
      .filter((value): value is string => Boolean(value))
      .map((value) => new Date(value).getTime());

    return dates.length ? new Date(Math.max(...dates)).toISOString() : undefined;
  }, [enrollments]);

  const sendMessage = () => {
    if (!student) return;

    const mailto = `mailto:${student.email}?subject=${encodeURIComponent(messageSubject)}&body=${encodeURIComponent(messageBody)}`;
    window.location.href = mailto;
    toast.success("Message draft opened in your email client");
    setMessageOpen(false);
  };

  const exportReport = () => {
    toast.success("Opening print dialog for progress report");
    window.print();
  };

  if (isAuthLoading || isLoading) return <Loading />;
  if (isError) return <ErrorState message="Could not load student progress" onRetry={() => refetch()} />;

  if (!detail || !student) {
    return (
      <EmptySection
        icon={UserRound}
        title="Student not found"
        description="This student is not enrolled in one of your courses, or their progress record is unavailable."
      />
    );
  }

  return (
    <div className="space-y-8 print:bg-white">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center print:hidden">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Link href="/manager/students" className="inline-flex items-center gap-1 hover:text-foreground">
              <ArrowLeft className="h-3.5 w-3.5" /> Students
            </Link>
            <span>/</span>
            <span className="truncate font-medium text-foreground">{student.name}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Student Progress</h1>
          <p className="mt-1 text-sm text-muted-foreground">Complete learning history across your courses.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" className="gap-2" onClick={() => setMessageOpen(true)}>
            <MessageSquare className="h-4 w-4" /> Send Message
          </Button>
          <Button className="gap-2" onClick={exportReport}>
            <Download className="h-4 w-4" /> Export Progress Report
          </Button>
        </div>
      </div>

      <section className="rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Avatar className="h-20 w-20 rounded-2xl">
              <AvatarImage src={student.image} />
              <AvatarFallback className="text-lg font-semibold">{getInitials(student.name)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">{student.name}</h2>
              <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="h-4 w-4" /> {student.email}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" /> Joined {formatDate(student.createdAt)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Printer className="h-4 w-4" /> Last active {formatDate(lastActiveDate)}
                </span>
              </div>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[420px]">
            <div className="rounded-lg border bg-muted/20 p-4">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Courses</p>
              <p className="mt-2 text-2xl font-bold tabular-nums">{detail.summary.totalCourses}</p>
            </div>
            <div className="rounded-lg border bg-muted/20 p-4">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Avg Progress</p>
              <p className="mt-2 text-2xl font-bold tabular-nums">{detail.summary.averageProgress}%</p>
            </div>
            <div className="rounded-lg border bg-muted/20 p-4">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Quizzes</p>
              <p className="mt-2 text-2xl font-bold tabular-nums">{detail.summary.quizzesTaken}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Courses Enrolled" value={detail.summary.totalCourses} trend="With your instructor account" icon={GraduationCap} />
        <StatCard label="Average Progress" value={`${detail.summary.averageProgress}%`} trend="Across enrolled courses" icon={Trophy} />
        <StatCard label="Quizzes Taken" value={detail.summary.quizzesTaken} trend="Attempts recorded" icon={ClipboardCheck} />
        <StatCard label="Assignments" value={detail.summary.assignmentsSubmitted} trend="Submissions received" icon={BookOpen} />
      </div>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Course Progress</h2>
          <p className="mt-1 text-sm text-muted-foreground">Enrollment status, progress, and lesson-level completion.</p>
        </div>
        {enrollments.length ? (
          <div className="grid gap-4">
            {enrollments.map((enrollment) => {
              const completedLessons = enrollment.lessonProgress.filter((progress) => progress.isCompleted).length;
              const status = enrollment.progress >= (enrollment.course.completionCriteria || 100) ? "COMPLETED" : enrollment.status;

              return (
                <article key={enrollment.id} className="rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
                  <div className="flex flex-col gap-5 lg:flex-row">
                    <CourseThumbnail src={enrollment.course.thumbnailUrl} title={enrollment.course.title} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                        <div>
                          <h3 className="text-lg font-semibold">{enrollment.course.title}</h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            Enrolled {formatDate(enrollment.createdAt)} · Last active {formatDate(enrollment.updatedAt)}
                          </p>
                        </div>
                        <StatusBadge status={status} />
                      </div>
                      <div className="mt-5 space-y-2">
                        <div className="flex items-center justify-between text-xs font-medium uppercase tracking-widest text-muted-foreground">
                          <span>{completedLessons} lessons completed</span>
                          <span className="tabular-nums">{Math.round(enrollment.progress)}%</span>
                        </div>
                        <Progress value={enrollment.progress} className="h-2" />
                      </div>
                      <details className="mt-5 rounded-lg border bg-muted/20">
                        <summary className="cursor-pointer px-4 py-3 text-sm font-medium">Lesson-by-lesson completion</summary>
                        {enrollment.lessonProgress.length ? (
                          <div className="divide-y border-t">
                            {enrollment.lessonProgress.map((progress) => (
                              <div key={progress.id} className="flex items-center justify-between gap-3 px-4 py-3">
                                <div className="flex min-w-0 items-center gap-3">
                                  {progress.isCompleted ? (
                                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                                  ) : (
                                    <XCircle className="h-4 w-4 shrink-0 text-muted-foreground" />
                                  )}
                                  <div className="min-w-0">
                                    <p className="truncate text-sm font-medium">
                                      {progress.lesson.order}. {progress.lesson.title}
                                    </p>
                                    <p className="text-xs text-muted-foreground">{progress.lesson.duration || "No duration"}</p>
                                  </div>
                                </div>
                                <p className="shrink-0 text-xs text-muted-foreground">{progress.isCompleted ? formatDate(progress.completedAt) : "Incomplete"}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="border-t px-4 py-5 text-sm text-muted-foreground">No lesson progress has been recorded yet.</div>
                        )}
                      </details>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border bg-card shadow-sm">
            <EmptySection icon={BookOpen} title="No course progress" description="This student does not have active enrollments for your courses." />
          </div>
        )}
      </section>

      <section className="rounded-xl border bg-card shadow-sm">
        <div className="border-b p-4">
          <h2 className="text-lg font-semibold">Quiz Performance</h2>
          <p className="text-sm text-muted-foreground">Attempt scores and pass/fail status across your quizzes.</p>
        </div>
        {isLoading ? (
          <div className="space-y-3 p-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : quizAttempts.length ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="h-11 px-4 text-left text-xs font-medium uppercase tracking-widest text-muted-foreground">Quiz</th>
                  <th className="h-11 px-4 text-left text-xs font-medium uppercase tracking-widest text-muted-foreground">Course</th>
                  <th className="h-11 px-4 text-left text-xs font-medium uppercase tracking-widest text-muted-foreground">Score</th>
                  <th className="h-11 px-4 text-left text-xs font-medium uppercase tracking-widest text-muted-foreground">Result</th>
                  <th className="h-11 px-4 text-left text-xs font-medium uppercase tracking-widest text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {quizAttempts.map((attempt) => {
                  const percentage = attempt.totalQuestions ? Math.round((attempt.score / attempt.totalQuestions) * 100) : 0;
                  const passed = percentage >= 70 || attempt.status === "PASSED";

                  return (
                    <tr key={attempt.id} className="border-b transition-colors last:border-0 hover:bg-muted/30">
                      <td className="p-4 font-medium">{attempt.quiz.title}</td>
                      <td className="p-4 text-sm text-muted-foreground">{attempt.quiz.course.title}</td>
                      <td className="p-4 text-sm tabular-nums">
                        {attempt.score}/{attempt.totalQuestions} ({percentage}%)
                      </td>
                      <td className="p-4">
                        <StatusBadge status={passed ? "PASSED" : "FAILED"} />
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">{formatDate(attempt.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptySection icon={ClipboardCheck} title="No quiz attempts" description="Quiz performance will appear after this student completes an assessment." />
        )}
      </section>

      <section className="rounded-xl border bg-card shadow-sm">
        <div className="border-b p-4">
          <h2 className="text-lg font-semibold">Assignment Submissions</h2>
          <p className="text-sm text-muted-foreground">Submitted work, grades, feedback, and review status.</p>
        </div>
        {submissions.length ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="h-11 px-4 text-left text-xs font-medium uppercase tracking-widest text-muted-foreground">Assignment</th>
                  <th className="h-11 px-4 text-left text-xs font-medium uppercase tracking-widest text-muted-foreground">Course</th>
                  <th className="h-11 px-4 text-left text-xs font-medium uppercase tracking-widest text-muted-foreground">Submitted</th>
                  <th className="h-11 px-4 text-left text-xs font-medium uppercase tracking-widest text-muted-foreground">Grade</th>
                  <th className="h-11 px-4 text-left text-xs font-medium uppercase tracking-widest text-muted-foreground">Feedback</th>
                  <th className="h-11 px-4 text-left text-xs font-medium uppercase tracking-widest text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission) => (
                  <tr key={submission.id} className="border-b transition-colors last:border-0 hover:bg-muted/30">
                    <td className="p-4 font-medium">{submission.assignment.title}</td>
                    <td className="p-4 text-sm text-muted-foreground">{submission.assignment.course.title}</td>
                    <td className="p-4 text-sm text-muted-foreground">{formatDate(submission.createdAt)}</td>
                    <td className="p-4 text-sm tabular-nums">{submission.grade ?? "Ungraded"}</td>
                    <td className="max-w-xs p-4 text-sm text-muted-foreground">{submission.feedback || "No feedback yet"}</td>
                    <td className="p-4">
                      <StatusBadge status={submission.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptySection icon={BookOpen} title="No submissions" description="Assignment submissions will appear here once this student turns in work." />
        )}
      </section>

      <Dialog open={messageOpen} onOpenChange={setMessageOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Send Message</DialogTitle>
            <DialogDescription>Compose a message to {student.name}. This opens your email client with the draft.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient</Label>
              <Input id="recipient" value={student.email} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" value={messageSubject} onChange={(event) => setMessageSubject(event.target.value)} placeholder="Checking in on your course progress" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={messageBody}
                onChange={(event) => setMessageBody(event.target.value)}
                placeholder="Write a short, helpful note..."
                className="min-h-32 resize-y"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMessageOpen(false)}>
              Cancel
            </Button>
            <Button className="gap-2" disabled={!messageSubject.trim() || !messageBody.trim()} onClick={sendMessage}>
              <Send className="h-4 w-4" /> Open Draft
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
