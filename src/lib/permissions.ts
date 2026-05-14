// ===================================================================
// EduBridge AI — Frontend Permission Logic
// ===================================================================

export const PERMISSIONS = {
  COURSE_CREATE: 'course:create',
  COURSE_UPDATE: 'course:update',
  COURSE_DELETE: 'course:delete',
  COURSE_PUBLISH: 'course:publish',
  COURSE_VIEW_OWN: 'course:view-own',
  COURSE_VIEW_ALL: 'course:view-all',
  LESSON_CREATE: 'lesson:create',
  LESSON_UPDATE: 'lesson:update',
  LESSON_DELETE: 'lesson:delete',
  USER_VIEW: 'user:view',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  USER_MANAGE_ROLE: 'user:manage-role',
  BLOG_CREATE: 'blog:create',
  BLOG_UPDATE: 'blog:update',
  BLOG_DELETE: 'blog:delete',
  BLOG_PUBLISH: 'blog:publish',
  REVIEW_CREATE: 'review:create',
  REVIEW_MODERATE: 'review:moderate',
  REVIEW_DELETE: 'review:delete',
  ANALYTICS_VIEW: 'analytics:view',
  ANALYTICS_VIEW_ALL: 'analytics:view-all',
  AI_LOG_VIEW: 'ai-log:view',
  AI_TUTOR_USE: 'ai:tutor-use',
  AI_ROADMAP_USE: 'ai:roadmap-use',
  AI_QUIZ_USE: 'ai:quiz-use',
  CATEGORY_MANAGE: 'category:manage',
  ENROLLMENT_CREATE: 'enrollment:create',
  ENROLLMENT_VIEW_OWN: 'enrollment:view-own',
  ENROLLMENT_VIEW_ALL: 'enrollment:view-all',
  ENROLLMENT_MANAGE: 'enrollment:manage',
  NOTIFICATION_MANAGE: 'notification:manage',
  NOTIFICATION_ANNOUNCE: 'notification:announce',
  SAVED_COURSE_MANAGE: 'saved-course:manage',
  PROFILE_MANAGE: 'profile:manage',
  QUIZ_CREATE: 'quiz:create',
  QUIZ_ATTEMPT: 'quiz:attempt',

  // Assignment permissions
  ASSIGNMENT_CREATE: 'assignment:create',
  ASSIGNMENT_SUBMIT: 'assignment:submit',
  ASSIGNMENT_GRADE: 'assignment:grade',

  // Live class permissions
  CLASS_MANAGE: 'class:manage',

  // Payment & Order permissions
  PAYMENT_MANAGE: 'payment:manage',
  ORDER_VIEW_OWN: 'order:view-own',
  ORDER_VIEW_ALL: 'order:view-all',

  // Message permissions
  MESSAGE_MANAGE: 'message:manage',

  // Admin & System permissions
  SYSTEM_MANAGE: 'system:manage',
  REPORT_MANAGE: 'report:manage',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  STUDENT: [
    PERMISSIONS.PROFILE_MANAGE,
    PERMISSIONS.ENROLLMENT_CREATE,
    PERMISSIONS.ENROLLMENT_VIEW_OWN,
    PERMISSIONS.SAVED_COURSE_MANAGE,
    PERMISSIONS.REVIEW_CREATE,
    PERMISSIONS.QUIZ_ATTEMPT,
    PERMISSIONS.AI_TUTOR_USE,
    PERMISSIONS.AI_ROADMAP_USE,
    PERMISSIONS.AI_QUIZ_USE,
    PERMISSIONS.ASSIGNMENT_SUBMIT,
    PERMISSIONS.ORDER_VIEW_OWN,
    PERMISSIONS.MESSAGE_MANAGE,
  ],
  INSTRUCTOR: [
    PERMISSIONS.PROFILE_MANAGE,
    PERMISSIONS.ENROLLMENT_CREATE,
    PERMISSIONS.ENROLLMENT_VIEW_OWN,
    PERMISSIONS.SAVED_COURSE_MANAGE,
    PERMISSIONS.REVIEW_CREATE,
    PERMISSIONS.QUIZ_ATTEMPT,
    PERMISSIONS.AI_TUTOR_USE,
    PERMISSIONS.AI_ROADMAP_USE,
    PERMISSIONS.AI_QUIZ_USE,
    PERMISSIONS.ASSIGNMENT_SUBMIT,
    PERMISSIONS.ORDER_VIEW_OWN,
    PERMISSIONS.MESSAGE_MANAGE,
    PERMISSIONS.COURSE_CREATE,
    PERMISSIONS.COURSE_UPDATE,
    PERMISSIONS.COURSE_VIEW_OWN,
    PERMISSIONS.LESSON_CREATE,
    PERMISSIONS.LESSON_UPDATE,
    PERMISSIONS.LESSON_DELETE,
    PERMISSIONS.QUIZ_CREATE,
    PERMISSIONS.ANALYTICS_VIEW,
    PERMISSIONS.ASSIGNMENT_CREATE,
    PERMISSIONS.ASSIGNMENT_GRADE,
    PERMISSIONS.CLASS_MANAGE,
  ],
  MANAGER: [
    PERMISSIONS.PROFILE_MANAGE,
    PERMISSIONS.ENROLLMENT_CREATE,
    PERMISSIONS.ENROLLMENT_VIEW_OWN,
    PERMISSIONS.SAVED_COURSE_MANAGE,
    PERMISSIONS.REVIEW_CREATE,
    PERMISSIONS.QUIZ_ATTEMPT,
    PERMISSIONS.AI_TUTOR_USE,
    PERMISSIONS.AI_ROADMAP_USE,
    PERMISSIONS.AI_QUIZ_USE,
    PERMISSIONS.ASSIGNMENT_SUBMIT,
    PERMISSIONS.ORDER_VIEW_OWN,
    PERMISSIONS.MESSAGE_MANAGE,
    PERMISSIONS.COURSE_CREATE,
    PERMISSIONS.COURSE_UPDATE,
    PERMISSIONS.COURSE_VIEW_OWN,
    PERMISSIONS.LESSON_CREATE,
    PERMISSIONS.LESSON_UPDATE,
    PERMISSIONS.LESSON_DELETE,
    PERMISSIONS.QUIZ_CREATE,
    PERMISSIONS.ANALYTICS_VIEW,
    PERMISSIONS.ASSIGNMENT_CREATE,
    PERMISSIONS.ASSIGNMENT_GRADE,
    PERMISSIONS.CLASS_MANAGE,
    PERMISSIONS.COURSE_PUBLISH,
    PERMISSIONS.COURSE_DELETE,
    PERMISSIONS.COURSE_VIEW_ALL,
    PERMISSIONS.BLOG_CREATE,
    PERMISSIONS.BLOG_UPDATE,
    PERMISSIONS.BLOG_DELETE,
    PERMISSIONS.BLOG_PUBLISH,
    PERMISSIONS.REVIEW_MODERATE,
    PERMISSIONS.REVIEW_DELETE,
    PERMISSIONS.CATEGORY_MANAGE,
    PERMISSIONS.ENROLLMENT_VIEW_ALL,
    PERMISSIONS.ANALYTICS_VIEW_ALL,
    PERMISSIONS.ORDER_VIEW_ALL,
    PERMISSIONS.PAYMENT_MANAGE,
  ],
  ADMIN: Object.values(PERMISSIONS) as Permission[],
};

export function hasPermission(role: string | undefined, permission: Permission): boolean {
  if (!role) return false;
  const permissions = ROLE_PERMISSIONS[role];
  return permissions?.includes(permission) ?? false;
}

export function hasAnyPermission(role: string | undefined, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(role, p));
}
