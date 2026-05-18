import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { ApiResponse, Course, Enrollment, Lesson, Review, User } from '@/types';
import { toast } from 'sonner';

// =============================================
// TYPES
// =============================================

export interface InstructorStats {
  totalCourses: number;
  totalStudents: number;
  avgRating: number;
  totalReviews: number;
  totalRevenue: number;
  comparisons?: {
    revenue: { currentMonth: number; lastMonth: number };
    students: { currentMonth: number; lastMonth: number };
    reviews: { currentMonth: number; lastMonth: number };
    rating: { currentMonth: number; lastMonth: number };
  };
  atRiskCount?: number;
  onboarding?: {
    hasProfile: boolean;
    hasCourse: boolean;
    hasAIExplored: boolean;
  };
}

export interface CoursePerformance {
  id: string;
  title: string;
  enrollments: number;
  rating: number;
}

export interface InstructorDashboardData {
  courses: Course[];
  recentReviews: Review[];
  recentEnrollments: Enrollment[];
  stats: InstructorStats;
  coursePerformance: CoursePerformance[];
  charts: {
    monthlyEnrollments: { month: string; count: number }[];
    ratingDistribution: { name: string; count: number }[];
    completionRates: { name: string; rate: number }[];
  };
}

export interface LessonPayload {
  title: string;
  slug?: string;
  content?: string;
  videoUrl?: string;
  duration?: string;
  order?: number;
  courseId?: string;
  isFree?: boolean;
  isPublished?: boolean;
  resources?: { title: string; url: string }[];
}

export interface QuizQuestionPayload {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface InstructorQuiz {
  id: string;
  title: string;
  description?: string;
  courseId: string;
  questions?: QuizQuestionPayload[];
  attempts?: {
    score: number;
    totalQuestions: number;
    userId: string;
    createdAt: string;
  }[];
  _count?: { questions?: number; attempts?: number };
  createdAt: string;
  updatedAt: string;
}

export interface QuizPayload {
  title: string;
  description?: string;
  courseId: string;
  questions: QuizQuestionPayload[];
}

export interface QuizResults {
  id: string;
  title: string;
  attempts: {
    id: string;
    score: number;
    totalQuestions: number;
    status: string;
    createdAt: string;
    user: Pick<User, 'id' | 'name' | 'email' | 'image'>;
  }[];
  _count: { questions: number; attempts: number };
}

export interface InstructorEarningsData {
  stats: {
    totalGross: number;
    totalNet: number;
    thisMonthGross: number;
    thisMonthNet: number;
    pendingPayouts: number;
    platformFeePercent: number;
  };
  monthlyEarnings: { month: string; gross: number; net: number }[];
  courseEarnings: {
    title: string;
    price: number;
    students: number;
    gross: number;
    fee: number;
    net: number;
    status: string;
  }[];
  recentTransactions: {
    studentName: string;
    studentEmail: string;
    courseTitle: string;
    amount: number;
    date: string;
    status: string;
  }[];
}

export interface StudentProgressDetail {
  student: Pick<User, 'id' | 'name' | 'email' | 'image'> & { createdAt: string };
  summary: {
    totalCourses: number;
    averageProgress: number;
    quizzesTaken: number;
    assignmentsSubmitted: number;
  };
  enrollments: Array<Enrollment & {
    updatedAt: string;
    course: Enrollment['course'] & {
      completionCriteria?: number;
      thumbnailUrl?: string;
    };
    lessonProgress: {
      id: string;
      isCompleted: boolean;
      completedAt?: string;
      lesson: Pick<Lesson, 'id' | 'title' | 'order' | 'duration'>;
    }[];
  }>;
  quizAttempts: {
    id: string;
    score: number;
    totalQuestions: number;
    status: string;
    createdAt: string;
    quiz: { title: string; course: { title: string } };
  }[];
  submissions: {
    id: string;
    grade?: number;
    feedback?: string;
    status: string;
    createdAt: string;
    assignment: { title: string; course: { title: string } };
  }[];
}

export interface InstructorProfilePayload {
  displayName?: string;
  name?: string;
  bio?: string;
  expertise?: string[];
  websiteUrl?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;
  avatarUrl?: string;
  avatarPublicId?: string;
  headline?: string;
  location?: string;
  isPublic?: boolean;
}

export interface AIQuizGenerationPayload {
  topic: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  count?: number;
  courseId?: string;
  saveToDb?: boolean;
}

export interface CourseOutlinePayload {
  topic: string;
  targetAudience: string;
  durationWeeks?: number;
  level?: string;
}

export interface LessonDescriptionPayload {
  lessonTitle: string;
  keyConcepts: string;
}

// =============================================
// HOOKS
// =============================================

export const useInstructorDashboard = () => {
  return useQuery({
    queryKey: ['instructor-dashboard'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<InstructorDashboardData>>('/dashboard/instructor');
      return data;
    },
  });
};

export const useMyCourses = () => {
  return useQuery({
    queryKey: ['my-courses'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Course[]>>('/courses/my-courses');
      return data;
    },
  });
};

export const useCourseDetails = (id: string) => {
  return useQuery({
    queryKey: ['course-details', id],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Course>>(`/courses/details/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await api.post<ApiResponse<Course>>('/courses', payload);
      return data;
    },
    onSuccess: () => {
      toast.success('Course created successfully!');
      queryClient.invalidateQueries({ queryKey: ['my-courses'] });
      queryClient.invalidateQueries({ queryKey: ['instructor-dashboard'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create course');
    },
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
      const { data } = await api.patch<ApiResponse<Course>>(`/courses/${id}`, payload);
      return data;
    },
    onSuccess: (response) => {
      toast.success('Course updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['my-courses'] });
      queryClient.invalidateQueries({ queryKey: ['course-details', response.data.id] });
      queryClient.invalidateQueries({ queryKey: ['instructor-dashboard'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update course');
    },
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete<ApiResponse<Course>>(`/courses/${id}`);
      return data;
    },
    onSuccess: () => {
      toast.success('Course archived successfully!');
      queryClient.invalidateQueries({ queryKey: ['my-courses'] });
      queryClient.invalidateQueries({ queryKey: ['instructor-dashboard'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete course');
    },
  });
};

// =============================================
// LESSONS
// =============================================

export const useCourseLessons = (courseId: string) => {
  return useQuery({
    queryKey: ['course-lessons', courseId],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Course>>(`/courses/details/${courseId}`);
      return {
        ...data,
        data: data.data.lessons || [],
      } as ApiResponse<Lesson[]>;
    },
    enabled: !!courseId,
  });
};

export const useSubmitCourseForReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.patch<ApiResponse<Course>>(`/courses/${id}/submit-review`);
      return data;
    },
    onSuccess: (response) => {
      toast.success('Course submitted for review!');
      queryClient.invalidateQueries({ queryKey: ['my-courses'] });
      queryClient.invalidateQueries({ queryKey: ['course-details', response.data.id] });
      queryClient.invalidateQueries({ queryKey: ['instructor-dashboard'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit course for review');
    },
  });
};

export const useCreateLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: LessonPayload & { courseId: string; order: number }) => {
      const { data } = await api.post<ApiResponse<Lesson>>('/lessons', payload);
      return data;
    },
    onSuccess: (response) => {
      toast.success('Lesson added successfully!');
      queryClient.invalidateQueries({ queryKey: ['course-lessons', response.data.courseId] });
      queryClient.invalidateQueries({ queryKey: ['course-details', response.data.courseId] });
      queryClient.invalidateQueries({ queryKey: ['my-courses'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add lesson');
    },
  });
};

export const useUpdateLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload, full = true }: { id: string; payload: LessonPayload; full?: boolean }) => {
      const endpoint = full ? `/lessons/${id}/full` : `/lessons/${id}`;
      const { data } = await api.patch<ApiResponse<Lesson>>(endpoint, payload);
      return data;
    },
    onSuccess: (response) => {
      toast.success('Lesson updated!');
      queryClient.invalidateQueries({ queryKey: ['course-lessons', response.data.courseId] });
      queryClient.invalidateQueries({ queryKey: ['course-details', response.data.courseId] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update lesson');
    },
  });
};

export const useReorderLessons = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ courseId, lessonIds }: { courseId: string; lessonIds: string[] }) => {
      const { data } = await api.patch<ApiResponse<Lesson[]>>('/lessons/reorder', { courseId, lessonIds });
      return data;
    },
    onSuccess: (_response, variables) => {
      toast.success('Lesson order saved!');
      queryClient.invalidateQueries({ queryKey: ['course-lessons', variables.courseId] });
      queryClient.invalidateQueries({ queryKey: ['course-details', variables.courseId] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to reorder lessons');
    },
  });
};

export const useDeleteLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete<ApiResponse<Lesson>>(`/lessons/${id}`);
      return data;
    },
    onSuccess: (response) => {
      toast.success('Lesson removed');
      if (response.data?.courseId) {
        queryClient.invalidateQueries({ queryKey: ['course-lessons', response.data.courseId] });
        queryClient.invalidateQueries({ queryKey: ['course-details', response.data.courseId] });
      }
      queryClient.invalidateQueries({ queryKey: ['course-details'] });
      queryClient.invalidateQueries({ queryKey: ['my-courses'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to remove lesson');
    },
  });
};

// =============================================
// QUIZZES
// =============================================

export const useCourseQuizzes = (courseId: string) => {
  return useQuery({
    queryKey: ['course-quizzes', courseId],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<InstructorQuiz[]>>(`/quizzes/course/${courseId}`);
      return data;
    },
    enabled: !!courseId,
  });
};

export const useCreateQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: QuizPayload) => {
      const { data } = await api.post<ApiResponse<InstructorQuiz>>('/quizzes', payload);
      return data;
    },
    onSuccess: (response) => {
      toast.success('Quiz created successfully!');
      queryClient.invalidateQueries({ queryKey: ['course-quizzes', response.data.courseId] });
      queryClient.invalidateQueries({ queryKey: ['course-details', response.data.courseId] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create quiz');
    },
  });
};

export const useUpdateQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<QuizPayload> }) => {
      const { data } = await api.patch<ApiResponse<InstructorQuiz>>(`/quizzes/${id}`, payload);
      return data;
    },
    onSuccess: (response) => {
      toast.success('Quiz updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['course-quizzes', response.data.courseId] });
      queryClient.invalidateQueries({ queryKey: ['quiz-results', response.data.id] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update quiz');
    },
  });
};

export const useDeleteQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete<ApiResponse<InstructorQuiz>>(`/quizzes/${id}`);
      return data;
    },
    onSuccess: (response) => {
      toast.success('Quiz deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['course-quizzes', response.data.courseId] });
      queryClient.invalidateQueries({ queryKey: ['course-details', response.data.courseId] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete quiz');
    },
  });
};

export const useQuizResults = (quizId: string) => {
  return useQuery({
    queryKey: ['quiz-results', quizId],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<QuizResults>>(`/quizzes/${quizId}/results`);
      return data;
    },
    enabled: !!quizId,
  });
};

// =============================================
// AI INSTRUCTOR TOOLS
// =============================================

export const useGenerateCourseOutline = () => {
  return useMutation({
    mutationFn: async (payload: CourseOutlinePayload) => {
      const { data } = await api.post<ApiResponse<any>>('/ai/instructor/generate-outline', payload);
      return data;
    },
    onSuccess: () => {
      toast.success('Course outline generated!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to generate outline');
    },
  });
};

export const useGenerateLessonDescription = () => {
  return useMutation({
    mutationFn: async (payload: LessonDescriptionPayload) => {
      const { data } = await api.post<ApiResponse<any>>('/ai/instructor/generate-lesson-description', payload);
      return data;
    },
    onSuccess: () => {
      toast.success('Lesson description generated!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to generate lesson description');
    },
  });
};

export const useAnalyzeInstructorEngagement = () => {
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.get<ApiResponse<any>>('/ai/instructor/engagement-analysis');
      return data;
    },
    onSuccess: () => {
      toast.success('Engagement analysis complete!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to analyze engagement');
    },
  });
};

export const useGenerateInstructorQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AIQuizGenerationPayload) => {
      const { data } = await api.post<ApiResponse<any>>('/ai/instructor/generate-quiz', payload);
      return data;
    },
    onSuccess: (response, variables) => {
      toast.success('Quiz generated!');
      if (variables.courseId && variables.saveToDb) {
        queryClient.invalidateQueries({ queryKey: ['course-quizzes', variables.courseId] });
        queryClient.invalidateQueries({ queryKey: ['course-details', variables.courseId] });
      }
      if (response.data?.savedQuiz?.courseId) {
        queryClient.invalidateQueries({ queryKey: ['course-quizzes', response.data.savedQuiz.courseId] });
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to generate quiz');
    },
  });
};

// =============================================
// EARNINGS
// =============================================

export const useInstructorEarnings = () => {
  return useQuery({
    queryKey: ['instructor-earnings'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<InstructorEarningsData>>('/dashboard/instructor/earnings');
      return data;
    },
  });
};

// =============================================
// ASSIGNMENTS
// =============================================

export interface InstructorAssignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  courseId: string;
  course: { title: string };
  _count: { submissions: number };
  pendingCount: number;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  student: { id: string; name: string; email: string };
  content?: string;
  fileUrl?: string;
  grade?: number;
  feedback?: string;
  status: 'PENDING' | 'GRADED';
  createdAt: string;
  updatedAt: string;
}

export const useInstructorAssignments = () => {
  return useQuery({
    queryKey: ['instructor-assignments'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<InstructorAssignment[]>>('/assignments/instructor');
      return data;
    },
  });
};

export const useAssignmentSubmissions = (assignmentId: string) => {
  return useQuery({
    queryKey: ['assignment-submissions', assignmentId],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Submission[]>>(`/assignments/submissions/${assignmentId}`);
      return data;
    },
    enabled: !!assignmentId,
  });
};

export const useGradeSubmission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: { grade: number; feedback?: string } }) => {
      const { data } = await api.patch<ApiResponse<Submission>>(`/assignments/grade/${id}`, payload);
      return data;
    },
    onSuccess: (response) => {
      toast.success('Submission graded successfully!');
      queryClient.invalidateQueries({ queryKey: ['assignment-submissions', response.data.assignmentId] });
      queryClient.invalidateQueries({ queryKey: ['instructor-assignments'] });
    },
  });
};

// =============================================
// LIVE CLASSES (Manager)
// =============================================

export interface InstructorLiveClass {
  id: string;
  title: string;
  description?: string;
  meetingUrl: string;
  startTime: string;
  duration: number;
  courseId: string;
  course: { title: string; id: string };
  createdAt: string;
  updatedAt: string;
}

export const useInstructorLiveClasses = () => {
  return useQuery({
    queryKey: ['instructor-live-classes'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<InstructorLiveClass[]>>('/classes/user');
      return data;
    },
  });
};

export const useCreateLiveClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      title: string;
      description?: string;
      meetingUrl: string;
      startTime: string;
      duration: number;
      courseId: string;
    }) => {
      const { data } = await api.post<ApiResponse<InstructorLiveClass>>('/classes', payload);
      return data;
    },
    onSuccess: () => {
      toast.success('Live class scheduled!');
      queryClient.invalidateQueries({ queryKey: ['instructor-live-classes'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to schedule live class');
    },
  });
};

export const useUpdateLiveClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<InstructorLiveClass> }) => {
      const { data } = await api.patch<ApiResponse<InstructorLiveClass>>(`/classes/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      toast.success('Live class updated!');
      queryClient.invalidateQueries({ queryKey: ['instructor-live-classes'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update live class');
    },
  });
};

export const useDeleteLiveClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete<ApiResponse<any>>(`/classes/${id}`);
      return data;
    },
    onSuccess: () => {
      toast.success('Live class removed.');
      queryClient.invalidateQueries({ queryKey: ['instructor-live-classes'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to remove live class');
    },
  });
};

// =============================================
// STUDENTS
// =============================================

export interface InstructorStudent {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
    createdAt: string;
  };
  courseId: string;
  course: { title: string };
  progress: number;
  status: string;
  createdAt: string;
}

export const useInstructorStudents = () => {
  return useQuery({
    queryKey: ['instructor-students'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<InstructorStudent[]>>('/enrollments/instructor');
      return data;
    },
  });
};

export const useStudentProgressDetail = (studentId: string) => {
  return useQuery({
    queryKey: ['student-progress-detail', studentId],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<StudentProgressDetail>>(`/users/student/${studentId}/progress`);
      return data;
    },
    enabled: !!studentId,
  });
};

// =============================================
// PROFILE & ANNOUNCEMENTS
// =============================================

export const useUpdateInstructorProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: InstructorProfilePayload) => {
      const { data } = await api.patch<ApiResponse<any>>('/users/instructor-profile', payload);
      return data;
    },
    onSuccess: () => {
      toast.success('Instructor profile saved!');
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      queryClient.invalidateQueries({ queryKey: ['instructor-dashboard'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to save instructor profile');
    },
  });
};

export const useSendCourseAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { courseId: string; title: string; message: string }) => {
      const { data } = await api.post<ApiResponse<{ sent: number }>>('/notifications/announcement', payload);
      return data;
    },
    onSuccess: (response) => {
      toast.success(`Announcement sent to ${response.data.sent} students`);
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to send announcement');
    },
  });
};
