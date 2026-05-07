'use client';
import Image from 'next/image';
import { formatDateTime, getScheduleStatus, truncate } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { StatusBadge, ScheduleBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Clock, BookOpen, User, AlertCircle } from 'lucide-react';

export function ContentCard({
  content,
  showActions = false,
  onApprove,
  onReject,
  onDelete,
  onPreview,
  isActing = false,
}) {
  const scheduleStatus = getScheduleStatus(content.startTime, content.endTime);

  return (
    <Card className="overflow-hidden flex flex-col group">
      {/* Image Preview */}
      <div className="relative h-48 bg-gradient-to-br from-slate-800 to-indigo-900 overflow-hidden flex-shrink-0">
        {content.fileUrl ? (
          <img
            src={content.fileUrl}
            alt={content.title}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${onPreview ? 'cursor-pointer' : ''}`}
            onClick={() => onPreview?.(content)}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className="w-full h-full hidden items-center justify-center">
          <BookOpen className="h-16 w-16 text-white/20" />
        </div>
        {/* Overlay badges */}
        <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
          <StatusBadge status={content.status} />
          <ScheduleBadge scheduleStatus={scheduleStatus} />
        </div>
        {content.rotationDuration && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 text-white/80 text-xs px-2 py-1 rounded-full backdrop-blur-sm">
            <Clock className="h-3 w-3" />
            {content.rotationDuration}s
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col p-5">
        <div className="flex-1 space-y-3">
          {/* Title & subject */}
          <div>
            <h3 className="font-bold text-white text-base leading-snug line-clamp-2">{content.title}</h3>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="inline-flex items-center gap-1 text-xs text-violet-400 font-medium">
                <BookOpen className="h-3 w-3" />
                {content.subject}
              </span>
              {content.teacherName && (
                <>
                  <span className="text-white/20">·</span>
                  <span className="inline-flex items-center gap-1 text-xs text-white/50">
                    <User className="h-3 w-3" />
                    {content.teacherName}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Description */}
          {content.description && (
            <p className="text-sm text-white/50 leading-relaxed line-clamp-2">{content.description}</p>
          )}

          {/* Schedule times */}
          <div className="flex items-start gap-2 text-xs text-white/40 bg-white/5 rounded-lg p-2.5">
            <Clock className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-white/30" />
            <div>
              <p>Start: {formatDateTime(content.startTime)}</p>
              <p>End: {formatDateTime(content.endTime)}</p>
            </div>
          </div>

          {/* Rejection reason */}
          {content.status === 'rejected' && content.rejectionReason && (
            <div className="flex items-start gap-2 p-2.5 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-red-400 mb-0.5">Rejection Reason</p>
                <p className="text-xs text-red-300/80">{content.rejectionReason}</p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
            {onApprove && (
              <Button
                variant="success"
                size="sm"
                onClick={() => onApprove(content)}
                isLoading={isActing}
                className="flex-1"
              >
                Approve
              </Button>
            )}
            {onReject && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => onReject(content)}
                disabled={isActing}
                className="flex-1"
              >
                Reject
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(content.id)}
                disabled={isActing}
              >
                Delete
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
