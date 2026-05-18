"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, type UseFormReturn } from "react-hook-form";
import { z } from "zod";
import {
  ArrowLeft,
  BarChart3,
  Calendar,
  ClipboardList,
  Edit3,
  Eye,
  HelpCircle,
  Loader2,
  Plus,
  Save,
  Sparkles,
  Trash2,
  Users,
  X,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  useCourseDetails,
  useCourseQuizzes,
  useCreateQuiz,
  useDeleteQuiz,
  useGenerateInstructorQuiz,
  useQuizResults,
  useUpdateQuiz,
  type InstructorQuiz,
  type QuizPayload,
} from "@/hooks/useInstructorData";
import { useAuth } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const optionSchema = z.object({
  value: z.string().min(1, "Option is required"),
});

const questionSchema = z.object({
  question: z.string().min(1, "Question text is required"),
  options: z.array(optionSchema).length(4),
  correctIndex: z.string().min(1, "Select a correct answer"),
  explanation: z.string().optional(),
});

const quizFormSchema = z.object({
  title: z.string().min(1, "Quiz title is required"),
  description: z.string().optional(),
  questions: z.array(questionSchema).min(1, "Add at least one question"),
});

const aiFormSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  count: z.number().min(5).max(20),
});

type QuizFormValues = z.infer<typeof quizFormSchema>;
type AIFormValues = z.infer<typeof aiFormSchema>;

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
}

const optionLabels = ["A", "B", "C", "D"];

function getParamValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value || "";
}

function defaultQuestion(): QuizFormValues["questions"][number] {
  return {
    question: "",
    options: [{ value: "" }, { value: "" }, { value: "" }, { value: "" }],
    correctIndex: "0",
    explanation: "",
  };
}

function emptyQuizForm(): QuizFormValues {
  return {
    title: "",
    description: "",
    questions: [defaultQuestion()],
  };
}

function normalizeQuestionOptions(options: unknown): string[] {
  if (Array.isArray(options)) {
    return options.map((option) => String(option));
  }

  return ["", "", "", ""];
}

function quizToFormValues(quiz: InstructorQuiz): QuizFormValues {
  return {
    title: quiz.title,
    description: quiz.description || "",
    questions: quiz.questions?.length
      ? quiz.questions.map((question) => {
          const options = normalizeQuestionOptions(question.options).slice(0, 4);
          const paddedOptions = [...options, "", "", "", ""].slice(0, 4);
          const correctIndex = Math.max(0, paddedOptions.findIndex((option) => option === question.correctAnswer));

          return {
            question: question.question,
            options: paddedOptions.map((option) => ({ value: option })),
            correctIndex: String(correctIndex),
            explanation: question.explanation || "",
          };
        })
      : [defaultQuestion()],
  };
}

function generatedQuizToFormValues(generatedQuiz: GeneratedQuiz): QuizFormValues {
  return {
    title: generatedQuiz.quizTitle || "Generated Quiz",
    description: "",
    questions: generatedQuiz.questions?.length
      ? generatedQuiz.questions.map((question) => {
          const options = [...question.options, "", "", "", ""].slice(0, 4);
          const correctIndex = Math.max(0, options.findIndex((option) => option === question.correctAnswer));

          return {
            question: question.question,
            options: options.map((option) => ({ value: option })),
            correctIndex: String(correctIndex),
            explanation: question.explanation || "",
          };
        })
      : [defaultQuestion()],
  };
}

function formValuesToPayload(values: QuizFormValues, courseId: string): QuizPayload {
  return {
    title: values.title,
    description: values.description || undefined,
    courseId,
    questions: values.questions.map((question) => {
      const options = question.options.map((option) => option.value);
      const correctIndex = Number(question.correctIndex) || 0;

      return {
        question: question.question,
        options,
        correctAnswer: options[correctIndex],
        explanation: question.explanation || undefined,
      };
    }),
  };
}

function formatDate(value?: string) {
  if (!value) return "Not available";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function getQuestionCount(quiz: InstructorQuiz) {
  return quiz._count?.questions ?? quiz.questions?.length ?? 0;
}

function getAttemptCount(quiz: InstructorQuiz) {
  return quiz._count?.attempts ?? quiz.attempts?.length ?? 0;
}

function AIBadge() {
  return (
    <Badge className="gap-1 border-violet-200 bg-violet-500/10 text-violet-600 dark:border-violet-800">
      <Sparkles className="h-3 w-3" /> AI-Powered
    </Badge>
  );
}

function QuestionEditor({
  form,
  index,
  questionCount,
  onRemove,
}: {
  form: UseFormReturn<QuizFormValues>;
  index: number;
  questionCount: number;
  onRemove: () => void;
}) {
  const correctIndex = form.watch(`questions.${index}.correctIndex`);

  return (
    <div className="rounded-xl border bg-muted/20 p-4">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Question {index + 1}</p>
          <p className="mt-1 text-sm text-muted-foreground">Write the prompt, four answers, and an optional explanation.</p>
        </div>
        <Button type="button" variant="outline" size="icon" disabled={questionCount === 1} onClick={onRemove}>
          <X className="h-4 w-4" />
          <span className="sr-only">Remove question</span>
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`question-${index}`}>Question text</Label>
          <Textarea
            id={`question-${index}`}
            {...form.register(`questions.${index}.question`)}
            placeholder="What should students be able to answer?"
            className="min-h-24 resize-y"
          />
          {form.formState.errors.questions?.[index]?.question && (
            <p className="text-xs text-destructive">{form.formState.errors.questions[index]?.question?.message}</p>
          )}
        </div>

        <RadioGroup
          value={correctIndex}
          onValueChange={(value) => form.setValue(`questions.${index}.correctIndex`, value, { shouldValidate: true })}
          className="grid gap-3 md:grid-cols-2"
        >
          {optionLabels.map((label, optionIndex) => (
            <div
              key={`${index}-${label}`}
              className={cn(
                "grid gap-2 rounded-lg border bg-card p-3 transition-colors",
                correctIndex === String(optionIndex) && "border-primary bg-primary/5"
              )}
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value={String(optionIndex)} id={`question-${index}-option-${optionIndex}`} />
                <Label htmlFor={`question-${index}-option-${optionIndex}`} className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Option {label}
                </Label>
              </div>
              <Input {...form.register(`questions.${index}.options.${optionIndex}.value`)} placeholder={`Answer ${label}`} />
            </div>
          ))}
        </RadioGroup>

        <div className="space-y-2">
          <Label htmlFor={`explanation-${index}`}>Explanation</Label>
          <Textarea
            id={`explanation-${index}`}
            {...form.register(`questions.${index}.explanation`)}
            placeholder="Optional feedback shown after the attempt."
            className="min-h-20 resize-y"
          />
        </div>
      </div>
    </div>
  );
}

function EmptyQuizzes({ onCreate, onGenerate }: { onCreate: () => void; onGenerate: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border bg-card py-16 text-center shadow-sm">
      <div className="mb-4 rounded-full bg-muted p-4">
        <HelpCircle className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mb-2 text-lg font-semibold">No quizzes yet</h3>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">
        Add an assessment manually or generate a first draft with AI, then refine the questions before publishing.
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button onClick={onCreate} className="gap-2">
          <Plus className="h-4 w-4" /> Create Quiz
        </Button>
        <Button onClick={onGenerate} className="gap-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:opacity-90">
          <Sparkles className="h-4 w-4" /> Generate with AI
        </Button>
      </div>
    </div>
  );
}

export default function QuizBuilderPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = getParamValue(params.courseId);
  const { data: session, isPending: isAuthLoading } = useAuth();
  const { data: courseResponse, isLoading: isCourseLoading, isError: isCourseError, refetch: refetchCourse } = useCourseDetails(courseId);
  const { data: quizzesResponse, isLoading: isQuizzesLoading, isError: isQuizzesError, refetch: refetchQuizzes } = useCourseQuizzes(courseId);
  const createQuiz = useCreateQuiz();
  const updateQuiz = useUpdateQuiz();
  const deleteQuiz = useDeleteQuiz();
  const generateQuiz = useGenerateInstructorQuiz();

  const [quizDialogOpen, setQuizDialogOpen] = useState(false);
  const [aiDialogOpen, setAIDialogOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<InstructorQuiz | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<InstructorQuiz | null>(null);
  const [resultsQuiz, setResultsQuiz] = useState<InstructorQuiz | null>(null);
  const [aiDifficulty, setAIDifficulty] = useState<AIFormValues["difficulty"]>("Medium");

  const { data: resultsResponse, isLoading: isResultsLoading, isError: isResultsError, refetch: refetchResults } = useQuizResults(resultsQuiz?.id || "");

  const course = courseResponse?.data;
  const quizzes = useMemo(() => quizzesResponse?.data || [], [quizzesResponse?.data]);

  const quizForm = useForm<QuizFormValues>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: emptyQuizForm(),
  });

  const questionFields = useFieldArray({
    control: quizForm.control,
    name: "questions",
  });

  const aiForm = useForm<AIFormValues>({
    resolver: zodResolver(aiFormSchema),
    defaultValues: {
      topic: "",
      difficulty: "Medium",
      count: 10,
    },
  });

  useEffect(() => {
    if (!isAuthLoading && !session) {
      router.push("/auth/login");
    } else if (session && !["INSTRUCTOR", "MANAGER", "ADMIN"].includes((session.user as { role?: string }).role || "")) {
      router.push("/dashboard");
    }
  }, [session, isAuthLoading, router]);

  const isLoading = isAuthLoading || isCourseLoading || isQuizzesLoading;
  const isError = isCourseError || isQuizzesError;
  const isSaving = createQuiz.isPending || updateQuiz.isPending;

  const openCreateDialog = () => {
    setEditingQuiz(null);
    quizForm.reset(emptyQuizForm());
    setQuizDialogOpen(true);
  };

  const openEditDialog = (quiz: InstructorQuiz) => {
    setEditingQuiz(quiz);
    quizForm.reset(quizToFormValues(quiz));
    setQuizDialogOpen(true);
  };

  const submitQuiz = quizForm.handleSubmit(async (values) => {
    const payload = formValuesToPayload(values, courseId);

    if (editingQuiz) {
      await updateQuiz.mutateAsync({ id: editingQuiz.id, payload });
    } else {
      await createQuiz.mutateAsync(payload);
    }

    setQuizDialogOpen(false);
    setEditingQuiz(null);
    quizForm.reset(emptyQuizForm());
  });

  const submitAIGeneration = aiForm.handleSubmit(async (values) => {
    const response = await generateQuiz.mutateAsync({
      topic: values.topic,
      difficulty: values.difficulty,
      count: values.count,
      courseId,
      saveToDb: false,
    });

    const generatedQuiz = response.data as GeneratedQuiz;
    if (generatedQuiz?.parseError || !generatedQuiz?.questions?.length) return;

    setEditingQuiz(null);
    quizForm.reset(generatedQuizToFormValues(generatedQuiz));
    setAIDialogOpen(false);
    setQuizDialogOpen(true);
  });

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await deleteQuiz.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  };

  if (isLoading) return <Loading />;
  if (isError) {
    return (
      <ErrorState
        onRetry={() => {
          refetchCourse();
          refetchQuizzes();
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
          <h1 className="text-3xl font-bold tracking-tight">Quiz Builder</h1>
          <p className="mt-1 text-sm text-muted-foreground">Create assessments, generate drafts with AI, and review student outcomes.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button onClick={() => setAIDialogOpen(true)} className="gap-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:opacity-90">
            <Sparkles className="h-4 w-4" /> Generate with AI
          </Button>
          <Button onClick={openCreateDialog} className="gap-2">
            <Plus className="h-4 w-4" /> Create Quiz
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Quizzes</p>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold tabular-nums">{quizzes.length}</p>
          <p className="mt-1 text-xs text-muted-foreground">Assessments in this course</p>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Questions</p>
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold tabular-nums">{quizzes.reduce((sum, quiz) => sum + getQuestionCount(quiz), 0)}</p>
          <p className="mt-1 text-xs text-muted-foreground">Total question bank size</p>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Attempts</p>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold tabular-nums">{quizzes.reduce((sum, quiz) => sum + getAttemptCount(quiz), 0)}</p>
          <p className="mt-1 text-xs text-muted-foreground">Student submissions recorded</p>
        </div>
      </div>

      {isQuizzesLoading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-44 rounded-xl" />
          ))}
        </div>
      ) : quizzes.length === 0 ? (
        <EmptyQuizzes onCreate={openCreateDialog} onGenerate={() => setAIDialogOpen(true)} />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {quizzes.map((quiz) => (
            <article key={quiz.id} className="rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-semibold">{quiz.title}</h2>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{quiz.description || "No description added."}</p>
                </div>
                <Badge variant="secondary" className="shrink-0 rounded-md">
                  {getQuestionCount(quiz)} questions
                </Badge>
              </div>

              <div className="mt-5 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="tabular-nums">{getAttemptCount(quiz)} attempts</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(quiz.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>{getAttemptCount(quiz) ? "Results ready" : "No results yet"}</span>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => openEditDialog(quiz)}>
                  <Edit3 className="h-4 w-4" /> Edit
                </Button>
                <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => setDeleteTarget(quiz)}>
                  <Trash2 className="h-4 w-4" /> Delete
                </Button>
                <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => setResultsQuiz(quiz)}>
                  <Eye className="h-4 w-4" /> View Results
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}

      <Dialog open={quizDialogOpen} onOpenChange={setQuizDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>{editingQuiz ? "Edit Quiz" : "Create Quiz"}</DialogTitle>
            <DialogDescription>Build a quiz with four-option questions and a clear correct answer.</DialogDescription>
          </DialogHeader>

          <form onSubmit={submitQuiz} className="space-y-5">
            <div className="grid gap-4 md:grid-cols-[1fr_1.4fr]">
              <div className="space-y-2">
                <Label htmlFor="quiz-title">Quiz title</Label>
                <Input id="quiz-title" {...quizForm.register("title")} placeholder="Module 1 Knowledge Check" />
                {quizForm.formState.errors.title && <p className="text-xs text-destructive">{quizForm.formState.errors.title.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="quiz-description">Description</Label>
                <Input id="quiz-description" {...quizForm.register("description")} placeholder="Optional context for students" />
              </div>
            </div>

            <div className="space-y-4">
              {questionFields.fields.map((field, index) => (
                <QuestionEditor
                  key={field.id}
                  form={quizForm}
                  index={index}
                  questionCount={questionFields.fields.length}
                  onRemove={() => questionFields.remove(index)}
                />
              ))}
            </div>

            <Button type="button" variant="outline" className="gap-2" onClick={() => questionFields.append(defaultQuestion())}>
              <Plus className="h-4 w-4" /> Add Question
            </Button>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setQuizDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving} className="gap-2">
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {editingQuiz ? "Save Changes" : "Create Quiz"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={aiDialogOpen} onOpenChange={setAIDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="mb-2 flex items-center justify-between gap-3">
              <DialogTitle>Generate Quiz</DialogTitle>
              <AIBadge />
            </div>
            <DialogDescription>Draft quiz questions from a topic, then review and save them to this course.</DialogDescription>
          </DialogHeader>

          <form onSubmit={submitAIGeneration} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ai-topic">Topic</Label>
              <Input id="ai-topic" {...aiForm.register("topic")} placeholder="React component composition" />
              {aiForm.formState.errors.topic && <p className="text-xs text-destructive">{aiForm.formState.errors.topic.message}</p>}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Difficulty</Label>
                <Select
                  value={aiDifficulty}
                  onValueChange={(value) => {
                    const nextDifficulty = value as AIFormValues["difficulty"];
                    setAIDifficulty(nextDifficulty);
                    aiForm.setValue("difficulty", nextDifficulty, { shouldValidate: true });
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ai-count">Count</Label>
                <Input id="ai-count" type="number" min={5} max={20} {...aiForm.register("count", { valueAsNumber: true })} />
              </div>
            </div>

            {generateQuiz.isPending && (
              <div className="space-y-3 rounded-xl border bg-muted/20 p-4">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            )}

            {generateQuiz.data?.data?.parseError && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
                The model returned text that could not be parsed into quiz questions. Try a narrower topic.
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAIDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={generateQuiz.isPending} className="gap-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:opacity-90">
                {generateQuiz.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Generate
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!resultsQuiz} onOpenChange={(open) => !open && setResultsQuiz(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Quiz Results</DialogTitle>
            <DialogDescription>{resultsQuiz?.title} performance by student attempt.</DialogDescription>
          </DialogHeader>

          {isResultsLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : isResultsError ? (
            <ErrorState message="Could not load quiz results" onRetry={() => refetchResults()} />
          ) : resultsResponse?.data.attempts.length ? (
            <div className="rounded-xl border bg-card shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/40">
                      <th className="h-11 px-4 text-left text-xs font-medium uppercase tracking-widest text-muted-foreground">Student</th>
                      <th className="h-11 px-4 text-left text-xs font-medium uppercase tracking-widest text-muted-foreground">Score</th>
                      <th className="h-11 px-4 text-left text-xs font-medium uppercase tracking-widest text-muted-foreground">Result</th>
                      <th className="h-11 px-4 text-left text-xs font-medium uppercase tracking-widest text-muted-foreground">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultsResponse.data.attempts.map((attempt) => {
                      const percentage = attempt.totalQuestions ? Math.round((attempt.score / attempt.totalQuestions) * 100) : 0;
                      const passed = percentage >= 70 || attempt.status === "PASSED";

                      return (
                        <tr key={attempt.id} className="border-b transition-colors last:border-0 hover:bg-muted/30">
                          <td className="p-4">
                            <p className="font-medium">{attempt.user.name}</p>
                            <p className="text-xs text-muted-foreground">{attempt.user.email}</p>
                          </td>
                          <td className="p-4 text-sm tabular-nums">
                            {attempt.score}/{attempt.totalQuestions} ({percentage}%)
                          </td>
                          <td className="p-4">
                            <Badge
                              className={cn(
                                "rounded-md",
                                passed
                                  ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300"
                                  : "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300"
                              )}
                            >
                              {passed ? "Pass" : "Fail"}
                            </Badge>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">{formatDate(attempt.createdAt)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 rounded-full bg-muted p-4">
                <BarChart3 className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">No attempts yet</h3>
              <p className="max-w-sm text-sm text-muted-foreground">Student attempt data will appear here after learners complete this quiz.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete quiz?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes {deleteTarget?.title} and its questions. Existing attempt records may no longer have a quiz to reference.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={deleteQuiz.isPending} className="gap-2">
              {deleteQuiz.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
