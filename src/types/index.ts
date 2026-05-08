export type Role = 'STUDENT' | 'INSTRUCTOR' | 'MANAGER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
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

export interface Lesson {
  id: string;
  title: string;
  slug: string;
  content?: string;
  videoUrl?: string;
  duration?: string;
  order: number;
  courseId: string;
  resources?: LessonResource[];
}

export interface LessonResource {
  id: string;
  title: string;
  url: string;
  lessonId: string;
}

export interface Assignment {
  id: string;
  title: string;
  description?: string;
  type?: string;
  courseId: string;
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  questionsCount?: number;
  courseId: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  level: string;
  thumbnailUrl: string;
  instructor: {
    id: string;
    name: string;
    image?: string;
  };
  category: Partial<Category>;
  lessons?: Lesson[];
  assignments?: Assignment[];
  quizzes?: Quiz[];
  instructorId?: string;
  reviews?: Review[];
  status?: 'DRAFT' | 'PUBLISHED' | 'PENDING' | 'REJECTED' | 'IN_REVIEW' | 'ARCHIVED';
  rating?: number;
  enrolledCount?: number;
  updatedAt: string;
  _count?: {
    enrollments?: number;
    reviews?: number;
    lessons?: number;
  };
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

export interface Review {
  id: string;
  rating: number;
  comment?: string;
  isRecommended?: boolean;
  userId: string;
  isHidden?: boolean;
  user: {
    id: string;
    name: string;
    image?: string;
  };
  courseId: string;
  course: Partial<Course>;
  createdAt: string;
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
