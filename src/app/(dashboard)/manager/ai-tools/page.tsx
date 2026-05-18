"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle2,
  Clipboard,
  FileText,
  GraduationCap,
  Loader2,
  Save,
  Sparkles,
  Target,
  Wand2,
} from "lucide-react";
import { Loading } from "@/components/shared/Loading";
import { ErrorState } from "@/components/shared/ErrorState";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  useAnalyzeInstructorEngagement,
  useCourseLessons,
  useCreateCourse,
  useGenerateCourseOutline,
  useGenerateInstructorQuiz,
  useGenerateLessonDescription,
  useMyCourses,
  useUpdateLesson,
} from "@/hooks/useInstructorData";
import { useCategories } from "@/hooks/useCourses";
import { useAuth } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import type { Course, Lesson } from "@/types";

interface OutlineLesson {
  lessonNumber: number;
  title: string;
  duration: string;
  objectives: string[];
}

interface OutlineModule {
  moduleNumber: number;
  title: string;
  description: string;
  lessons: OutlineLesson[];
}

interface CourseOutline {
  courseTitle: string;
  courseDescription: string;
  learningObjectives: string[];
  modules: OutlineModule[];
  assessmentStrategy: string;
  prerequisites: string[];
  raw?: string;
  parseError?: boolean;
}

interface LessonDescriptionResult {
  description?: string;
  whatYouWillLearn?: string[];
  estimatedTime?: string;
  raw?: string;
  parseError?: boolean;
}

interface EngagementResult {
  overallEngagementScore?: number;
  summary?: string;
  courseInsights?: {
    courseTitle: string;
    engagementScore: number;
    insight: string;
    recommendation: string;
  }[];
  topRecommendations?: string[];
  atRiskAlert?: string;
  atRiskStudents?: {
    name?: string;
    email?: string;
    progress: number;
    course: string;
  }[];
  raw?: string;
  parseError?: boolean;
}

interface GeneratedQuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

interface GeneratedQuiz {
  quizTitle?: string;
  questions?: GeneratedQuizQuestion[];
  raw?: string;
  parseError?: boolean;
  savedQuiz?: { id: string; courseId: string };
}

function AIBadge() {
  return (
    <Badge className="gap-1 border-violet-200 bg-violet-500/10 text-violet-600 dark:border-violet-800">
      <Sparkles className="h-3 w-3" /> AI-Powered
    </Badge>
  );
}

function Panel({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description: string;
  icon: typeof Sparkles;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-muted p-2">
            <Icon className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <AIBadge />
      </div>
      {children}
    </section>
  );
}

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .slice(0, 70);
}

function getCourseList(data: { data: Course[] } | undefined) {
  return data?.data || [];
}

function ScoreRing({ score }: { score: number }) {
  const safeScore = Math.max(0, Math.min(100, score || 0));
  return (
    <div
      className="grid h-16 w-16 place-items-center rounded-full"
      style={{
        background: `conic-gradient(hsl(var(--primary)) ${safeScore * 3.6}deg, hsl(var(--muted)) 0deg)`,
      }}
    >
      <div className="grid h-12 w-12 place-items-center rounded-full bg-card">
        <span className="text-sm font-bold tabular-nums">{safeScore}</span>
      </div>
    </div>
  );
}

export default function AIStudioPage() {
  const router = useRouter();
  const { data: session, isPending: isAuthLoading } = useAuth();
  const { data: coursesData, isLoading: coursesLoading, isError: coursesError, refetch: refetchCourses } = useMyCourses();
  const { data: categoriesData } = useCategories();
  const createCourse = useCreateCourse();
  const updateLesson = useUpdateLesson();
  const outlineMutation = useGenerateCourseOutline();
  const descriptionMutation = useGenerateLessonDescription();
  const engagementMutation = useAnalyzeInstructorEngagement();
  const quizMutation = useGenerateInstructorQuiz();

  const [outlineForm, setOutlineForm] = useState({
    topic: "",
    targetAudience: "",
    durationWeeks: "8",
    level: "Beginner",
    categoryId: "",
  });
  const [descriptionForm, setDescriptionForm] = useState({
    lessonTitle: "",
    keyConcepts: "",
    courseId: "",
    lessonId: "",
  });
  const [quizForm, setQuizForm] = useState({
    topic: "",
    difficulty: "Medium" as "Easy" | "Medium" | "Hard",
    count: "10",
    courseId: "",
    attachToCourse: false,
  });

  useEffect(() => {
    if (!isAuthLoading && !session) {
      router.push("/auth/login");
    } else if (session && !["INSTRUCTOR", "MANAGER", "ADMIN"].includes((session.user as { role?: string }).role || "")) {
      router.push("/dashboard");
    }
  }, [session, isAuthLoading, router]);

  const courses = getCourseList(coursesData);
  const selectedDescriptionCourseId = descriptionForm.courseId;
  const { data: selectedLessonsData } = useCourseLessons(selectedDescriptionCourseId);
  const selectedLessons = useMemo(() => (selectedLessonsData?.data || []) as Lesson[], [selectedLessonsData?.data]);
  const categories = categoriesData?.data || [];
  const outline = outlineMutation.data?.data as CourseOutline | undefined;
  const lessonDescription = descriptionMutation.data?.data as LessonDescriptionResult | undefined;
  const engagement = engagementMutation.data?.data as EngagementResult | undefined;
  const generatedQuiz = quizMutation.data?.data as GeneratedQuiz | undefined;

  const selectedLesson = useMemo(
    () => selectedLessons.find((lesson) => lesson.id === descriptionForm.lessonId),
    [selectedLessons, descriptionForm.lessonId]
  );

  const saveOutlineAsDraft = async () => {
    if (!outline || outline.parseError || !outlineForm.categoryId) return;

    const lessons = outline.modules.flatMap((module) =>
      module.lessons.map((lesson) => ({
        title: lesson.title,
        duration: lesson.duration,
        content: [
          `# ${lesson.title}`,
          "",
          module.description,
          "",
          "## Learning Objectives",
          ...lesson.objectives.map((objective) => `- ${objective}`),
        ].join("\n"),
      }))
    );

    await createCourse.mutateAsync({
      title: outline.courseTitle,
      slug: `${createSlug(outline.courseTitle)}-${Date.now()}`,
      description: outline.courseDescription,
      price: 0,
      level: outlineForm.level,
      categoryId: outlineForm.categoryId,
      duration: `${outlineForm.durationWeeks} weeks`,
      lessons,
    });
  };

  const applyDescriptionToLesson = async () => {
    if (!selectedLesson || !lessonDescription?.description) return;

    const content = [
      lessonDescription.description,
      "",
      "## What you will learn",
      ...(lessonDescription.whatYouWillLearn || []).map((item) => `- ${item}`),
    ].join("\n");

    await updateLesson.mutateAsync({
      id: selectedLesson.id,
      payload: {
        title: selectedLesson.title,
        content,
        duration: lessonDescription.estimatedTime || selectedLesson.duration,
      },
    });
  };

  if (isAuthLoading || coursesLoading) return <Loading />;
  if (coursesError) return <ErrorState onRetry={() => refetchCourses()} />;

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <div className="mb-4 h-1.5 w-32 rounded-full bg-gradient-to-r from-violet-500 to-purple-600" />
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">AI Studio</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Generate instructional assets, improve lessons, analyze engagement, and build quizzes.
            </p>
          </div>
          <AIBadge />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Course Outline Generator" description="Turn a topic into modules, lessons, objectives, and assessments." icon={GraduationCap}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Course topic</Label>
              <Input value={outlineForm.topic} onChange={(event) => setOutlineForm({ ...outlineForm, topic: event.target.value })} placeholder="Product analytics" />
            </div>
            <div className="space-y-2">
              <Label>Target audience</Label>
              <Input value={outlineForm.targetAudience} onChange={(event) => setOutlineForm({ ...outlineForm, targetAudience: event.target.value })} placeholder="Early-career PMs" />
            </div>
            <div className="space-y-2">
              <Label>Duration (weeks)</Label>
              <Input type="number" min={1} max={52} value={outlineForm.durationWeeks} onChange={(event) => setOutlineForm({ ...outlineForm, durationWeeks: event.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Skill level</Label>
              <Select value={outlineForm.level} onValueChange={(value) => setOutlineForm({ ...outlineForm, level: value || "Beginner" })}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Select level" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Button
              className="gap-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:opacity-90"
              disabled={!outlineForm.topic || !outlineForm.targetAudience || outlineMutation.isPending}
              onClick={() => outlineMutation.mutate({
                topic: outlineForm.topic,
                targetAudience: outlineForm.targetAudience,
                durationWeeks: Number(outlineForm.durationWeeks) || 8,
                level: outlineForm.level,
              })}
            >
              {outlineMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Generate Outline
            </Button>
            {outline && !outline.parseError && (
              <Select value={outlineForm.categoryId} onValueChange={(value) => setOutlineForm({ ...outlineForm, categoryId: value || "" })}>
                <SelectTrigger className="w-full sm:w-56"><SelectValue placeholder="Draft category" /></SelectTrigger>
                <SelectContent>
                  {categories.map((category: { id: string; name: string }) => (
                    <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {outlineMutation.isPending && (
            <div className="mt-6 space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          )}

          {outline?.parseError && (
            <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
              The model returned text that could not be parsed as JSON. Try a narrower topic.
            </div>
          )}

          {outline && !outline.parseError && (
            <div className="mt-6 space-y-4">
              <div className="rounded-xl border bg-muted/30 p-4">
                <h3 className="text-lg font-semibold">{outline.courseTitle}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{outline.courseDescription}</p>
              </div>
              <Accordion className="rounded-xl border">
                {outline.modules.map((module) => (
                  <AccordionItem key={module.moduleNumber} value={`module-${module.moduleNumber}`} className="px-4">
                    <AccordionTrigger>
                      <span>Module {module.moduleNumber}: {module.title}</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-4 text-sm text-muted-foreground">{module.description}</p>
                      <div className="space-y-3">
                        {module.lessons.map((lesson) => (
                          <div key={`${module.moduleNumber}-${lesson.lessonNumber}`} className="rounded-lg border bg-card p-3">
                            <p className="font-medium">{lesson.lessonNumber}. {lesson.title}</p>
                            <p className="mt-1 text-xs text-muted-foreground">{lesson.duration}</p>
                            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                              {lesson.objectives.map((objective) => <li key={objective}>{objective}</li>)}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              <Button className="gap-2" disabled={!outlineForm.categoryId || createCourse.isPending} onClick={saveOutlineAsDraft}>
                {createCourse.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save as Draft Course
              </Button>
            </div>
          )}
        </Panel>

        <Panel title="Lesson Description Writer" description="Create polished lesson copy from a title and key concepts." icon={FileText}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Lesson title</Label>
              <Input value={descriptionForm.lessonTitle} onChange={(event) => setDescriptionForm({ ...descriptionForm, lessonTitle: event.target.value })} placeholder="Activation metrics and retention" />
            </div>
            <div className="space-y-2">
              <Label>Key concepts</Label>
              <Textarea value={descriptionForm.keyConcepts} onChange={(event) => setDescriptionForm({ ...descriptionForm, keyConcepts: event.target.value })} placeholder="cohort analysis, north star metrics, retention curves" className="min-h-24" />
            </div>
            <Button
              className="gap-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:opacity-90"
              disabled={!descriptionForm.lessonTitle || !descriptionForm.keyConcepts || descriptionMutation.isPending}
              onClick={() => descriptionMutation.mutate({ lessonTitle: descriptionForm.lessonTitle, keyConcepts: descriptionForm.keyConcepts })}
            >
              {descriptionMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Write Description
            </Button>
          </div>

          {descriptionMutation.isPending && (
            <div className="mt-6 space-y-3">
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-10 w-2/3" />
            </div>
          )}

          {lessonDescription && (
            <div className="mt-6 space-y-4 rounded-xl border bg-muted/20 p-4">
              <p className="text-sm leading-6 text-muted-foreground">{lessonDescription.description || lessonDescription.raw}</p>
              {lessonDescription.whatYouWillLearn?.length ? (
                <ul className="list-disc space-y-1 pl-5 text-sm">
                  {lessonDescription.whatYouWillLearn.map((item) => <li key={item}>{item}</li>)}
                </ul>
              ) : null}
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button type="button" variant="outline" className="gap-2" onClick={() => navigator.clipboard.writeText(lessonDescription.description || lessonDescription.raw || "")}>
                  <Clipboard className="h-4 w-4" /> Copy
                </Button>
                <Select value={descriptionForm.courseId} onValueChange={(value) => setDescriptionForm({ ...descriptionForm, courseId: value || "", lessonId: "" })}>
                  <SelectTrigger className="w-full sm:w-56"><SelectValue placeholder="Select course" /></SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => <SelectItem key={course.id} value={course.id}>{course.title}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={descriptionForm.lessonId} onValueChange={(value) => setDescriptionForm({ ...descriptionForm, lessonId: value || "" })}>
                  <SelectTrigger className="w-full sm:w-56"><SelectValue placeholder="Select lesson" /></SelectTrigger>
                  <SelectContent>
                    {selectedLessons.map((lesson) => <SelectItem key={lesson.id} value={lesson.id}>{lesson.title}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Button type="button" disabled={!descriptionForm.lessonId || updateLesson.isPending} onClick={applyDescriptionToLesson}>
                  {updateLesson.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply to Lesson"}
                </Button>
              </div>
            </div>
          )}
        </Panel>

        <Panel title="Student Engagement Analyzer" description="Find weak spots and at-risk students across your courses." icon={Target}>
          <Button
            className="gap-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:opacity-90"
            disabled={engagementMutation.isPending}
            onClick={() => engagementMutation.mutate()}
          >
            {engagementMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Analyze My Courses
          </Button>

          {engagementMutation.isPending && (
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
            </div>
          )}

          {engagement && (
            <div className="mt-6 space-y-5">
              <div className="flex flex-col gap-4 rounded-xl border bg-muted/20 p-4 sm:flex-row sm:items-center">
                <ScoreRing score={engagement.overallEngagementScore || 0} />
                <div>
                  <p className="text-lg font-semibold">Overall engagement score</p>
                  <p className="mt-1 text-sm text-muted-foreground">{engagement.summary || engagement.raw}</p>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {engagement.courseInsights?.map((insight) => (
                  <div key={insight.courseTitle} className="rounded-xl border bg-card p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <p className="font-semibold">{insight.courseTitle}</p>
                      <ScoreRing score={insight.engagementScore} />
                    </div>
                    <p className="text-sm text-muted-foreground">{insight.insight}</p>
                    <p className="mt-2 text-sm font-medium">{insight.recommendation}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border bg-card">
                <div className="border-b p-4">
                  <h3 className="text-lg font-semibold">Flagged Students</h3>
                  <p className="text-sm text-muted-foreground">{engagement.atRiskAlert || "Students under 20% progress."}</p>
                </div>
                {engagement.atRiskStudents?.length ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/40">
                          <th className="h-11 px-4 text-left text-xs font-medium uppercase tracking-widest text-muted-foreground">Student</th>
                          <th className="h-11 px-4 text-left text-xs font-medium uppercase tracking-widest text-muted-foreground">Course</th>
                          <th className="h-11 px-4 text-left text-xs font-medium uppercase tracking-widest text-muted-foreground">Progress</th>
                        </tr>
                      </thead>
                      <tbody>
                        {engagement.atRiskStudents.map((student) => (
                          <tr key={`${student.email}-${student.course}`} className="border-b last:border-0">
                            <td className="p-4">
                              <p className="font-medium">{student.name || "Student"}</p>
                              <p className="text-xs text-muted-foreground">{student.email}</p>
                            </td>
                            <td className="p-4 text-sm">{student.course}</td>
                            <td className="p-4 text-sm tabular-nums">{student.progress}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-4 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" /> No at-risk students found.
                  </div>
                )}
              </div>
            </div>
          )}
        </Panel>

        <Panel title="Quiz Generator" description="Generate assessment questions and optionally attach them to a course." icon={Wand2}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label>Topic</Label>
              <Input value={quizForm.topic} onChange={(event) => setQuizForm({ ...quizForm, topic: event.target.value })} placeholder="React state management" />
            </div>
            <div className="space-y-2">
              <Label>Difficulty</Label>
              <Select value={quizForm.difficulty} onValueChange={(value) => setQuizForm({ ...quizForm, difficulty: (value || "Medium") as "Easy" | "Medium" | "Hard" })}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Question count</Label>
              <Input type="number" min={5} max={20} value={quizForm.count} onChange={(event) => setQuizForm({ ...quizForm, count: event.target.value })} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Attach to course</Label>
              <Select value={quizForm.courseId} onValueChange={(value) => setQuizForm({ ...quizForm, courseId: value || "", attachToCourse: Boolean(value) })}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Keep unattached or select a course" /></SelectTrigger>
                <SelectContent>
                  {courses.map((course) => <SelectItem key={course.id} value={course.id}>{course.title}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            className="mt-4 gap-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:opacity-90"
            disabled={!quizForm.topic || quizMutation.isPending}
            onClick={() => quizMutation.mutate({
              topic: quizForm.topic,
              difficulty: quizForm.difficulty,
              count: Math.min(Math.max(Number(quizForm.count) || 5, 5), 20),
              courseId: quizForm.courseId || undefined,
              saveToDb: Boolean(quizForm.courseId),
            })}
          >
            {quizMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Generate Quiz
          </Button>

          {quizMutation.isPending && (
            <div className="mt-6 space-y-3">
              <Skeleton className="h-12" />
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
            </div>
          )}

          {generatedQuiz && (
            <div className="mt-6 space-y-4">
              <div className="rounded-xl border bg-muted/20 p-4">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="text-lg font-semibold">{generatedQuiz.quizTitle || "Generated Quiz"}</h3>
                    {generatedQuiz.savedQuiz && <p className="mt-1 text-sm text-muted-foreground">Attached to selected course.</p>}
                  </div>
                  {generatedQuiz.savedQuiz && (
                    <Badge className="gap-1 border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300">
                      <CheckCircle2 className="h-3 w-3" /> Saved
                    </Badge>
                  )}
                </div>
              </div>
              {generatedQuiz.parseError ? (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
                  <AlertTriangle className="mr-2 inline h-4 w-4" /> The model returned text that could not be parsed. Try generating again.
                </div>
              ) : (
                <div className="space-y-3">
                  {generatedQuiz.questions?.map((question, index) => (
                    <div key={`${question.question}-${index}`} className="rounded-xl border bg-card p-4">
                      <p className="font-semibold">{index + 1}. {question.question}</p>
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        {question.options.map((option) => (
                          <div key={option} className={cn("rounded-lg border p-2 text-sm", option === question.correctAnswer && "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300")}>
                            {option}
                          </div>
                        ))}
                      </div>
                      {question.explanation && <p className="mt-3 text-sm text-muted-foreground">{question.explanation}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}
