import apiClient from '@/lib/apiClient';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';

// Import the MOCK_CONTENT array by reference through the content service
// In production, these would be real API calls

/**
 * Approve a content item
 * @param {string} contentId
 * @returns {{ success, data }}
 */
export async function approveContent(contentId) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 700));
    // The content.service mock store is mutated in place via the exported mock
    // For demo, we return success; the UI will refetch
    return { success: true, contentId, status: 'approved' };
  }
  const response = await apiClient.patch(`/content/${contentId}/approve`);
  return response.data;
}

/**
 * Reject a content item with a mandatory reason
 * @param {string} contentId
 * @param {string} reason
 * @returns {{ success, data }}
 */
export async function rejectContent(contentId, reason) {
  if (!reason || reason.trim() === '') {
    throw new Error('Rejection reason is required.');
  }
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 700));
    return { success: true, contentId, status: 'rejected', reason };
  }
  const response = await apiClient.patch(`/content/${contentId}/reject`, {
    reason: reason.trim(),
  });
  return response.data;
}

/**
 * Get pending content for principal review
 */
export async function getPendingApprovals() {
  if (USE_MOCK) {
    // Delegate to content service which owns mock data
    const { getAllContent } = await import('./content.service');
    return getAllContent({ status: 'pending' });
  }
  const response = await apiClient.get('/approvals/pending');
  return response.data;
}
