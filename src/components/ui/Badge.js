'use client';
import { cn, getStatusClasses, getScheduleStatusClasses } from '@/lib/utils';

export function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-white/20 text-white border-white/30 backdrop-blur-md shadow-sm',
    pending: 'bg-amber-500/80 text-white border-amber-400/50 backdrop-blur-md shadow-sm',
    approved: 'bg-emerald-500/80 text-white border-emerald-400/50 backdrop-blur-md shadow-sm',
    rejected: 'bg-red-500/80 text-white border-red-400/50 backdrop-blur-md shadow-sm',
    active: 'bg-green-500/80 text-white border-green-400/50 backdrop-blur-md shadow-sm',
    scheduled: 'bg-blue-500/80 text-white border-blue-400/50 backdrop-blur-md shadow-sm',
    expired: 'bg-gray-600/80 text-white border-gray-500/50 backdrop-blur-md shadow-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full border',
        variants[variant] || variants.default,
        className
      )}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }) {
  const labelMap = { pending: 'Pending', approved: 'Approved', rejected: 'Rejected' };
  return <Badge variant={status}>{labelMap[status] || status}</Badge>;
}

export function ScheduleBadge({ scheduleStatus }) {
  const labelMap = { active: 'Live', scheduled: 'Scheduled', expired: 'Expired', unknown: 'Unknown' };
  return <Badge variant={scheduleStatus}>{labelMap[scheduleStatus] || scheduleStatus}</Badge>;
}
