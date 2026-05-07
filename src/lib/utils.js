import { clsx } from 'clsx';
import { format, isAfter, isBefore, parseISO } from 'date-fns';
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE_BYTES, CONTENT_STATUS } from './constants';

/**
 * Merge classnames conditionally (clsx wrapper)
 */
export function cn(...inputs) {
  return clsx(inputs);
}

/**
 * Format a date string to a readable format
 */
export function formatDate(dateStr, fmt = 'MMM dd, yyyy') {
  if (!dateStr) return 'N/A';
  try {
    return format(typeof dateStr === 'string' ? parseISO(dateStr) : dateStr, fmt);
  } catch {
    return 'Invalid date';
  }
}

/**
 * Format a datetime string to readable format
 */
export function formatDateTime(dateStr) {
  if (!dateStr) return 'N/A';
  try {
    return format(typeof dateStr === 'string' ? parseISO(dateStr) : dateStr, 'MMM dd, yyyy HH:mm');
  } catch {
    return 'Invalid date';
  }
}

/**
 * Get the schedule status of a content item
 */
export function getScheduleStatus(startTime, endTime) {
  if (!startTime || !endTime) return 'unknown';
  const now = new Date();
  const start = typeof startTime === 'string' ? parseISO(startTime) : startTime;
  const end = typeof endTime === 'string' ? parseISO(endTime) : endTime;

  if (isBefore(now, start)) return 'scheduled';
  if (isAfter(now, end)) return 'expired';
  return 'active';
}

/**
 * Validate file type and size
 */
export function validateFile(file) {
  if (!file) return { valid: false, error: 'No file selected.' };
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Only JPG, PNG, and GIF are allowed.' };
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { valid: false, error: `File size exceeds the 10MB limit. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB` };
  }
  return { valid: true, error: null };
}

/**
 * Safely access nested object properties
 */
export function safeGet(obj, path, fallback = null) {
  try {
    return path.split('.').reduce((acc, key) => acc?.[key], obj) ?? fallback;
  } catch {
    return fallback;
  }
}

/**
 * Get status badge color classes
 */
export function getStatusClasses(status) {
  switch (status) {
    case CONTENT_STATUS.APPROVED:
      return 'bg-emerald-500/80 text-white border-emerald-400/50 backdrop-blur-md shadow-sm';
    case CONTENT_STATUS.REJECTED:
      return 'bg-red-500/80 text-white border-red-400/50 backdrop-blur-md shadow-sm';
    case CONTENT_STATUS.PENDING:
    default:
      return 'bg-amber-500/80 text-white border-amber-400/50 backdrop-blur-md shadow-sm';
  }
}

/**
 * Get schedule status badge color classes
 */
export function getScheduleStatusClasses(scheduleStatus) {
  switch (scheduleStatus) {
    case 'active':
      return 'bg-green-500/80 text-white border-green-400/50 backdrop-blur-md shadow-sm';
    case 'expired':
      return 'bg-gray-600/80 text-white border-gray-500/50 backdrop-blur-md shadow-sm';
    case 'scheduled':
    default:
      return 'bg-blue-500/80 text-white border-blue-400/50 backdrop-blur-md shadow-sm';
  }
}

/**
 * Truncate text to a given length
 */
export function truncate(str, length = 60) {
  if (!str) return '';
  return str.length > length ? str.slice(0, length) + '...' : str;
}

/**
 * Build query string from object
 */
export function buildQueryString(params) {
  const query = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');
  return query ? `?${query}` : '';
}
