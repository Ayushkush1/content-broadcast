'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Radio, GraduationCap, Users, ShieldCheck, ArrowRight, Play } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-violet-500/30">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 border-b border-white/5 bg-slate-950/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-violet-600 rounded-xl shadow-lg shadow-violet-900/20">
              <Radio className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">EduBroadcast</span>
          </div>
          
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Button onClick={() => router.push(user?.role === 'principal' ? '/principal/dashboard' : '/teacher/dashboard')}>
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
                  Sign In
                </Link>
                <Button onClick={() => router.push('/login')}>
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 animate-in">
            <span className="flex h-2 w-2 rounded-full bg-violet-500 animate-pulse" />
            <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">Live Content Management</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 animate-in [animation-delay:100ms]">
            Next-Gen Learning <br />
            <span className="gradient-text">Broadcasting System</span>
          </h1>
          
          <p className="text-xl text-white/50 max-w-2xl mx-auto mb-12 animate-in [animation-delay:200ms]">
            Empower teachers to share dynamic educational content. Empower principals to maintain quality. All in real-time.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-6 animate-in [animation-delay:300ms]">
            <Button size="lg" className="h-14 px-8 text-lg" onClick={() => router.push('/login')}>
              Launch Portal
            </Button>
            <Link href="/live/teacher-1">
              <Button variant="secondary" size="lg" className="h-14 px-8 text-lg">
                <Play className="h-4 w-4 fill-current" />
                Watch Demo Live
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-7xl mx-auto px-6 mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={GraduationCap}
            title="For Teachers"
            description="Effortlessly upload and schedule educational content with advanced timing and rotation controls."
            delay="400ms"
          />
          <FeatureCard 
            icon={ShieldCheck}
            title="For Principals"
            description="Comprehensive approval workflow with quality control, rejection feedback, and detailed analytics."
            delay="500ms"
          />
          <FeatureCard 
            icon={Users}
            title="For Students"
            description="Dynamic public live pages with auto-refreshing content. No accounts needed for public viewing."
            delay="600ms"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-white/40 text-sm">
          <p>© 2026 EduBroadcast. Built for Modern Education.</p>
          <div className="flex items-center gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, delay }) {
  return (
    <div className={`p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-violet-500/50 hover:bg-white/[0.07] transition-all duration-300 animate-in [animation-delay:${delay}] group`}>
      <div className="w-14 h-14 rounded-2xl bg-violet-600/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        <Icon className="h-7 w-7 text-violet-400" />
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-white/50 leading-relaxed">{description}</p>
    </div>
  );
}
