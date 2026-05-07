'use client';
import { useState, useCallback, useMemo } from 'react';
import { getAllContent } from '@/services/content.service';
import { approveContent, rejectContent } from '@/services/approval.service';
import { useAsyncData, useDebounce } from '@/hooks/useAsyncData';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { RejectModal } from '@/components/content/RejectModal';
import { SkeletonRow } from '@/components/ui/Skeleton';
import { Alert, EmptyState } from '@/components/ui/Alert';
import { StatusBadge, ScheduleBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ROLES, CONTENT_STATUS } from '@/lib/constants';
import { formatDateTime, getScheduleStatus, truncate, cn } from '@/lib/utils';
import { Search, List, CheckCircle2, XCircle, Eye } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import toast from 'react-hot-toast';

export default function AllContentPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [actingId, setActingId] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [previewTarget, setPreviewTarget] = useState(null);
  const [isRejecting, setIsRejecting] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const debouncedSearch = useDebounce(search, 400);

  const fetchAll = useCallback(
    () => getAllContent({ search: debouncedSearch, status: statusFilter }),
    [debouncedSearch, statusFilter]
  );

  const { data, isLoading, error, setData } = useAsyncData(fetchAll, [fetchAll]);
  const allItems = data?.data ?? [];
  
  const totalItems = allItems.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const items = allItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleApprove = useCallback(
    async (content) => {
      setActingId(content.id);
      try {
        await approveContent(content.id);
        toast.success(`"${content.title}" approved!`);
        setData((prev) => ({
          ...prev,
          data: prev.data.map((c) =>
            c.id === content.id ? { ...c, status: CONTENT_STATUS.APPROVED, rejectionReason: null } : c
          ),
        }));
      } catch (err) {
        toast.error(err.message);
      } finally {
        setActingId(null);
      }
    },
    [setData]
  );

  const handleRejectConfirm = useCallback(
    async (reason) => {
      setIsRejecting(true);
      try {
        await rejectContent(rejectTarget.id, reason);
        toast.success(`"${rejectTarget.title}" rejected.`);
        setData((prev) => ({
          ...prev,
          data: prev.data.map((c) =>
            c.id === rejectTarget.id
              ? { ...c, status: CONTENT_STATUS.REJECTED, rejectionReason: reason }
              : c
          ),
        }));
        setRejectTarget(null);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setIsRejecting(false);
      }
    },
    [rejectTarget, setData]
  );

  return (
    <DashboardLayout
      title="All Content"
      subtitle={`${items.length} total items`}
      allowedRole={ROLES.PRINCIPAL}
    >
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 pointer-events-none" />
          <input
            type="text"
            placeholder="Search title, subject, or teacher..."
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
      </div>

      {/* Table */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-white/50">
                <th className="text-left px-6 py-3.5 font-medium">Content</th>
                <th className="text-left px-6 py-3.5 font-medium hidden md:table-cell">Subject</th>
                <th className="text-left px-6 py-3.5 font-medium hidden lg:table-cell">Teacher</th>
                <th className="text-left px-6 py-3.5 font-medium">Status</th>
                <th className="text-left px-6 py-3.5 font-medium hidden xl:table-cell">Schedule</th>
                <th className="text-left px-6 py-3.5 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading
                ? Array(8).fill(0).map((_, i) => <SkeletonRow key={i} />)
                : error
                ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8">
                      <Alert variant="error">{error}</Alert>
                    </td>
                  </tr>
                )
                : items.length === 0
                ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8">
                      <EmptyState icon={List} title="No content found" description="Try adjusting your filters." />
                    </td>
                  </tr>
                )
                : items.map((item) => {
                  const scheduleStatus = getScheduleStatus(item.startTime, item.endTime);
                  return (
                    <tr key={item.id} className="hover:bg-white/3 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0">
                            {item.fileUrl && (
                              <img src={item.fileUrl} alt={item.title} className="h-full w-full object-cover" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-white line-clamp-1">{item.title}</p>
                            <p className="text-xs text-white/40 mt-0.5">{formatDateTime(item.createdAt)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className="text-violet-400 font-medium">{item.subject}</span>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell text-white/60">{item.teacherName}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-6 py-4 hidden xl:table-cell">
                        <ScheduleBadge scheduleStatus={scheduleStatus} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {item.status === CONTENT_STATUS.PENDING && (
                            <>
                              <Button
                                variant="success"
                                size="sm"
                                onClick={() => handleApprove(item)}
                                isLoading={actingId === item.id}
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => setRejectTarget(item)}
                                disabled={actingId === item.id}
                              >
                                <XCircle className="h-3.5 w-3.5" />
                              </Button>
                            </>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setPreviewTarget(item)}
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {!isLoading && items.length > 0 && (
          <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between bg-white/3">
            <p className="text-xs text-white/40">
              Showing <span className="text-white">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
              <span className="text-white">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of{' '}
              <span className="text-white">{totalItems}</span> items
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const p = i + 1;
                  return (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={cn(
                        'w-8 h-8 rounded-lg text-xs font-medium transition-all',
                        currentPage === p
                          ? 'bg-violet-600 text-white'
                          : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                      )}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
              <Button
                variant="ghost"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

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
