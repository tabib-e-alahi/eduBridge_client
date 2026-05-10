import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { ApiResponse, Course } from '@/types';

export interface CourseQueryParams {
  searchTerm?: string;
  category?: string;
  level?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit?: number;
}

export const useCourses = (params: CourseQueryParams) => {
  return useQuery({
    queryKey: ['courses', params],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Course[]>>('/courses', {
        params,
      });
      return data;
    },
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<any[]>>('/categories');
      return data;
    },
  });
};

export const useCourseBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['course', slug],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<any>>(`/courses/${slug}`);
      return data;
    },
    enabled: !!slug,
  });
};

