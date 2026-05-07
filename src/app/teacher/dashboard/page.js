'use client';
import { useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getTeacherStats, getTeacherContent } from '@/services/content.service';
import { useAsyncData } from '@/hooks/useAsyncData';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { StatCard } from '@/components/ui/Card';
import { SkeletonStat, SkeletonCard } from '@/components/ui/Skeleton';
import { Alert, EmptyState } from '@/components/ui/Alert';
import { ContentCard } from '@/components/content/ContentCard';
import { Button } from '@/components/ui/Button';
import { ROLES } from '@/lib/constants';
import { LayoutDashboard, Upload, BookOpen, Clock, CheckCircle2, XCircle, Plus } from 'lucide-react';
import Link from 'next/link';

export default function TeacherDashboardPage() {
  const { user } = useAuth();

  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useAsyncData(
    useCallback(() => getTeacherStats(user?.id), [user?.id]),
    [user?.id]
  );

  const {
    data: recentContent,
    isLoading: contentLoading,
    error: contentError,
  } = useAsyncData(
    useCallback(() => getTeacherContent(user?.id), [user?.id]),
    [user?.id]
  );

  const recent = recentContent?.data?.slice(0, 3) ?? [];

  return (
    <DashboardLayout
      title="Teacher Dashboard"
      subtitle={`Welcome back, ${user?.name ?? 'Teacher'}!`}
      allowedRole={ROLES.TEACHER}
    >
      {/* Stats */}
      <section aria-label="Statistics" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsLoading
          ? Array(4).fill(0).map((_, i) => <SkeletonStat key={i} />)
          : statsError
          ? <Alert variant="error" className="col-span-4">{statsError}</Alert>
          : (
            <>
              <StatCard icon={LayoutDashboard} label="Total Uploaded" value={stats?.total ?? 0} color="violet" />
              <StatCard icon={Clock} label="Pending" value={stats?.pending ?? 0} color="amber" />
              <StatCard icon={CheckCircle2} label="Approved" value={stats?.approved ?? 0} color="emerald" />
              <StatCard icon={XCircle} label="Rejected" value={stats?.rejected ?? 0} color="red" />
            </>
          )
        }
      </section>

      {/* Quick Actions */}
      <section className="mb-8 flex flex-wrap gap-3">
        <Link href="/teacher/upload">
          <Button variant="primary" size="md">
            <Plus className="h-4 w-4" />
            Upload New Content
          </Button>
        </Link>
        <Link href="/teacher/my-content">
          <Button variant="secondary" size="md">
            <BookOpen className="h-4 w-4" />
            View All Content
          </Button>
        </Link>
      </section>

      {/* Recent Content */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Recent Uploads</h2>
          <Link href="/teacher/my-content" className="text-sm text-violet-400 hover:text-violet-300 transition-colors">
            View all →
          </Link>
        </div>

        {contentLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array(3).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : contentError ? (
          <Alert variant="error">{contentError}</Alert>
        ) : recent.length === 0 ? (
          <EmptyState
            icon={Upload}
            title="No content yet"
            description="Upload your first piece of educational content to get started."
            action={
              <Link href="/teacher/upload">
                <Button variant="primary">
                  <Plus className="h-4 w-4" /> Upload Content
                </Button>
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {recent.map((item) => (
              <ContentCard key={item.id} content={item} />
            ))}
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}
