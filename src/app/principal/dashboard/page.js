'use client';
import { useCallback } from 'react';
import { getPrincipalStats, getAllContent } from '@/services/content.service';
import { useAsyncData } from '@/hooks/useAsyncData';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { StatCard } from '@/components/ui/Card';
import { SkeletonStat, SkeletonCard } from '@/components/ui/Skeleton';
import { Alert, EmptyState } from '@/components/ui/Alert';
import { ContentCard } from '@/components/content/ContentCard';
import { Button } from '@/components/ui/Button';
import { ROLES, CONTENT_STATUS } from '@/lib/constants';
import { LayoutDashboard, CheckSquare, List, Clock, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function PrincipalDashboardPage() {
  const { data: stats, isLoading: statsLoading, error: statsError } = useAsyncData(
    useCallback(() => getPrincipalStats(), []),
    []
  );

  const { data: pendingData, isLoading: pendingLoading } = useAsyncData(
    useCallback(() => getAllContent({ status: CONTENT_STATUS.PENDING }), []),
    []
  );

  const pendingItems = pendingData?.data?.slice(0, 4) ?? [];

  return (
    <DashboardLayout
      title="Principal Dashboard"
      subtitle="Manage and approve educational content"
      allowedRole={ROLES.PRINCIPAL}
    >
      {/* Stats */}
      <section aria-label="Statistics" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsLoading
          ? Array(4).fill(0).map((_, i) => <SkeletonStat key={i} />)
          : statsError
          ? <Alert variant="error" className="col-span-4">{statsError}</Alert>
          : (
            <>
              <StatCard icon={LayoutDashboard} label="Total Content" value={stats?.total ?? 0} color="violet" />
              <StatCard icon={Clock} label="Pending Review" value={stats?.pending ?? 0} color="amber" />
              <StatCard icon={CheckCircle2} label="Approved" value={stats?.approved ?? 0} color="emerald" />
              <StatCard icon={XCircle} label="Rejected" value={stats?.rejected ?? 0} color="red" />
            </>
          )
        }
      </section>

      {/* Quick Actions */}
      <section className="mb-8 flex flex-wrap gap-3">
        <Link href="/principal/approvals">
          <Button variant="primary">
            <CheckSquare className="h-4 w-4" />
            Review Pending
          </Button>
        </Link>
        <Link href="/principal/all-content">
          <Button variant="secondary">
            <List className="h-4 w-4" />
            All Content
          </Button>
        </Link>
      </section>

      {/* Pending Approvals Preview */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Awaiting Approval</h2>
          <Link href="/principal/approvals" className="text-sm text-violet-400 hover:text-violet-300 transition-colors">
            Review all →
          </Link>
        </div>

        {pendingLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : pendingItems.length === 0 ? (
          <EmptyState
            icon={CheckCircle2}
            title="All caught up!"
            description="No content is pending approval right now."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {pendingItems.map((item) => (
              <ContentCard key={item.id} content={item} />
            ))}
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}
