'use client';
import { cn, getStatusClasses, getScheduleStatusClasses } from '@/lib/utils';

export function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-white/10 text-white/70 border-white/20',
    pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    approved: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
    active: 'bg-green-500/20 text-green-400 border-green-500/30',
    scheduled: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    expired: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
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
