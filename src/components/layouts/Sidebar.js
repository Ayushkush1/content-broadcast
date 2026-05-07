'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import {
  LayoutDashboard,
  Upload,
  BookOpen,
  CheckSquare,
  List,
  LogOut,
  GraduationCap,
  Menu,
  X,
  Radio,
  ChevronRight,
} from 'lucide-react';

const teacherNav = [
  { href: '/teacher/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/teacher/upload', label: 'Upload Content', icon: Upload },
  { href: '/teacher/my-content', label: 'My Content', icon: BookOpen },
];

const principalNav = [
  { href: '/principal/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/principal/approvals', label: 'Pending Approvals', icon: CheckSquare },
  { href: '/principal/all-content', label: 'All Content', icon: List },
];

export function Sidebar() {
  const { user, logout, isTeacher, isPrincipal } = useAuth();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = isTeacher ? teacherNav : isPrincipal ? principalNav : [];

  const NavItem = ({ href, label, icon: Icon }) => {
    const isActive = pathname === href || pathname.startsWith(href + '/');
    return (
      <Link
        href={href}
        onClick={() => setMobileOpen(false)}
        className={cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
          isActive
            ? 'bg-violet-600/30 text-violet-300 border border-violet-500/30'
            : 'text-white/60 hover:text-white hover:bg-white/8'
        )}
      >
        <Icon className={cn('h-5 w-5 flex-shrink-0', isActive ? 'text-violet-400' : 'text-white/40 group-hover:text-white/70')} />
        {!collapsed && <span className="truncate">{label}</span>}
        {isActive && !collapsed && <ChevronRight className="h-4 w-4 ml-auto text-violet-400" />}
      </Link>
    );
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn('flex items-center gap-3 px-4 py-5 border-b border-white/10', collapsed && 'justify-center px-2')}>
        <div className="p-1.5 bg-violet-600/30 rounded-lg border border-violet-500/30">
          <Radio className="h-5 w-5 text-violet-400" />
        </div>
        {!collapsed && (
          <div>
            <p className="text-sm font-bold text-white leading-none">EduBroadcast</p>
            <p className="text-xs text-white/40 mt-0.5">Content System</p>
          </div>
        )}
      </div>

      {/* User info */}
      {!collapsed && user && (
        <div className="mx-3 mt-4 p-3 bg-white/5 rounded-xl border border-white/10">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
              {user.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user.name}</p>
              <p className="text-xs text-white/40 capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}
      </nav>

      {/* Footer actions */}
      <div className={cn('p-3 border-t border-white/10 space-y-1', collapsed && 'flex flex-col items-center')}>
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && 'Sign Out'}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 bg-white/10 border border-white/20 rounded-lg text-white lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile drawer */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-slate-900 to-indigo-950 border-r border-white/10 transform transition-transform duration-300 lg:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 p-1.5 text-white/50 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
        <SidebarContent />
      </div>

      {/* Desktop sidebar */}
      <div
        className={cn(
          'hidden lg:flex flex-col h-screen sticky top-0 bg-gradient-to-b from-slate-900 to-indigo-950 border-r border-white/10 transition-all duration-300 z-40',
          collapsed ? 'w-[68px]' : 'w-64'
        )}
      >
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-8 z-50 p-1 bg-slate-800 border border-white/20 rounded-full text-white/50 hover:text-white transition-all shadow-lg"
        >
          <ChevronRight className={cn('h-3 w-3 transition-transform duration-300', collapsed ? '' : 'rotate-180')} />
        </button>
        <SidebarContent />
      </div>
    </>
  );
}
