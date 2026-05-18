"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import {
  ArrowLeft,
  BookOpen,
  Edit3,
  GripVertical,
  Link2,
  Loader2,
  Plus,
  Save,
  Trash2,
  Video,
  VideoOff,
  X,
} from "lucide-react";
import { Loading } from "@/components/shared/Loading";
import { ErrorState } from "@/components/shared/ErrorState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
import {
  useCourseDetails,
  useCourseLessons,
  useCreateLesson,
  useDeleteLesson,
  useReorderLessons,
  useUpdateLesson,
  type LessonPayload,
} from "@/hooks/useInstructorData";
import { useAuth } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import type { Lesson, LessonResource } from "@/types";

const lessonFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().optional(),
  videoUrl: z.string().optional(),
  duration: z.string().optional(),
  resources: z.array(
    z.object({
      title: z.string().min(1, "Resource title is required"),
      url: z.string().min(1, "Resource URL is required"),
    })
  ),
});

type LessonFormValues = z.infer<typeof lessonFormSchema>;

type ManagedLesson = Lesson & {
  isFree?: boolean;
  isPublished?: boolean;
  resources?: LessonResource[];
};

function getParamValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value || "";
}

function emptyFormValues(): LessonFormValues {
  return {
    title: "",
    content: "",
    videoUrl: "",
    duration: "",
    resources: [],
  };
}

function lessonToFormValues(lesson: ManagedLesson): LessonFormValues {
  return {
    title: lesson.title,
    content: lesson.content || "",
    videoUrl: lesson.videoUrl || "",
    duration: lesson.duration || "",
    resources: lesson.resources?.map((resource) => ({ title: resource.title, url: resource.url })) || [],
  };
}

function createSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}

interface SortableLessonCardProps {
  lesson: ManagedLesson;
  index: number;
  editingTitleId: string | null;
  editingTitle: string;
  isUpdating: boolean;
  onStartTitleEdit: (lesson: ManagedLesson) => void;
  onTitleChange: (value: string) => void;
  onTitleCommit: (lesson: ManagedLesson) => void;
  onEdit: (lesson: ManagedLesson) => void;
  onDelete: (lesson: ManagedLesson) => void;
}

function SortableLessonCard({
  lesson,
  index,
  editingTitleId,
  editingTitle,
  isUpdating,
  onStartTitleEdit,
  onTitleChange,
  onTitleCommit,
  onEdit,
  onDelete,
}: SortableLessonCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: lesson.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isTitleEditing = editingTitleId === lesson.id;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md",
        isDragging && "relative z-10 opacity-80 shadow-lg"
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <button
          type="button"
          aria-label="Drag lesson"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border bg-muted/40 text-muted-foreground transition-colors hover:bg-muted"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>

        <Badge variant="outline" className="h-7 min-w-9 justify-center rounded-md tabular-nums">
          {index + 1}
        </Badge>

        <div className="min-w-0 flex-1">
          {isTitleEditing ? (
            <Input
              value={editingTitle}
              onChange={(event) => onTitleChange(event.target.value)}
              onBlur={() => onTitleCommit(lesson)}
              onKeyDown={(event) => {
                if (event.key === "Enter") onTitleCommit(lesson);
                if (event.key === "Escape") onStartTitleEdit({ ...lesson, title: lesson.title });
              }}
              autoFocus
              className="h-9 font-semibold"
            />
          ) : (
            <button
              type="button"
              onClick={() => onStartTitleEdit(lesson)}
              className="max-w-full truncate text-left text-sm font-semibold transition-colors hover:text-primary"
            >
              {lesson.title}
            </button>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="rounded-md">
              {lesson.duration || "No duration"}
            </Badge>
            {lesson.videoUrl ? (
              <Badge variant="outline" className="gap-1 rounded-md text-emerald-600">
                <Video className="h-3 w-3" /> Video set
              </Badge>
            ) : (
              <Badge variant="outline" className="gap-1 rounded-md border-dashed text-muted-foreground">
                <VideoOff className="h-3 w-3" /> No video
              </Badge>
            )}
            {lesson.resources?.length ? (
              <Badge variant="outline" className="gap-1 rounded-md">
                <Link2 className="h-3 w-3" /> {lesson.resources.length} resources
              </Badge>
            ) : null}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 self-end sm:self-auto">
          <Button type="button" variant="outline" size="icon" onClick={() => onEdit(lesson)}>
            <Edit3 className="h-4 w-4" />
            <span className="sr-only">Edit lesson</span>
          </Button>
          <Button type="button" variant="outline" size="icon" onClick={() => onDelete(lesson)}>
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete lesson</span>
          </Button>
        </div>
      </div>
      {isUpdating && isTitleEditing && (
        <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin" /> Saving title
        </p>
      )}
    </div>
  );
}

export default function LessonManagerPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = getParamValue(params.courseId);
  const { data: session, isPending: isAuthLoading } = useAuth();
  const { data: courseResponse, isLoading: isCourseLoading, isError: isCourseError, refetch: refetchCourse } = useCourseDetails(courseId);
  const { data: lessonsResponse, isLoading: isLessonsLoading, isError: isLessonsError, refetch: refetchLessons } = useCourseLessons(courseId);
  const createLesson = useCreateLesson();
  const updateLesson = useUpdateLesson();
  const deleteLesson = useDeleteLesson();
  const reorderLessons = useReorderLessons();

  const [optimisticLessonIds, setOptimisticLessonIds] = useState<string[] | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<ManagedLesson | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ManagedLesson | null>(null);
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const course = courseResponse?.data;
  const fetchedLessons = useMemo(
    () => ((lessonsResponse?.data || []) as ManagedLesson[]).slice().sort((a, b) => a.order - b.order),
    [lessonsResponse?.data]
  );
  const lessons = useMemo(() => {
    if (!optimisticLessonIds) return fetchedLessons;
    const lessonMap = new Map(fetchedLessons.map((lesson) => [lesson.id, lesson]));
    const orderedLessons = optimisticLessonIds
      .map((id) => lessonMap.get(id))
      .filter((lesson): lesson is ManagedLesson => Boolean(lesson));

    return orderedLessons.length === fetchedLessons.length ? orderedLessons : fetchedLessons;
  }, [fetchedLessons, optimisticLessonIds]);

  const form = useForm<LessonFormValues>({
    resolver: zodResolver(lessonFormSchema),
    defaultValues: emptyFormValues(),
  });

  const resources = useFieldArray({
    control: form.control,
    name: "resources",
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (!isAuthLoading && !session) {
      router.push("/auth/login");
    } else if (session && !["INSTRUCTOR", "MANAGER", "ADMIN"].includes((session.user as { role?: string }).role || "")) {
      router.push("/dashboard");
    }
  }, [session, isAuthLoading, router]);

  const isLoading = isAuthLoading || isCourseLoading || isLessonsLoading;
  const isError = isCourseError || isLessonsError;
  const isSaving = createLesson.isPending || updateLesson.isPending;

  const openCreateSheet = () => {
    setEditingLesson(null);
    form.reset(emptyFormValues());
    setSheetOpen(true);
  };

  const openEditSheet = (lesson: ManagedLesson) => {
    setEditingLesson(lesson);
    form.reset(lessonToFormValues(lesson));
    setSheetOpen(true);
  };

  const handleSubmit = form.handleSubmit(async (values) => {
    const payload: LessonPayload = {
      title: values.title,
      slug: createSlug(values.title),
      content: values.content || undefined,
      videoUrl: values.videoUrl || undefined,
      duration: values.duration || undefined,
      resources: values.resources,
    };

    if (editingLesson) {
      await updateLesson.mutateAsync({ id: editingLesson.id, payload });
    } else {
      await createLesson.mutateAsync({
        ...payload,
        courseId,
        order: lessons.length + 1,
      });
    }

    setSheetOpen(false);
    setEditingLesson(null);
    form.reset(emptyFormValues());
  });

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = lessons.findIndex((lesson) => lesson.id === active.id);
    const newIndex = lessons.findIndex((lesson) => lesson.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const nextLessons = arrayMove(lessons, oldIndex, newIndex).map((lesson, index) => ({
      ...lesson,
      order: index + 1,
    }));
    setOptimisticLessonIds(nextLessons.map((lesson) => lesson.id));

    try {
      await reorderLessons.mutateAsync({
        courseId,
        lessonIds: nextLessons.map((lesson) => lesson.id),
      });
    } catch {
      setOptimisticLessonIds(null);
    }
  };

  const commitInlineTitle = async (lesson: ManagedLesson) => {
    const title = editingTitle.trim();
    setEditingTitleId(null);
    if (!title || title === lesson.title) return;

    await updateLesson.mutateAsync({
      id: lesson.id,
      full: false,
      payload: { title, slug: createSlug(title) },
    });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await deleteLesson.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  };

  if (isLoading) return <Loading />;
  if (isError) {
    return (
      <ErrorState
        onRetry={() => {
          refetchCourse();
          refetchLessons();
        }}
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Link href="/manager/courses" className="inline-flex items-center gap-1 hover:text-foreground">
              <ArrowLeft className="h-3.5 w-3.5" /> Courses
            </Link>
            <span>/</span>
            <span className="truncate font-medium text-foreground">{course?.title || "Course"}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Lessons</h1>
          <p className="mt-1 text-sm text-muted-foreground">Create, edit, and reorder the curriculum for this course.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={openCreateSheet} className="gap-2">
            <Plus className="h-4 w-4" /> Add Lesson
          </Button>
        </div>
      </div>

      {reorderLessons.isPending && (
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Saving lesson order
          </div>
        </div>
      )}

      {isLessonsLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : lessons.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border bg-card py-16 text-center shadow-sm">
          <div className="mb-4 rounded-full bg-muted p-4">
            <BookOpen className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-lg font-semibold">No lessons yet</h3>
          <p className="mb-6 max-w-sm text-sm text-muted-foreground">
            Build the first unit of this course by adding a lesson with content, video, and helpful resources.
          </p>
          <Button onClick={openCreateSheet} className="gap-2">
            <Plus className="h-4 w-4" /> Add Lesson
          </Button>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={lessons.map((lesson) => lesson.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {lessons.map((lesson, index) => (
                <SortableLessonCard
                  key={lesson.id}
                  lesson={lesson}
                  index={index}
                  editingTitleId={editingTitleId}
                  editingTitle={editingTitle}
                  isUpdating={updateLesson.isPending}
                  onStartTitleEdit={(target) => {
                    setEditingTitleId(target.id);
                    setEditingTitle(target.title);
                  }}
                  onTitleChange={setEditingTitle}
                  onTitleCommit={commitInlineTitle}
                  onEdit={openEditSheet}
                  onDelete={setDeleteTarget}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-xl">
          <SheetHeader className="border-b">
            <SheetTitle>{editingLesson ? "Edit Lesson" : "Add Lesson"}</SheetTitle>
            <SheetDescription>Markdown content, video links, and resources are saved with the lesson.</SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSubmit} className="space-y-5 px-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...form.register("title")} placeholder="Lesson title" />
              {form.formState.errors.title && (
                <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Lesson Content (Markdown supported)</Label>
              <Textarea
                id="content"
                {...form.register("content")}
                placeholder="Write lesson notes, examples, and links using Markdown."
                className="min-h-40 resize-y"
              />
              <p className="text-xs text-muted-foreground">Use headings, lists, code fences, and links for structured reading material.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="videoUrl">Video URL</Label>
                <Input id="videoUrl" {...form.register("videoUrl")} placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input id="duration" {...form.register("duration")} placeholder="12:30" />
              </div>
            </div>

            <div className="rounded-xl border bg-muted/20 p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Resources</p>
                  <p className="mt-1 text-sm text-muted-foreground">Attach readings, downloads, or reference links.</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => resources.append({ title: "", url: "" })}
                >
                  <Plus className="h-4 w-4" /> Add
                </Button>
              </div>

              <div className="space-y-3">
                {resources.fields.length === 0 && (
                  <div className="rounded-lg border border-dashed bg-card p-4 text-sm text-muted-foreground">
                    No resources added.
                  </div>
                )}
                {resources.fields.map((field, index) => (
                  <div key={field.id} className="grid gap-2 rounded-lg border bg-card p-3 sm:grid-cols-[1fr_1fr_auto]">
                    <Input {...form.register(`resources.${index}.title`)} placeholder="Resource title" />
                    <Input {...form.register(`resources.${index}.url`)} placeholder="https://..." />
                    <Button type="button" variant="outline" size="icon" onClick={() => resources.remove(index)}>
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove resource</span>
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <SheetFooter className="border-t px-0">
              <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" onClick={() => setSheetOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving} className="gap-2">
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {editingLesson ? "Save Changes" : "Create Lesson"}
                </Button>
              </div>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete lesson?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes {deleteTarget?.title} from the course. Student progress linked to this lesson may also be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={deleteLesson.isPending} className="gap-2">
              {deleteLesson.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
