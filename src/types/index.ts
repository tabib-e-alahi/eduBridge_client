export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'INSTRUCTOR' | 'MANAGER' | 'ADMIN';
  image?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  _count?: {
    courses: number;
  };
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  level: string;
  thumbnailUrl: string;
  instructor: Partial<User>;
  category: Partial<Category>;
  rating?: number;
  enrolledCount?: number;
  updatedAt: string;
}

export interface Enrollment {
  id: string;
  progress: number;
  status: string;
  course: Course;
  createdAt: string;
}

export interface ActivityItem {
  id: string;
  action: string;
  target: string;
  createdAt: string;
}

export interface SavedCourse {
  id: string;
  course: Course;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}
