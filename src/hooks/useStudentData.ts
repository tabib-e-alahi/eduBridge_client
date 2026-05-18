import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { ApiResponse } from '@/types';
import { toast } from 'sonner';

// =============================================
// LIVE CLASSES
// =============================================
export interface LiveClass {
  id: string;
  title: string;
  description?: string;
  meetingUrl: string;
  startTime: string;
  duration: number; // minutes
  courseId: string;
  course: {
    title: string;
    instructor: { name: string };
  };
  createdAt: string;
}

export const useUserLiveClasses = () => {
  return useQuery({
    queryKey: ['user-live-classes'],
    queryFn: async () => {
      // Fetch classes for all enrolled courses
      const { data } = await api.get<ApiResponse<LiveClass[]>>('/classes/user');
      return data;
    },
  });
};

// =============================================
// ORDERS
// =============================================
export interface Order {
  id: string;
  courseId: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';
  paymentMethod?: string;
  transactionId?: string;
  course: {
    title: string;
    thumbnailUrl?: string;
  };
  payment?: {
    id: string;
    amount: number;
    status: string;
    method?: string;
  };
  createdAt: string;
}

export const useUserOrders = () => {
  return useQuery({
    queryKey: ['user-orders'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Order[]>>('/orders/my-orders');
      return data;
    },
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { courseId: string }) => {
      const { data } = await api.post<ApiResponse<Order>>('/orders/create', payload);
      return data;
    },
    onSuccess: () => {
      toast.success('Order created successfully');
      queryClient.invalidateQueries({ queryKey: ['user-orders'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create order');
    },
  });
};

export const useCheckout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { orderId: string; paymentMethod: string; transactionId?: string }) => {
      const { data } = await api.post<ApiResponse<any>>('/orders/checkout', payload);
      return data;
    },
    onSuccess: () => {
      toast.success('Payment processed successfully! You are now enrolled.');
      queryClient.invalidateQueries({ queryKey: ['user-orders'] });
      queryClient.invalidateQueries({ queryKey: ['user-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['my-enrollments'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Payment failed');
    },
  });
};

// =============================================
// MESSAGES
// =============================================
export interface MessageContact {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: string;
  lastMessage?: {
    content: string;
    createdAt: string;
    isRead: boolean;
  };
  unreadCount: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export const useConversations = () => {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<MessageContact[]>>('/messages/conversations');
      return data;
    },
  });
};

export const useChat = (otherUserId: string) => {
  return useQuery({
    queryKey: ['chat', otherUserId],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<ChatMessage[]>>(`/messages/chat/${otherUserId}`);
      return data;
    },
    enabled: !!otherUserId,
    refetchInterval: 5000, // Poll every 5s for new messages
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { receiverId: string; content: string }) => {
      const { data } = await api.post<ApiResponse<ChatMessage>>('/messages', payload);
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['chat', variables.receiverId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to send message');
    },
  });
};

// =============================================
// MENTORS
// =============================================
export interface Mentor {
  id: string;
  userId: string;
  expertise: string[];
  experienceYears: number;
  totalStudents: number;
  averageRating: number;
  bio: string;
  isFeatured: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
}

export const useMentors = () => {
  return useQuery({
    queryKey: ['mentors'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Mentor[]>>('/mentors');
      return data;
    },
  });
};

// =============================================
// NOTIFICATIONS
// =============================================
export interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  type: string;
  createdAt: string;
}

export const useNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Notification[]>>('/notifications');
      return data;
    },
    refetchInterval: 30000, // Poll every 30s
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const { data } = await api.patch<ApiResponse<any>>(`/notifications/${notificationId}/read`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

// =============================================
// QUIZ
// =============================================
export interface Quiz {
  id: string;
  title: string;
  description?: string;
  courseId: string;
  course: {
    title: string;
  };
  questions: QuizQuestion[];
  _count?: {
    questions: number;
    attempts: number;
  };
  createdAt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  score: number;
  totalQuestions: number;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  answers?: Record<string, string>;
  quiz: {
    title: string;
    course: { title: string };
  };
  createdAt: string;
}

export const useUserQuizzes = () => {
  return useQuery({
    queryKey: ['user-quizzes'],
    queryFn: async () => {
      // Fetch quizzes for all enrolled courses
      const { data } = await api.get<ApiResponse<Quiz[]>>('/enrollments/quizzes');
      return data;
    },
  });
};

export const useQuizDetails = (quizId: string) => {
  return useQuery({
    queryKey: ['quiz-details', quizId],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Quiz>>(`/enrollments/quizzes/${quizId}`);
      return data;
    },
    enabled: !!quizId,
  });
};

export const useQuizAttempts = () => {
  return useQuery({
    queryKey: ['quiz-attempts'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<QuizAttempt[]>>('/enrollments/quiz-attempts');
      return data;
    },
  });
};

export const useSubmitQuizAttempt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { quizId: string; answers: Record<string, string> }) => {
      const { data } = await api.post<ApiResponse<QuizAttempt>>(`/enrollments/quizzes/${payload.quizId}/submit`, {
        answers: payload.answers,
      });
      return data;
    },
    onSuccess: () => {
      toast.success('Quiz submitted successfully!');
      queryClient.invalidateQueries({ queryKey: ['quiz-attempts'] });
      queryClient.invalidateQueries({ queryKey: ['user-quizzes'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit quiz');
    },
  });
};

// =============================================
// ENROLLMENT ACTIONS
// =============================================
export const useEnrollInCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (courseId: string) => {
      const { data } = await api.post<ApiResponse<any>>('/enrollments/enroll', { courseId });
      return data;
    },
    onSuccess: () => {
      toast.success('Successfully enrolled!');
      queryClient.invalidateQueries({ queryKey: ['user-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['user-orders'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Enrollment failed');
    },
  });
};

export const useCourseProgress = (courseIdOrSlug: string) => {
  return useQuery({
    queryKey: ['course-progress', courseIdOrSlug],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<any>>(`/enrollments/course/${courseIdOrSlug}`);
      return data;
    },
    enabled: !!courseIdOrSlug,
  });
};

export const useUpdateProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { enrollmentId: string; lessonId: string; isCompleted: boolean; courseSlug?: string }) => {
      const { data } = await api.patch<ApiResponse<any>>(`/enrollments/${payload.enrollmentId}/progress`, {
        lessonId: payload.lessonId,
        isCompleted: payload.isCompleted,
      });
      return { data, courseSlug: payload.courseSlug };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['user-dashboard'] });
      if (result.courseSlug) {
        queryClient.invalidateQueries({ queryKey: ['course-progress', result.courseSlug] });
      }
    },
  });
};

// =============================================
// ASSIGNMENTS
// =============================================
export interface Assignment {
  id: string;
  title: string;
  description: string;
  fileUrl?: string;
  dueDate: string;
  courseId: string;
  createdAt: string;
  updatedAt: string;
  course: {
    title: string;
  };
  submissions: AssignmentSubmission[];
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  content?: string;
  fileUrl?: string;
  grade?: number;
  feedback?: string;
  status: string; // PENDING, GRADED
  createdAt: string;
  updatedAt: string;
}

export const useUserAssignments = () => {
  return useQuery({
    queryKey: ['user-assignments'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Assignment[]>>('/assignments/user');
      return data;
    },
  });
};

export const useSubmitAssignment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (payload: { assignmentId: string; content?: string; fileUrl?: string }) => {
      const { data } = await api.post<ApiResponse<any>>('/assignments/submit', payload);
      return data;
    },
    onSuccess: () => {
      toast.success('Assignment submitted successfully');
      queryClient.invalidateQueries({ queryKey: ['user-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['course-assignments'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit assignment');
    }
  });
};

// =============================================
// USER PROFILE
// =============================================
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: string;
  profile?: {
    bio?: string;
    headline?: string;
    skills: string[];
    location?: string;
    website?: string;
    linkedIn?: string;
    github?: string;
  };
}

export const useUserProfile = () => {
  return useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<UserProfile>>('/users/me');
      return data;
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Partial<UserProfile & { bio?: string; headline?: string }>) => {
      const { data } = await api.patch<ApiResponse<UserProfile>>('/users/me', payload);
      return data;
    },
    onSuccess: () => {
      toast.success('Profile updated successfully');
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    },
  });
};

// =============================================
// AI FEATURES
// =============================================
export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface AIConversation {
  id: string;
  title?: string;
  context?: string;
  messages: AIMessage[];
  createdAt: string;
  updatedAt: string;
}

export const useAIConversations = () => {
  return useQuery({
    queryKey: ['ai-conversations'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<AIConversation[]>>('/ai/conversations');
      return data;
    },
  });
};

export const useAIConversation = (id: string) => {
  return useQuery({
    queryKey: ['ai-conversation', id],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<AIConversation>>(`/ai/conversations/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useAIChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { message: string; conversationId?: string; courseContext?: string }) => {
      const { data } = await api.post<ApiResponse<{ answer: string; conversationId: string; suggestedNextQuestions: string[] }>>('/ai/chat', payload);
      return data;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['ai-conversations'] });
      if (result.data.conversationId) {
        queryClient.invalidateQueries({ queryKey: ['ai-conversation', result.data.conversationId] });
      }
    },
  });
};

export interface LearningPath {
  id: string;
  title: string;
  goal: string;
  steps: {
    roadmapTitle: string;
    estimatedDuration: string;
    phases: any[];
    weeklyPlan: any[];
    recommendedCourses: string[];
    finalAdvice: string;
  };
  createdAt: string;
}

export const useUserRoadmaps = () => {
  return useQuery({
    queryKey: ['user-roadmaps'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<LearningPath[]>>('/ai/learning-path/my');
      return data;
    },
  });
};

export const useGenerateRoadmap = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { goal: string; level: string; hoursPerWeek: string; learningStyle: string }) => {
      const { data } = await api.post<ApiResponse<LearningPath>>('/ai/learning-path', payload);
      return data;
    },
    onSuccess: () => {
      toast.success('AI Roadmap generated successfully!');
      queryClient.invalidateQueries({ queryKey: ['user-roadmaps'] });
    },
  });
};

// =============================================
// LEARNING SUMMARY (for overview stats)
// =============================================
export interface LearningSummary {
  totalCourses: number;
  completedCourses: number;
  averageProgress: number;
  recentEnrollments: Array<{
    id: string;
    progress: number;
    course: { title: string; thumbnailUrl?: string };
  }>;
}

export const useLearningSummary = () => {
  return useQuery({
    queryKey: ['learning-summary'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<LearningSummary>>('/enrollments/summary');
      return data;
    },
  });
};

// =============================================
// SAVED COURSES
// =============================================

export interface SavedCourse {
  id: string;
  courseId: string;
  userId: string;
  createdAt: string;
  course: {
    id: string;
    title: string;
    slug: string;
    thumbnailUrl?: string;
    price: number;
    level: string;
    category: { name: string };
    instructor: { name: string };
    _count: { enrollments: number; reviews: number };
  };
}

export const useMySavedCourses = () => {
  return useQuery({
    queryKey: ['my-saved-courses'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<SavedCourse[]>>('/courses/saved');
      return data;
    },
  });
};

export const useToggleSaveCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (courseId: string) => {
      const { data } = await api.post<ApiResponse<{ saved: boolean }>>('/courses/saved/toggle', { courseId });
      return data;
    },
    onSuccess: (result) => {
      const msg = result.data?.saved ? 'Course saved!' : 'Course removed from saved.';
      toast.success(msg);
      queryClient.invalidateQueries({ queryKey: ['my-saved-courses'] });
      queryClient.invalidateQueries({ queryKey: ['user-dashboard'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Action failed');
    },
  });
};
