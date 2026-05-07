'use client';
import { useAuth } from '@/context/AuthContext';
import { Bell, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export function TopBar({ title, subtitle }) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-gradient-to-r from-slate-900/80 to-indigo-950/80 backdrop-blur-md border-b border-white/10 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="pl-10 lg:pl-0">
          <h1 className="text-xl font-bold text-white">{title}</h1>
          {subtitle && <p className="text-sm text-white/50 mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-all" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </button>
          {user && (
            <div className="flex items-center gap-2.5">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-white leading-none">{user.name}</p>
                <p className="text-xs text-white/40 capitalize mt-0.5">{user.role}</p>
              </div>
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-sm font-bold text-white">
                {user.name?.[0]?.toUpperCase() || '?'}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
