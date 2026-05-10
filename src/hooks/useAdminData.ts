import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { ApiResponse } from '@/types';
import { toast } from 'sonner';

// =============================================
// TYPES
// =============================================

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'INSTRUCTOR' | 'MANAGER' | 'ADMIN';
  status: 'ACTIVE' | 'PENDING_APPROVAL' | 'BLOCKED';
  image?: string;
  createdAt: string;
  emailVerified: boolean;
}

// =============================================
// HOOKS
// =============================================

export const useAdminStudents = () => {
  return useQuery({
    queryKey: ['admin-students'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<AdminUser[]>>('/admin/students');
      return data;
    },
  });
};

export const useAdminInstructors = () => {
  return useQuery({
    queryKey: ['admin-instructors'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<AdminUser[]>>('/admin/instructors');
      return data;
    },
  });
};

export const usePendingInstructors = () => {
  return useQuery({
    queryKey: ['pending-instructors'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<AdminUser[]>>('/admin/pending-instructors');
      return data;
    },
  });
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data } = await api.patch<ApiResponse<AdminUser>>(`/admin/users/${id}/status`, { status });
      return data;
    },
    onSuccess: () => {
      toast.success('User status updated successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-students'] });
      queryClient.invalidateQueries({ queryKey: ['admin-instructors'] });
      queryClient.invalidateQueries({ queryKey: ['pending-instructors'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update user status');
    },
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, role }: { id: string; role: string }) => {
      const { data } = await api.patch<ApiResponse<AdminUser>>(`/admin/users/${id}/role`, { role });
      return data;
    },
    onSuccess: () => {
      toast.success('User role updated successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-students'] });
      queryClient.invalidateQueries({ queryKey: ['admin-instructors'] });
    },
  });
};

export const useAdminAuditLogs = () => {
  return useQuery({
    queryKey: ['admin-audit-logs'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<any[]>>('/admin/audit-logs');
      return data;
    },
  });
};

export const useAdminReports = () => {
  return useQuery({
    queryKey: ['admin-reports'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<any[]>>('/admin/reports');
      return data;
    },
  });
};

export const useUpdateReportStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data } = await api.patch<ApiResponse<any>>(`/admin/reports/${id}/status`, { status });
      return data;
    },
    onSuccess: () => {
      toast.success('Report status updated');
      queryClient.invalidateQueries({ queryKey: ['admin-reports'] });
    },
  });
};

export const useAdminCourses = () => {
  return useQuery({
    queryKey: ['admin-all-courses'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<any[]>>('/admin/courses');
      return data;
    },
  });
};

export const usePendingCourses = () => {
  return useQuery({
    queryKey: ['admin-pending-courses'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<any[]>>('/admin/courses/pending');
      return data;
    },
  });
};

export const useUpdateCourseStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data } = await api.patch<ApiResponse<any>>(`/admin/courses/${id}/status`, { status });
      return data;
    },
    onSuccess: () => {
      toast.success('Course status updated');
      queryClient.invalidateQueries({ queryKey: ['admin-pending-courses'] });
    },
  });
};
