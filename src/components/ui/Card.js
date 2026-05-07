'use client';
import { cn } from '@/lib/utils';

export function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div
      className={cn(
        'bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl',
        hover && 'hover:bg-white/8 hover:border-white/20 transition-all duration-200 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return <div className={cn('px-6 pt-6 pb-4', className)}>{children}</div>;
}

export function CardContent({ children, className = '' }) {
  return <div className={cn('px-6 pb-6', className)}>{children}</div>;
}

export function CardTitle({ children, className = '' }) {
  return <h3 className={cn('text-lg font-bold text-white', className)}>{children}</h3>;
}

export function StatCard({ icon: Icon, label, value, color = 'violet', trend }) {
  const colorMap = {
    violet: 'from-violet-600/20 to-violet-800/10 border-violet-500/20 text-violet-400',
    amber: 'from-amber-600/20 to-amber-800/10 border-amber-500/20 text-amber-400',
    emerald: 'from-emerald-600/20 to-emerald-800/10 border-emerald-500/20 text-emerald-400',
    red: 'from-red-600/20 to-red-800/10 border-red-500/20 text-red-400',
    blue: 'from-blue-600/20 to-blue-800/10 border-blue-500/20 text-blue-400',
  };

  return (
    <Card className={cn('bg-gradient-to-br', colorMap[color], 'border')}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={cn('p-2.5 rounded-xl bg-current/10')}>
            {Icon && <Icon className={cn('h-6 w-6', colorMap[color].split(' ').pop())} />}
          </div>
          {trend !== undefined && (
            <span className={cn('text-xs font-semibold px-2 py-1 rounded-full backdrop-blur-md shadow-sm', trend >= 0 ? 'bg-emerald-500/80 text-white' : 'bg-red-500/80 text-white')}>
              {trend >= 0 ? '+' : ''}{trend}%
            </span>
          )}
        </div>
        <div>
          <p className="text-sm text-white/50 font-medium mb-1">{label}</p>
          <p className="text-3xl font-bold text-white">{value ?? '—'}</p>
        </div>
      </div>
    </Card>
  );
}
