import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { ApiResponse } from '@/types';

export const useMentors = () => {
  return useQuery({
    queryKey: ['mentors'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<any[]>>('/mentors');
      return data;
    },
  });
};

export const useMentorById = (id: string) => {
  return useQuery({
    queryKey: ['mentor', id],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<any>>(`/mentors/${id}`);
      return data;
    },
    enabled: !!id,
  });
};
