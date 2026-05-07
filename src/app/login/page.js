'use client';
import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Radio, Eye, EyeOff, GraduationCap } from 'lucide-react';

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
});

const DEMO_CREDENTIALS = [
  { role: 'Teacher', email: 'teacher@school.com', password: 'teacher123' },
  { role: 'Principal', email: 'principal@school.com', password: 'principal123' },
];

export default function LoginPage() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = useCallback(
    async (values) => {
      setLoginError('');
      try {
        await login(values.email, values.password);
      } catch (err) {
        setLoginError(err.message || 'Login failed. Please check your credentials.');
      }
    },
    [login]
  );

  const fillDemo = (cred) => {
    setValue('email', cred.email);
    setValue('password', cred.password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center p-4">
      {/* Decorative blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-violet-600/20 rounded-2xl border border-violet-500/30 mb-4">
            <Radio className="h-8 w-8 text-violet-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">EduBroadcast</h1>
          <p className="text-white/50 mt-2">Content Broadcasting System</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-1">Sign In</h2>
          <p className="text-sm text-white/50 mb-6">Access your role-based dashboard</p>

          {loginError && (
            <Alert variant="error" className="mb-5">
              {loginError}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@school.com"
              required
              autoComplete="email"
              error={errors.email?.message}
              id="email"
              {...register('email')}
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                error={errors.password?.message}
                id="password"
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-white/40 hover:text-white transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              className="w-full mt-2"
              id="login-btn"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </div>

        {/* Demo credentials */}
        <div className="mt-5 bg-white/3 border border-white/10 rounded-2xl p-5">
          <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
            Demo Credentials
          </p>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_CREDENTIALS.map((cred) => (
              <button
                key={cred.role}
                type="button"
                onClick={() => fillDemo(cred)}
                className="flex flex-col items-start p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-violet-500/30 rounded-xl transition-all duration-200 text-left group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <GraduationCap className="h-3.5 w-3.5 text-violet-400" />
                  <span className="text-xs font-semibold text-white group-hover:text-violet-300 transition-colors">
                    {cred.role}
                  </span>
                </div>
                <span className="text-xs text-white/40 truncate w-full">{cred.email}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
