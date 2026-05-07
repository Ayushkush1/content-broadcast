'use client';
import { useState, useCallback } from 'react';
import { getAllContent } from '@/services/content.service';
import { approveContent, rejectContent } from '@/services/approval.service';
import { useAsyncData } from '@/hooks/useAsyncData';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { ContentCard } from '@/components/content/ContentCard';
import { RejectModal } from '@/components/content/RejectModal';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { Alert, EmptyState } from '@/components/ui/Alert';
import { ROLES, CONTENT_STATUS } from '@/lib/constants';
import { CheckSquare, CheckCircle2, Eye } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import toast from 'react-hot-toast';

export default function ApprovalsPage() {
  const [actingId, setActingId] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [previewTarget, setPreviewTarget] = useState(null);
  const [isRejecting, setIsRejecting] = useState(false);

  const fetchPending = useCallback(
    () => getAllContent({ status: CONTENT_STATUS.PENDING }),
    []
  );

  const { data, isLoading, error, refetch, setData } = useAsyncData(fetchPending, []);
  const items = data?.data ?? [];

  const handleApprove = useCallback(
    async (content) => {
      setActingId(content.id);
      try {
        await approveContent(content.id);
        toast.success(`"${content.title}" approved!`);
        // Optimistically remove from list
        setData((prev) => ({
          ...prev,
          data: prev.data.filter((c) => c.id !== content.id),
        }));
      } catch (err) {
        toast.error(err.message || 'Approval failed');
      } finally {
        setActingId(null);
      }
    },
    [setData]
  );

  const handleRejectConfirm = useCallback(
    async (reason) => {
      if (!rejectTarget) return;
      setIsRejecting(true);
      try {
        await rejectContent(rejectTarget.id, reason);
        toast.success(`"${rejectTarget.title}" rejected.`);
        setData((prev) => ({
          ...prev,
          data: prev.data.filter((c) => c.id !== rejectTarget.id),
        }));
        setRejectTarget(null);
      } catch (err) {
        toast.error(err.message || 'Rejection failed');
      } finally {
        setIsRejecting(false);
      }
    },
    [rejectTarget, setData]
  );

  return (
    <DashboardLayout
      title="Pending Approvals"
      subtitle={`${items.length} item${items.length !== 1 ? 's' : ''} awaiting review`}
      allowedRole={ROLES.PRINCIPAL}
    >
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : error ? (
        <Alert variant="error">{error}</Alert>
      ) : items.length === 0 ? (
        <EmptyState
          icon={CheckCircle2}
          title="All caught up!"
          description="No content is pending approval. Check back later."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map((item) => (
            <ContentCard
              key={item.id}
              content={item}
              showActions
              onApprove={handleApprove}
              onReject={setRejectTarget}
              onPreview={setPreviewTarget}
              isActing={actingId === item.id}
            />
          ))}
        </div>
      )}

      <RejectModal
        isOpen={!!rejectTarget}
        onClose={() => setRejectTarget(null)}
        onConfirm={handleRejectConfirm}
        contentTitle={rejectTarget?.title}
        isLoading={isRejecting}
      />

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
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-white/5 rounded-lg border border-white/10">
              <p className="text-white/40 mb-1">Teacher</p>
              <p className="text-white font-medium">{previewTarget?.teacherName}</p>
            </div>
            <div className="p-3 bg-white/5 rounded-lg border border-white/10">
              <p className="text-white/40 mb-1">Subject</p>
              <p className="text-white font-medium">{previewTarget?.subject}</p>
            </div>
          </div>
          <p className="text-sm text-white/60">{previewTarget?.description}</p>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
