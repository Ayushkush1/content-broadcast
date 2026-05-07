import apiClient from '@/lib/apiClient';
import { ROLES } from '@/lib/constants';

/**
 * Mock users for demo / when no real backend is available.
 * Remove this section and replace with real API calls when backend is ready.
 */
const MOCK_USERS = [
  {
    id: 'teacher-1',
    email: 'teacher@school.com',
    password: 'teacher123',
    name: 'Sarah Johnson',
    role: ROLES.TEACHER,
    subject: 'Mathematics',
    avatar: null,
  },
  {
    id: 'teacher-2',
    email: 'teacher2@school.com',
    password: 'teacher123',
    name: 'Mark Davis',
    role: ROLES.TEACHER,
    subject: 'Science',
    avatar: null,
  },
  {
    id: 'principal-1',
    email: 'principal@school.com',
    password: 'principal123',
    name: 'Dr. Emily Chen',
    role: ROLES.PRINCIPAL,
    avatar: null,
  },
];

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';

/**
 * Login service
 * @param {string} email
 * @param {string} password
 * @returns {{ user, token }}
 */
export async function login(email, password) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 800)); // simulate latency
    const user = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );
    if (!user) throw new Error('Invalid email or password.');
    const { password: _pass, ...safeUser } = user;
    const token = `mock-token-${safeUser.id}-${Date.now()}`;
    return { user: safeUser, token };
  }

  const response = await apiClient.post('/auth/login', { email, password });
  return response.data;
}

/**
 * Logout service (invalidate server-side session if applicable)
 */
export async function logout() {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    return;
  }
  try {
    await apiClient.post('/auth/logout');
  } catch {
    // Logout failures should not block client-side cleanup
  }
}

/**
 * Get the current authenticated user profile
 */
export async function getMe() {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 400));
    const stored = typeof window !== 'undefined' ? localStorage.getItem('auth_user') : null;
    if (stored) return JSON.parse(stored);
    throw new Error('Not authenticated');
  }
  const response = await apiClient.get('/auth/me');
  return response.data;
}
