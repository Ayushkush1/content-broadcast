import apiClient from '@/lib/apiClient';
import { CONTENT_STATUS, SUBJECTS } from '@/lib/constants';
import { buildQueryString } from '@/lib/utils';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';

// ─── Mock Data Store ─────────────────────────────────────────────────────────
let mockIdCounter = 10;

const generateId = () => `content-${++mockIdCounter}`;

const MOCK_CONTENT = [
  {
    id: 'content-1',
    teacherId: 'teacher-1',
    teacherName: 'Sarah Johnson',
    title: 'Introduction to Quadratic Equations',
    subject: 'Mathematics',
    description: 'A comprehensive visual guide to understanding quadratic equations and their real-world applications.',
    fileUrl: 'https://picsum.photos/seed/math1/800/600',
    fileName: 'quadratic-equations.jpg',
    fileType: 'image/jpeg',
    status: CONTENT_STATUS.APPROVED,
    rejectionReason: null,
    startTime: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    rotationDuration: 30,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'content-2',
    teacherId: 'teacher-1',
    teacherName: 'Sarah Johnson',
    title: 'Geometry Fundamentals - Circles',
    subject: 'Mathematics',
    description: 'Visual representation of circle theorems and their proofs.',
    fileUrl: 'https://picsum.photos/seed/math2/800/600',
    fileName: 'geometry-circles.png',
    fileType: 'image/png',
    status: CONTENT_STATUS.PENDING,
    rejectionReason: null,
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString(),
    rotationDuration: 45,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'content-3',
    teacherId: 'teacher-1',
    teacherName: 'Sarah Johnson',
    title: 'Algebra Basics',
    subject: 'Mathematics',
    description: 'Introduction to algebraic expressions.',
    fileUrl: 'https://picsum.photos/seed/math3/800/600',
    fileName: 'algebra-basics.jpg',
    fileType: 'image/jpeg',
    status: CONTENT_STATUS.REJECTED,
    rejectionReason: 'Content quality does not meet school standards. Please revise the visual presentation.',
    startTime: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 44 * 60 * 60 * 1000).toISOString(),
    rotationDuration: 20,
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'content-4',
    teacherId: 'teacher-2',
    teacherName: 'Mark Davis',
    title: 'Photosynthesis Process Explained',
    subject: 'Science',
    description: 'Step-by-step visual walkthrough of photosynthesis in plants.',
    fileUrl: 'https://picsum.photos/seed/sci1/800/600',
    fileName: 'photosynthesis.png',
    fileType: 'image/png',
    status: CONTENT_STATUS.APPROVED,
    rejectionReason: null,
    startTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 90 * 60 * 1000).toISOString(),
    rotationDuration: 60,
    createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'content-5',
    teacherId: 'teacher-2',
    teacherName: 'Mark Davis',
    title: 'The Water Cycle',
    subject: 'Science',
    description: 'Visual diagram of the water cycle: evaporation, condensation, precipitation.',
    fileUrl: 'https://picsum.photos/seed/sci2/800/600',
    fileName: 'water-cycle.gif',
    fileType: 'image/gif',
    status: CONTENT_STATUS.PENDING,
    rejectionReason: null,
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    rotationDuration: 40,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'content-6',
    teacherId: 'teacher-2',
    teacherName: 'Mark Davis',
    title: 'Atomic Structure',
    subject: 'Chemistry',
    description: 'Diagram of atomic structure showing protons, neutrons, and electrons.',
    fileUrl: 'https://picsum.photos/seed/chem1/800/600',
    fileName: 'atomic-structure.jpg',
    fileType: 'image/jpeg',
    status: CONTENT_STATUS.PENDING,
    rejectionReason: null,
    startTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
    rotationDuration: 25,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
];

// Large dataset for performance testing
const TEACHERS = [
  { id: 'teacher-1', name: 'Sarah Johnson' },
  { id: 'teacher-2', name: 'Mark Davis' },
];

const subjects = SUBJECTS;
const statuses = Object.values(CONTENT_STATUS);

// Seed initial data
for (let i = 7; i <= 500; i++) {
  const teacher = TEACHERS[i % 2];
  const subject = subjects[i % subjects.length];
  const status = statuses[i % statuses.length];
  
  MOCK_CONTENT.push({
    id: `content-${i}`,
    teacherId: teacher.id,
    teacherName: teacher.name,
    title: `Unit ${i}: Advanced ${subject} Concepts`,
    subject: subject,
    description: `Exploring the core principles of ${subject} through practical examples and visual case studies.`,
    fileUrl: `https://picsum.photos/seed/sim${i}/800/600`,
    fileName: `module-${i}.jpg`,
    fileType: 'image/jpeg',
    status: status,
    rejectionReason: status === CONTENT_STATUS.REJECTED ? 'Simulated rejection for testing UI states.' : null,
    startTime: new Date(Date.now() - (i % 48) * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + (i % 24) * 60 * 60 * 1000).toISOString(),
    rotationDuration: 15 + (i % 60),
    createdAt: new Date(Date.now() - i * 1000 * 60).toISOString(),
    updatedAt: new Date(Date.now() - i * 1000 * 60).toISOString(),
  });
}

// ─── Helpers ────────────────────────────────────────────────────────────────
function filterMockContent(content, filters = {}) {
  let result = [...content];
  if (filters.teacherId) result = result.filter((c) => c.teacherId === filters.teacherId);
  if (filters.status) result = result.filter((c) => c.status === filters.status);
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.subject.toLowerCase().includes(q) ||
        c.teacherName.toLowerCase().includes(q)
    );
  }
  return result;
}

// ─── Service Functions ───────────────────────────────────────────────────────

/**
 * Get all content (principal view)
 */
export async function getAllContent(filters = {}) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 600));
    const result = filterMockContent(MOCK_CONTENT, filters);
    return { data: result, total: result.length };
  }
  const qs = buildQueryString(filters);
  const response = await apiClient.get(`/content${qs}`);
  return response.data;
}

/**
 * Get content for a specific teacher
 */
export async function getTeacherContent(teacherId, filters = {}) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 600));
    const result = filterMockContent(MOCK_CONTENT, { ...filters, teacherId });
    return { data: result, total: result.length };
  }
  const qs = buildQueryString(filters);
  const response = await apiClient.get(`/teachers/${teacherId}/content${qs}`);
  return response.data;
}

/**
 * Get a single content item by ID
 */
export async function getContentById(id) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 400));
    const item = MOCK_CONTENT.find((c) => c.id === id);
    if (!item) throw new Error('Content not found.');
    return item;
  }
  const response = await apiClient.get(`/content/${id}`);
  return response.data;
}

/**
 * Upload new content (teacher)
 */
export async function uploadContent(formData) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 1500));
    const newItem = {
      id: generateId(),
      teacherId: formData.get('teacherId') || 'teacher-1',
      teacherName: formData.get('teacherName') || 'Sarah Johnson',
      title: formData.get('title'),
      subject: formData.get('subject'),
      description: formData.get('description') || '',
      fileUrl: `https://picsum.photos/seed/${Date.now()}/800/600`,
      fileName: formData.get('file')?.name || 'uploaded-file.jpg',
      fileType: formData.get('file')?.type || 'image/jpeg',
      status: CONTENT_STATUS.PENDING,
      rejectionReason: null,
      startTime: formData.get('startTime'),
      endTime: formData.get('endTime'),
      rotationDuration: parseInt(formData.get('rotationDuration')) || 30,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    MOCK_CONTENT.unshift(newItem);
    return newItem;
  }
  const response = await apiClient.post('/content', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

/**
 * Delete content (teacher)
 */
export async function deleteContent(id) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 500));
    const index = MOCK_CONTENT.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Content not found.');
    MOCK_CONTENT.splice(index, 1);
    return { success: true };
  }
  const response = await apiClient.delete(`/content/${id}`);
  return response.data;
}

/**
 * Get active content for a teacher's public live page
 */
export async function getLiveContent(teacherId) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 800));
    const now = new Date();
    const active = MOCK_CONTENT.filter((c) => {
      if (c.teacherId !== teacherId) return false;
      if (c.status !== CONTENT_STATUS.APPROVED) return false;
      const start = new Date(c.startTime);
      const end = new Date(c.endTime);
      return now >= start && now <= end;
    });
    return { data: active };
  }
  const response = await apiClient.get(`/live/${teacherId}`);
  return response.data;
}

/**
 * Get content statistics for a teacher
 */
export async function getTeacherStats(teacherId) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 500));
    const items = MOCK_CONTENT.filter((c) => c.teacherId === teacherId);
    return {
      total: items.length,
      pending: items.filter((c) => c.status === CONTENT_STATUS.PENDING).length,
      approved: items.filter((c) => c.status === CONTENT_STATUS.APPROVED).length,
      rejected: items.filter((c) => c.status === CONTENT_STATUS.REJECTED).length,
    };
  }
  const response = await apiClient.get(`/teachers/${teacherId}/stats`);
  return response.data;
}

/**
 * Get content statistics for principal
 */
export async function getPrincipalStats() {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 500));
    return {
      total: MOCK_CONTENT.length,
      pending: MOCK_CONTENT.filter((c) => c.status === CONTENT_STATUS.PENDING).length,
      approved: MOCK_CONTENT.filter((c) => c.status === CONTENT_STATUS.APPROVED).length,
      rejected: MOCK_CONTENT.filter((c) => c.status === CONTENT_STATUS.REJECTED).length,
    };
  }
  const response = await apiClient.get('/principal/stats');
  return response.data;
}
