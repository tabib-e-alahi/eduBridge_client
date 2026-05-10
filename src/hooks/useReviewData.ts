import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { ApiResponse, Review, Course } from '@/types';
import { toast } from 'sonner';

// =============================================
// TYPES
// =============================================

export interface RatingStats {
  averageRating: number;
  totalReviews: number;
  distribution: {
    star: number;
    count: number;
    percentage: number;
  }[];
}

export interface CourseReviewsResponse {
  reviews: Review[];
  stats: RatingStats;
}

// =============================================
// HOOKS
// =============================================

export const useCourseReviews = (courseId: string) => {
  return useQuery({
    queryKey: ['course-reviews', courseId],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<CourseReviewsResponse>>(`/reviews/course/${courseId}`);
      return data;
    },
    enabled: !!courseId,
  });
};

export const useRelatedCourses = (courseId: string) => {
  return useQuery({
    queryKey: ['related-courses', courseId],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Course[]>>(`/courses/related/${courseId}`);
      return data;
    },
    enabled: !!courseId,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ courseId, payload }: { courseId: string; payload: any }) => {
      const { data } = await api.post<ApiResponse<Review>>(`/reviews/course/${courseId}`, payload);
      return data;
    },
    onSuccess: (response) => {
      toast.success('Thank you for your feedback!');
      queryClient.invalidateQueries({ queryKey: ['course-reviews'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    },
  });
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reviewId, payload }: { reviewId: string; payload: any }) => {
      const { data } = await api.patch<ApiResponse<Review>>(`/reviews/${reviewId}`, payload);
      return data;
    },
    onSuccess: () => {
      toast.success('Review updated successfully');
      queryClient.invalidateQueries({ queryKey: ['course-reviews'] });
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewId: string) => {
      const { data } = await api.delete<ApiResponse<any>>(`/reviews/${reviewId}`);
      return data;
    },
    onSuccess: () => {
      toast.success('Review removed');
      queryClient.invalidateQueries({ queryKey: ['course-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
    },
  });
};

// Instructor Hooks
export const useInstructorReviews = () => {
  return useQuery({
    queryKey: ['instructor-reviews'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Review[]>>('/reviews/instructor');
      return data;
    },
  });
};

// Admin Hooks
export const useAdminReviews = () => {
  return useQuery({
    queryKey: ['admin-reviews'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Review[]>>('/reviews/admin');
      return data;
    },
  });
};

export const useModerateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reviewId, isHidden }: { reviewId: string; isHidden: boolean }) => {
      const { data } = await api.patch<ApiResponse<Review>>(`/reviews/${reviewId}/moderate`, { isHidden });
      return data;
    },
    onSuccess: () => {
      toast.success('Review status updated');
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['course-reviews'] });
    },
  });
};
