export const ROLES = {
  TEACHER: 'teacher',
  PRINCIPAL: 'principal',
  STUDENT: 'student',
};

export const CONTENT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

export const STATUS_LABELS = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
};

export const SUBJECTS = [
  'Mathematics',
  'Science',
  'English',
  'History',
  'Geography',
  'Computer Science',
  'Physics',
  'Chemistry',
  'Biology',
  'Economics',
  'Art',
  'Music',
  'Physical Education',
  'Social Studies',
];

export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
export const ALLOWED_FILE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif'];
export const MAX_FILE_SIZE_MB = 10;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const POLLING_INTERVAL = 30000; // 30 seconds for live page polling
