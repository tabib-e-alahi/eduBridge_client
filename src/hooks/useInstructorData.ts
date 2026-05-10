import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { ApiResponse, Course, Enrollment, Review } from '@/types';
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
  };
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
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<Course> }) => {
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

export const useCreateLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await api.post<ApiResponse<any>>('/lessons', payload);
      return data;
    },
    onSuccess: (response) => {
      toast.success('Lesson added successfully!');
      queryClient.invalidateQueries({ queryKey: ['course-details', response.data.courseId] });
    },
  });
};

export const useUpdateLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
      const { data } = await api.patch<ApiResponse<any>>(`/lessons/${id}`, payload);
      return data;
    },
    onSuccess: (response) => {
      toast.success('Lesson updated!');
      queryClient.invalidateQueries({ queryKey: ['course-details', response.data.courseId] });
    },
  });
};

export const useDeleteLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete<ApiResponse<any>>(`/lessons/${id}`);
      return data;
    },
    onSuccess: (response) => {
      toast.success('Lesson removed');
      queryClient.invalidateQueries({ queryKey: ['course-details'] });
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
