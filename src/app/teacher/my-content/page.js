'use client';
import { useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getTeacherContent, deleteContent } from '@/services/content.service';
import { useAsyncData, useDebounce } from '@/hooks/useAsyncData';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { ContentCard } from '@/components/content/ContentCard';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { Alert, EmptyState } from '@/components/ui/Alert';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ROLES, CONTENT_STATUS } from '@/lib/constants';
import { Upload, Search, Filter, BookOpen, Plus } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Modal } from '@/components/ui/Modal';
import { Eye } from 'lucide-react';

export default function MyContentPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [previewTarget, setPreviewTarget] = useState(null);
  const debouncedSearch = useDebounce(search, 400);

  const fetchContent = useCallback(
    () => getTeacherContent(user?.id, { search: debouncedSearch, status: statusFilter }),
    [user?.id, debouncedSearch, statusFilter]
  );

  const [page, setPage] = useState(1);
  const itemsPerPage = 9;

  const { data, isLoading, error, refetch } = useAsyncData(fetchContent, [fetchContent]);
  const allItems = data?.data ?? [];
  const items = allItems.slice(0, page * itemsPerPage);
  const hasMore = allItems.length > items.length;

  const handleDelete = useCallback(
    async (id) => {
      if (!confirm('Are you sure you want to delete this content?')) return;
      setDeletingId(id);
      try {
        await deleteContent(id);
        toast.success('Content deleted');
        refetch();
      } catch (err) {
        toast.error(err.message || 'Delete failed');
      } finally {
        setDeletingId(null);
      }
    },
    [refetch]
  );

  return (
    <DashboardLayout
      title="My Content"
      subtitle={`${items.length} item${items.length !== 1 ? 's' : ''} uploaded`}
      allowedRole={ROLES.TEACHER}
    >
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by title or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/70 transition-all"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-[#1e1b4b] border border-white/10 rounded-xl text-white focus:outline-none focus:border-violet-500/70 cursor-pointer min-w-[160px]"
        >
          <option value="">All Status</option>
          <option value={CONTENT_STATUS.PENDING}>Pending</option>
          <option value={CONTENT_STATUS.APPROVED}>Approved</option>
          <option value={CONTENT_STATUS.REJECTED}>Rejected</option>
        </select>
        <Link href="/teacher/upload">
          <Button variant="primary">
            <Plus className="h-4 w-4" />
            Upload New
          </Button>
        </Link>
      </div>

      {/* Content grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : error ? (
        <Alert variant="error">{error}</Alert>
      ) : items.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No content found"
          description={
            search || statusFilter
              ? 'Try adjusting your search filters.'
              : 'Upload your first piece of content to get started.'
          }
          action={
            !search && !statusFilter ? (
              <Link href="/teacher/upload">
                <Button variant="primary">
                  <Plus className="h-4 w-4" /> Upload Content
                </Button>
              </Link>
            ) : undefined
          }
        />
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {items.map((item) => (
              <ContentCard
                key={item.id}
                content={item}
                showActions={true}
                onDelete={handleDelete}
                onPreview={setPreviewTarget}
                isActing={deletingId === item.id}
              />
            ))}
          </div>
          
          {hasMore && (
            <div className="flex justify-center pb-8">
              <Button 
                variant="secondary" 
                size="lg" 
                onClick={() => setPage(p => p + 1)}
                className="min-w-[200px]"
              >
                Load More Content
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Preview Modal */}
      <Modal
        isOpen={!!previewTarget}
        onClose={() => setPreviewTarget(null)}
        title={`Preview: ${previewTarget?.title}`}
        size="lg"
      >
        <div className="flex flex-col gap-4">
          <div className="bg-slate-900 rounded-xl overflow-hidden border border-white/10">
            {previewTarget?.fileUrl && (
              <img src={previewTarget.fileUrl} alt="Preview" className="w-full h-auto max-h-[60vh] object-contain" />
            )}
          </div>
          <div className="p-3 bg-white/5 rounded-lg border border-white/10 text-xs">
            <p className="text-white/40 mb-1">Subject</p>
            <p className="text-white font-medium">{previewTarget?.subject}</p>
          </div>
          <p className="text-sm text-white/60">{previewTarget?.description}</p>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
