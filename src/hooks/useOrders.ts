import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { ApiResponse } from '@/types';
import { toast } from 'sonner';

/**
 * @deprecated Use hooks from useStudentData.ts instead
 */
export const useCreateOrder = () => {
  return useMutation({
    mutationFn: async (courseId: string) => {
      const { data } = await api.post<ApiResponse<any>>('/orders/create', { courseId });
      return data;
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to initialize checkout');
    },
  });
};

/**
 * @deprecated Use hooks from useStudentData.ts instead
 */
export const useCheckout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { orderId: string; paymentMethod: string; transactionId?: string }) => {
      const { data } = await api.post<ApiResponse<any>>('/orders/checkout', payload);
      return data;
    },
    onSuccess: () => {
      toast.success('Payment successful! You are now enrolled.');
      queryClient.invalidateQueries({ queryKey: ['my-enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['user-dashboard'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Payment processing failed');
    },
  });
};

/**
 * @deprecated Use hooks from useStudentData.ts instead
 */
export const useMyOrders = () => {
  return useQuery({
    queryKey: ['my-orders'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<any[]>>('/orders/my-orders');
      return data;
    },
  });
};
