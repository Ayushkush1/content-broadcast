'use client';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';

const variants = {
  error: {
    wrapper: 'bg-red-500/10 border-red-500/30 text-red-300',
    icon: XCircle,
    iconClass: 'text-red-400',
  },
  success: {
    wrapper: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
    icon: CheckCircle2,
    iconClass: 'text-emerald-400',
  },
  warning: {
    wrapper: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
    icon: AlertCircle,
    iconClass: 'text-amber-400',
  },
  info: {
    wrapper: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
    icon: Info,
    iconClass: 'text-blue-400',
  },
};

export function Alert({ variant = 'info', title, children, className = '' }) {
  const v = variants[variant] || variants.info;
  const Icon = v.icon;
  return (
    <div className={cn('flex gap-3 p-4 rounded-xl border', v.wrapper, className)}>
      <Icon className={cn('h-5 w-5 mt-0.5 flex-shrink-0', v.iconClass)} />
      <div>
        {title && <p className="font-semibold mb-1">{title}</p>}
        <div className="text-sm opacity-90">{children}</div>
      </div>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      {Icon && (
        <div className="p-4 bg-white/5 rounded-2xl mb-4">
          <Icon className="h-10 w-10 text-white/30" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-white/70 mb-2">{title}</h3>
      {description && <p className="text-sm text-white/40 max-w-sm mb-6">{description}</p>}
      {action}
    </div>
  );
}
