import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { ApiResponse } from '@/types';
import { toast } from 'sonner';

/**
 * @deprecated Use Assignment from useStudentData.ts instead
 */
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

/**
 * @deprecated Use AssignmentSubmission from useStudentData.ts instead
 */
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

/**
 * @deprecated Use hooks from useStudentData.ts instead
 */
export const useUserAssignments = () => {
  return useQuery({
    queryKey: ['user-assignments'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Assignment[]>>('/assignments/user');
      return data;
    },
  });
};

/**
 * @deprecated Use hooks from useStudentData.ts instead
 */
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

/**
 * @deprecated Use hooks from useInstructorData.ts instead
 */
export const useInstructorAssignments = () => {
  return useQuery({
    queryKey: ['instructor-assignments'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Assignment[]>>('/assignments/instructor');
      return data;
    },
  });
};

/**
 * @deprecated Use hooks from useInstructorData.ts instead
 */
export const useCourseAssignments = (courseId: string) => {
  return useQuery({
    queryKey: ['course-assignments', courseId],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Assignment[]>>(`/assignments/course/${courseId}`);
      return data;
    },
    enabled: !!courseId,
  });
};

/**
 * @deprecated Use hooks from useInstructorData.ts instead
 */
export const useCreateAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { title: string; description: string; dueDate: string; courseId: string; fileUrl?: string }) => {
      const { data } = await api.post<ApiResponse<Assignment>>('/assignments', payload);
      return data;
    },
    onSuccess: () => {
      toast.success('Assignment created successfully');
      queryClient.invalidateQueries({ queryKey: ['instructor-assignments'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create assignment');
    }
  });
};

/**
 * @deprecated Use hooks from useInstructorData.ts instead
 */
export const useAssignmentSubmissions = (assignmentId: string) => {
  return useQuery({
    queryKey: ['assignment-submissions', assignmentId],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<any[]>>(`/assignments/submissions/${assignmentId}`);
      return data;
    },
    enabled: !!assignmentId,
  });
};

/**
 * @deprecated Use hooks from useInstructorData.ts instead
 */
export const useGradeSubmission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string, payload: { grade: number; feedback: string } }) => {
      const { data } = await api.patch<ApiResponse<any>>(`/assignments/grade/${id}`, payload);
      return data;
    },
    onSuccess: (_, variables) => {
      toast.success('Submission graded successfully');
      queryClient.invalidateQueries({ queryKey: ['assignment-submissions'] });
      queryClient.invalidateQueries({ queryKey: ['instructor-assignments'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to grade submission');
    }
  });
};
