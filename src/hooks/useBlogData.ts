import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { ApiResponse } from '@/types';
import { toast } from 'sonner';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  thumbnailUrl?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  author: {
    name: string;
    email: string;
    image?: string;
    role?: string;
  };
}

export const useBlogs = (query?: { searchTerm?: string; authorId?: string; isPublished?: string }) => {
  return useQuery({
    queryKey: ['blogs', query],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<BlogPost[]>>('/blogs', { params: query });
      return data;
    },
  });
};

export const useBlogBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['blog', slug],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<BlogPost>>(`/blogs/${slug}`);
      return data;
    },
    enabled: !!slug,
  });
};

export const useMyBlogs = () => {
  return useQuery({
    queryKey: ['my-blogs'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<BlogPost[]>>('/blogs/my-blogs');
      return data;
    },
  });
};

export const useCreateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { title: string; content: string; thumbnailUrl?: string; isPublished?: boolean }) => {
      const { data } = await api.post<ApiResponse<BlogPost>>('/blogs', payload);
      return data;
    },
    onSuccess: () => {
      toast.success('Blog post created successfully!');
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['my-blogs'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create blog post');
    },
  });
};

export const useUpdateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<BlogPost> }) => {
      const { data } = await api.patch<ApiResponse<BlogPost>>(`/blogs/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      toast.success('Blog post updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['my-blogs'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update blog post');
    },
  });
};

export const useDeleteBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete<ApiResponse<any>>(`/blogs/${id}`);
      return data;
    },
    onSuccess: () => {
      toast.success('Blog post deleted successfully.');
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['my-blogs'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete blog post');
    },
  });
};
