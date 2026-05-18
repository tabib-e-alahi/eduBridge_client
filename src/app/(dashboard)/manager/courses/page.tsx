"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Archive,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Edit,
  ExternalLink,
  Eye,
  FileText,
  Filter,
  LayoutGrid,
  List,
  Loader2,
  MoreVertical,
  Plus,
  Search,
  Star,
  Users,
  XCircle,
} from "lucide-react";
import { Loading } from "@/components/shared/Loading";
import { ErrorState } from "@/components/shared/ErrorState";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDeleteCourse, useMyCourses, useSubmitCourseForReview, useUpdateCourse } from "@/hooks/useInstructorData";
import { useAuth } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import type { Course } from "@/types";

type CourseStatus = "DRAFT" | "IN_REVIEW" | "PUBLISHED" | "REJECTED" | "ARCHIVED" | "PENDING";

type ManagedCourse = Course & {
  status?: CourseStatus;
  rejectionReason?: string | null;
  adminFeedback?: string | null;
  _count?: Course["_count"] & {
    enrollments?: number;
    reviews?: number;
    lessons?: number;
  };
};

const statusCopy: Record<CourseStatus, { label: string; description: string; className: string; icon: typeof BookOpen }> = {
  DRAFT: {
    label: "Draft",
    description: "Still being prepared",
    className: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-300",
    icon: FileText,
  },
  IN_REVIEW: {
    label: "In Review",
    description: "Quality review in progress",
    className: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-300",
    icon: Clock3,
  },
  PUBLISHED: {
    label: "Published",
    description: "Live for students",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300",
    icon: CheckCircle2,
  },
  REJECTED: {
    label: "Rejected",
    description: "Needs revision",
    className: "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300",
    icon: XCircle,
  },
  ARCHIVED: {
    label: "Archived",
    description: "Removed from active catalog",
    className: "border-border bg-muted text-muted-foreground",
    icon: Archive,
  },
  PENDING: {
    label: "Pending",
    description: "Awaiting review",
    className: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-300",
    icon: Clock3,
  },
};

function getStatus(course: ManagedCourse): CourseStatus {
  return course.status || "DRAFT";
}

function getLessonCount(course: ManagedCourse) {
  return course._count?.lessons ?? course.lessons?.length ?? 0;
}

function getChecklist(course: ManagedCourse) {
  return [
    {
      key: "title",
      label: "Has title and description",
      done: Boolean(course.title?.trim() && course.description?.trim()),
      href: `/manager/courses/edit/${course.id}`,
    },
    {
      key: "lessons",
      label: "Has at least 1 lesson",
      done: getLessonCount(course) > 0,
      href: `/manager/courses/${course.id}/lessons`,
    },
    {
      key: "thumbnail",
      label: "Has thumbnail",
      done: Boolean(course.thumbnailUrl),
      href: `/manager/courses/edit/${course.id}`,
    },
    {
      key: "category",
      label: "Has category",
      done: Boolean(course.category?.id || course.category?.name),
      href: `/manager/courses/edit/${course.id}`,
    },
  ];
}

function canSubmit(course: ManagedCourse) {
  return getChecklist(course).every((item) => item.done);
}

function getMostCommonStatus(courses: ManagedCourse[]) {
  if (!courses.length) return "DRAFT" as CourseStatus;

  const counts = courses.reduce<Record<string, number>>((acc, course) => {
    const status = getStatus(course);
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0] as CourseStatus;
}

function StatusBadge({ status }: { status: CourseStatus }) {
  const copy = statusCopy[status] || statusCopy.DRAFT;

  return (
    <Badge variant="outline" className={cn("gap-1 rounded-md", copy.className)}>
      <copy.icon className="h-3 w-3" />
      {copy.label}
    </Badge>
  );
}

function StatCard({
  label,
  value,
  active,
  onClick,
  icon: Icon,
}: {
  label: string;
  value: number;
  active: boolean;
  onClick: () => void;
  icon: typeof BookOpen;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-xl border bg-card p-6 text-left shadow-sm transition-all hover:shadow-md",
        active && "border-primary ring-2 ring-primary/15"
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</p>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <p className="text-2xl font-bold tabular-nums">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">Click to filter</p>
    </button>
  );
}

function Pipeline({ currentStatus }: { currentStatus: CourseStatus }) {
  const statusForPipeline = currentStatus === "REJECTED" ? "REJECTED" : currentStatus;

  return (
    <section className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="mb-5 flex flex-col justify-between gap-2 md:flex-row md:items-center">
        <div>
          <h2 className="text-lg font-semibold">Approval Pipeline</h2>
          <p className="text-sm text-muted-foreground">Most common current state across your course catalog.</p>
        </div>
        <StatusBadge status={currentStatus} />
      </div>
      <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
        {["DRAFT", "IN_REVIEW", statusForPipeline === "REJECTED" ? "REJECTED" : "PUBLISHED"].map((status, index, items) => {
          const typedStatus = status as CourseStatus;
          const copy = statusCopy[typedStatus];
          const isActive = typedStatus === currentStatus;

          return (
            <div key={status} className={cn(index % 2 === 1 && "hidden md:grid md:place-items-center")}>
              {index % 2 === 1 ? (
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              ) : (
                <div
                  className={cn(
                    "rounded-xl border bg-muted/20 p-4 transition-colors",
                    isActive && "border-primary bg-primary/5 ring-2 ring-primary/10"
                  )}
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Step {Math.floor(index / 2) + 1}</p>
                    <copy.icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                  </div>
                  <p className="font-semibold">{copy.label}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{copy.description}</p>
                </div>
              )}
              {index < items.length - 1 && index % 2 === 0 ? <span className="sr-only">Next</span> : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function CourseThumbnail({ course }: { course: ManagedCourse }) {
  return (
    <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-lg border bg-muted">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={course.thumbnailUrl || "/no_image.jpg"}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        alt=""
      />
    </div>
  );
}

export default function InstructorCoursesPage() {
  const { data: session, isPending: isAuthLoading } = useAuth();
  const router = useRouter();
  const { data: coursesData, isLoading, isError, refetch } = useMyCourses();
  const deleteMutation = useDeleteCourse();
  const updateMutation = useUpdateCourse();
  const submitMutation = useSubmitCourseForReview();

  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [statusFilter, setStatusFilter] = useState<CourseStatus | "ALL">("ALL");
  const [submitTarget, setSubmitTarget] = useState<ManagedCourse | null>(null);
  const [feedbackTarget, setFeedbackTarget] = useState<ManagedCourse | null>(null);

  useEffect(() => {
    if (!isAuthLoading && !session) {
      router.push("/auth/login");
    } else if (session && !["INSTRUCTOR", "MANAGER", "ADMIN"].includes((session.user as { role?: string }).role || "")) {
      router.push("/dashboard");
    }
  }, [session, isAuthLoading, router]);

  const courses = useMemo(() => ((coursesData?.data || []) as ManagedCourse[]), [coursesData?.data]);
  const counts = useMemo(
    () => ({
      DRAFT: courses.filter((course) => getStatus(course) === "DRAFT").length,
      IN_REVIEW: courses.filter((course) => getStatus(course) === "IN_REVIEW" || getStatus(course) === "PENDING").length,
      PUBLISHED: courses.filter((course) => getStatus(course) === "PUBLISHED").length,
      REJECTED: courses.filter((course) => getStatus(course) === "REJECTED").length,
    }),
    [courses]
  );
  const mostCommonStatus = getMostCommonStatus(courses);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
      const courseStatus = getStatus(course);
      const matchesStatus =
        statusFilter === "ALL" ||
        courseStatus === statusFilter ||
        (statusFilter === "IN_REVIEW" && courseStatus === "PENDING");
      return matchesSearch && matchesStatus;
    });
  }, [courses, searchTerm, statusFilter]);

  const handleSubmitForReview = async () => {
    if (!submitTarget) return;
    await submitMutation.mutateAsync(submitTarget.id);
    setSubmitTarget(null);
  };

  const handleResubmitRejected = async () => {
    if (!feedbackTarget) return;

    await updateMutation.mutateAsync({ id: feedbackTarget.id, payload: { status: "DRAFT" } });
    setFeedbackTarget(null);
    setSubmitTarget({ ...feedbackTarget, status: "DRAFT" });
  };

  if (isLoading || isAuthLoading) return <Loading />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-10">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage curriculum, approval status, and publication readiness.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild className="gap-2">
            <Link href="/manager/courses/create">
              <Plus className="h-4 w-4" /> Create Course
            </Link>
          </Button>
        </div>
      </div>

      <Pipeline currentStatus={mostCommonStatus} />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Drafts" value={counts.DRAFT} active={statusFilter === "DRAFT"} onClick={() => setStatusFilter("DRAFT")} icon={FileText} />
        <StatCard label="In Review" value={counts.IN_REVIEW} active={statusFilter === "IN_REVIEW"} onClick={() => setStatusFilter("IN_REVIEW")} icon={Clock3} />
        <StatCard label="Published" value={counts.PUBLISHED} active={statusFilter === "PUBLISHED"} onClick={() => setStatusFilter("PUBLISHED")} icon={CheckCircle2} />
        <StatCard label="Rejected" value={counts.REJECTED} active={statusFilter === "REJECTED"} onClick={() => setStatusFilter("REJECTED")} icon={XCircle} />
      </div>

      <div className="flex flex-col items-center justify-between gap-4 rounded-xl border bg-card p-4 shadow-sm md:flex-row">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Filter by title or keywords..."
            className="h-11 pl-10"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
        <div className="flex w-full items-center gap-3 md:w-auto">
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter((value || "ALL") as CourseStatus | "ALL")}>
            <SelectTrigger className="h-11 w-full md:w-44">
              <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="IN_REVIEW">In Review</SelectItem>
              <SelectItem value="PUBLISHED">Published</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
              <SelectItem value="ARCHIVED">Archived</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex h-11 shrink-0 items-center rounded-lg border bg-muted/20 p-1">
            <Button variant={viewMode === "list" ? "secondary" : "ghost"} size="icon" className="h-9 w-9" onClick={() => setViewMode("list")}>
              <List className="h-4 w-4" />
              <span className="sr-only">List view</span>
            </Button>
            <Button variant={viewMode === "grid" ? "secondary" : "ghost"} size="icon" className="h-9 w-9" onClick={() => setViewMode("grid")}>
              <LayoutGrid className="h-4 w-4" />
              <span className="sr-only">Grid view</span>
            </Button>
          </div>
        </div>
      </div>

      {viewMode === "list" ? (
        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="h-11 px-4 text-left text-xs font-medium uppercase tracking-widest text-muted-foreground">Course</th>
                  <th className="h-11 px-4 text-left text-xs font-medium uppercase tracking-widest text-muted-foreground">Audience</th>
                  <th className="h-11 px-4 text-left text-xs font-medium uppercase tracking-widest text-muted-foreground">Pricing</th>
                  <th className="h-11 px-4 text-left text-xs font-medium uppercase tracking-widest text-muted-foreground">Performance</th>
                  <th className="h-11 px-4 text-left text-xs font-medium uppercase tracking-widest text-muted-foreground">State</th>
                  <th className="h-11 px-4 text-right text-xs font-medium uppercase tracking-widest text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.map((course) => {
                  const status = getStatus(course);
                  return (
                    <tr key={course.id} className="group border-b transition-colors last:border-0 hover:bg-muted/30">
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          <CourseThumbnail course={course} />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold transition-colors group-hover:text-primary">{course.title}</p>
                            <p className="mt-0.5 text-xs text-muted-foreground">{course.category?.name || "Uncategorized"} · {course.level}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Users className="h-4 w-4 text-primary" />
                          <span>{course._count?.enrollments || 0} students</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm font-semibold text-emerald-600">${course.price.toFixed(2)}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-amber-500">
                          <Star className="h-4 w-4 fill-current" />
                          <span>{(course._count?.reviews || 0) > 0 ? (course.rating || 0).toFixed(1) : "0.0"}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <StatusBadge status={status} />
                      </td>
                      <td className="p-4 text-right">
                        <CourseActions
                          course={course}
                          onSubmit={() => setSubmitTarget(course)}
                          onFeedback={() => setFeedbackTarget(course)}
                          onArchive={() => deleteMutation.mutate(course.id)}
                          isSubmitting={submitMutation.isPending || updateMutation.isPending}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => {
            const status = getStatus(course);
            return (
              <article key={course.id} className="group overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-md">
                <div className="relative aspect-video overflow-hidden bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={course.thumbnailUrl || "/no_image.jpg"} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" alt="" />
                  <div className="absolute right-4 top-4">
                    <StatusBadge status={status} />
                  </div>
                </div>
                <div className="space-y-4 p-6">
                  <div>
                    <h2 className="line-clamp-1 text-lg font-semibold transition-colors group-hover:text-primary">{course.title}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{course.category?.name || "Uncategorized"} · {course.level}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 border-y py-3 text-sm">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Students</p>
                      <p className="mt-1 font-semibold tabular-nums">{course._count?.enrollments || 0}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Lessons</p>
                      <p className="mt-1 font-semibold tabular-nums">{getLessonCount(course)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Price</p>
                      <p className="mt-1 font-semibold text-emerald-600">${course.price.toFixed(0)}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" asChild className="gap-2">
                      <Link href={`/manager/courses/edit/${course.id}`}>
                        <Edit className="h-4 w-4" /> Edit
                      </Link>
                    </Button>
                    {status === "DRAFT" && (
                      <Button size="sm" className="gap-2" onClick={() => setSubmitTarget(course)}>
                        <CheckCircle2 className="h-4 w-4" /> Submit
                      </Button>
                    )}
                    {status === "IN_REVIEW" || status === "PENDING" ? (
                      <Button size="sm" variant="outline" disabled className="gap-2">
                        <Clock3 className="h-4 w-4" /> Under Review
                      </Button>
                    ) : null}
                    {status === "PUBLISHED" && (
                      <Button size="sm" asChild className="gap-2">
                        <Link href={`/learn/${course.slug}`} target="_blank">
                          <ExternalLink className="h-4 w-4" /> View Live
                        </Link>
                      </Button>
                    )}
                    {status === "REJECTED" && (
                      <Button size="sm" variant="outline" className="gap-2" onClick={() => setFeedbackTarget(course)}>
                        <AlertTriangle className="h-4 w-4" /> Feedback
                      </Button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {filteredCourses.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card py-16 text-center">
          <div className="mb-4 rounded-full bg-muted p-4">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-lg font-semibold">No courses found</h3>
          <p className="mb-6 max-w-sm text-sm text-muted-foreground">Create your first course or adjust the current filters to find a specific curriculum asset.</p>
          <Button asChild className="gap-2">
            <Link href="/manager/courses/create">
              Create Course <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}

      <AlertDialog open={!!submitTarget} onOpenChange={(open) => !open && setSubmitTarget(null)}>
        <AlertDialogContent className="sm:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Submit for review?</AlertDialogTitle>
            <AlertDialogDescription>
              EduBridge will review {submitTarget?.title} before it can become visible to students.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {submitTarget && (
            <div className="space-y-3">
              {getChecklist(submitTarget).map((item) => (
                <Link key={item.key} href={item.href} className="flex items-center justify-between gap-3 rounded-lg border bg-muted/20 p-3 transition-colors hover:bg-muted">
                  <span className="flex items-center gap-3 text-sm font-medium">
                    <span
                      className={cn(
                        "flex h-5 w-5 items-center justify-center rounded-full border",
                        item.done ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground text-muted-foreground"
                      )}
                    >
                      {item.done ? <Check className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                    </span>
                    {item.label}
                  </span>
                  {!item.done && <span className="text-xs text-primary">Fix</span>}
                </Link>
              ))}
              {!canSubmit(submitTarget) && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
                  Complete the missing checklist items before submitting this course.
                </div>
              )}
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={!submitTarget || !canSubmit(submitTarget) || submitMutation.isPending} onClick={handleSubmitForReview} className="gap-2">
              {submitMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              Submit for Review
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!feedbackTarget} onOpenChange={(open) => !open && setFeedbackTarget(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Review Feedback</DialogTitle>
            <DialogDescription>{feedbackTarget?.title} needs revision before it can be resubmitted.</DialogDescription>
          </DialogHeader>
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/30 dark:text-red-200">
            {feedbackTarget?.rejectionReason || feedbackTarget?.adminFeedback || "No detailed reviewer note is available yet. Review the course checklist, update missing material, then resubmit for another review."}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFeedbackTarget(null)}>
              Close
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/manager/courses/edit/${feedbackTarget?.id || ""}`}>Edit Course</Link>
            </Button>
            <Button className="gap-2" disabled={updateMutation.isPending} onClick={handleResubmitRejected}>
              {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              Resubmit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CourseActions({
  course,
  onSubmit,
  onFeedback,
  onArchive,
  isSubmitting,
}: {
  course: ManagedCourse;
  onSubmit: () => void;
  onFeedback: () => void;
  onArchive: () => void;
  isSubmitting: boolean;
}) {
  const status = getStatus(course);

  return (
    <div className="flex items-center justify-end gap-2">
      {status === "DRAFT" && (
        <Button type="button" size="sm" className="gap-2" onClick={onSubmit} disabled={isSubmitting}>
          <CheckCircle2 className="h-4 w-4" /> Submit for Review
        </Button>
      )}
      {status === "IN_REVIEW" || status === "PENDING" ? (
        <Button type="button" size="sm" variant="outline" disabled className="gap-2">
          <Clock3 className="h-4 w-4" /> Under Review · 2-3 days
        </Button>
      ) : null}
      {status === "PUBLISHED" && (
        <Button type="button" size="sm" asChild className="gap-2">
          <Link href={`/learn/${course.slug}`} target="_blank">
            <ExternalLink className="h-4 w-4" /> View Live
          </Link>
        </Button>
      )}
      {status === "REJECTED" && (
        <Button type="button" size="sm" variant="outline" className="gap-2" onClick={onFeedback}>
          <AlertTriangle className="h-4 w-4" /> View Feedback
        </Button>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <MoreVertical className="h-5 w-5" />
            <span className="sr-only">Course actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 p-2">
          <DropdownMenuLabel className="px-2 py-1.5 text-xs uppercase tracking-widest text-muted-foreground">Management</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/manager/courses/edit/${course.id}`} className="flex cursor-pointer items-center gap-2">
              <Edit className="h-4 w-4" /> Edit Curriculum
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/manager/courses/${course.id}/lessons`} className="flex cursor-pointer items-center gap-2">
              <BookOpen className="h-4 w-4" /> Manage Lessons
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/learn/${course.slug}`} target="_blank" className="flex cursor-pointer items-center gap-2">
              <Eye className="h-4 w-4" /> Preview Student View
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer gap-2 text-destructive focus:text-destructive" onClick={onArchive}>
            <Archive className="h-4 w-4" /> Archive Course
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
