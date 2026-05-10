import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { ApiResponse } from '@/types';

export const useUserDashboard = () => {
  return useQuery({
    queryKey: ['user-dashboard'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<any>>('/dashboard/user');
      console.log(data);
      return data;
    },
  });
};

export const useInstructorDashboard = () => {
  return useQuery({
    queryKey: ['instructor-dashboard'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<any>>('/dashboard/instructor');
      return data;
    },
  });
};

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<any>>('/dashboard/admin');
      return data;
    },
  });
};
