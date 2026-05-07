'use client';
import { useCallback, use } from 'react';
import { getLiveContent } from '@/services/content.service';
import { usePolling } from '@/hooks/useAsyncData';
import { formatDateTime } from '@/lib/utils';
import { POLLING_INTERVAL } from '@/lib/constants';
import { Radio, BookOpen, Clock, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { Alert } from '@/components/ui/Alert';
import { Skeleton } from '@/components/ui/Skeleton';
import { Modal } from '@/components/ui/Modal';
import { useState } from 'react';

export default function LivePage({ params }) {
  const { teacherId } = use(params);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchLive = useCallback(() => getLiveContent(teacherId), [teacherId]);
  const { data, isLoading, error } = usePolling(fetchLive, POLLING_INTERVAL, [teacherId]);

  const liveItems = data?.data ?? [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
      {/* Decorative blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 bg-black/30 backdrop-blur-md border-b border-white/10 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-600/20 rounded-xl border border-violet-500/30">
              <Radio className="h-5 w-5 text-violet-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">EduBroadcast Live</h1>
              <p className="text-xs text-white/40">Teacher ID: {teacherId}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {error ? (
              <div className="flex items-center gap-1.5 text-red-400 text-xs">
                <WifiOff className="h-4 w-4" />
                <span>Connection error</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs">
                <div className="relative">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 live-dot" />
                </div>
                <span>Live</span>
              </div>
            )}
            <div className="flex items-center gap-1 text-white/30 text-xs ml-2">
              <RefreshCw className="h-3 w-3" />
              <span>Auto-refresh</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-10">
        {isLoading ? (
          <div className="space-y-6">
            <div className="text-center py-4">
              <div className="h-8 w-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin mx-auto mb-3" />
              <p className="text-white/50 text-sm">Loading live content...</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array(2).fill(0).map((_, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                  <Skeleton className="h-72 w-full rounded-none" />
                  <div className="p-5 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto mt-16">
            <Alert variant="error" title="Connection Error">
              {error}. The page will try to reload automatically.
            </Alert>
          </div>
        ) : liveItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="relative mb-8">
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                <Radio className="h-16 w-16 text-white/20" />
              </div>
              <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500/80 border-2 border-slate-950" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">No Content Available</h2>
            <p className="text-white/40 text-sm max-w-sm">
              There is currently no live content broadcasting from this teacher. Check back later.
            </p>
            <div className="mt-6 flex items-center gap-2 text-white/30 text-xs">
              <RefreshCw className="h-3 w-3" />
              <span>Auto-refreshes every 30 seconds</span>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="text-center">
              <p className="text-sm text-violet-400 font-semibold uppercase tracking-widest mb-2">
                Now Broadcasting
              </p>
              <h2 className="text-2xl font-bold text-white">
                {liveItems.length} Active Broadcast{liveItems.length !== 1 ? 's' : ''}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {liveItems.map((item, index) => (
                <LiveContentCard 
                  key={item.id} 
                  content={item} 
                  index={index} 
                  onClick={() => setSelectedItem(item)}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Full Screen Viewer Modal */}
      <Modal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title={selectedItem?.title || 'Content Viewer'}
        size="xl"
      >
        <div className="flex flex-col items-center">
          <div className="w-full bg-slate-900 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            {selectedItem?.fileUrl && (
              <img 
                src={selectedItem.fileUrl} 
                alt={selectedItem.title} 
                className="w-full h-auto max-h-[70vh] object-contain"
              />
            )}
            <div className="p-6 bg-slate-950/80 backdrop-blur-md border-t border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-violet-400 uppercase tracking-widest bg-violet-400/10 px-2 py-0.5 rounded">
                  {selectedItem?.subject}
                </span>
                <span className="text-xs text-white/40">Broadcasting for {selectedItem?.rotationDuration}s</span>
              </div>
              <p className="text-white/70 leading-relaxed">
                {selectedItem?.description || 'No additional description provided.'}
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function LiveContentCard({ content, index, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden group animate-in cursor-pointer hover:border-violet-500/50 transition-all active:scale-[0.98]"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Live indicator bar */}
      <div className="h-1 bg-gradient-to-r from-violet-600 via-indigo-500 to-violet-600 bg-size-200 animate-shimmer" />

      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: '280px' }}>
        {content.fileUrl ? (
          <img
            src={content.fileUrl}
            alt={content.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-indigo-900">
            <BookOpen className="h-20 w-20 text-white/10" />
          </div>
        )}
        {/* Live badge overlay */}
        <div className="absolute top-4 left-4">
          <div className="flex items-center gap-1.5 bg-red-600/90 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-white live-dot" />
            LIVE
          </div>
        </div>
      </div>

      {/* Content info */}
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-bold text-white leading-snug">{content.title}</h3>
          <div className="flex items-center gap-2 mt-2">
            <span className="inline-flex items-center gap-1.5 text-sm text-violet-400 font-medium">
              <BookOpen className="h-4 w-4" />
              {content.subject}
            </span>
          </div>
        </div>

        {content.description && (
          <p className="text-sm text-white/60 leading-relaxed">{content.description}</p>
        )}

        <div className="flex items-center gap-2 text-xs text-white/40 bg-white/5 rounded-lg p-3">
          <Clock className="h-3.5 w-3.5 flex-shrink-0" />
          <div>
            <span className="text-white/60">Until:</span>{' '}
            <span className="font-medium text-white/80">{formatDateTime(content.endTime)}</span>
          </div>
          {content.rotationDuration && (
            <>
              <span className="text-white/20 mx-1">·</span>
              <span>Rotation: {content.rotationDuration}s</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
