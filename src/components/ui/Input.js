'use client';
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

export const Input = forwardRef(function Input(
  { label, error, hint, className = '', required, ...props },
  ref
) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-white/80">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          'w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white',
          'placeholder:text-white/30 focus:outline-none focus:border-violet-500/70 focus:bg-white/8',
          'transition-all duration-200',
          error && 'border-red-500/70 focus:border-red-500',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      {hint && !error && <p className="text-xs text-white/40">{hint}</p>}
    </div>
  );
});

export const Textarea = forwardRef(function Textarea(
  { label, error, hint, className = '', required, rows = 4, ...props },
  ref
) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-white/80">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={cn(
          'w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white resize-none',
          'placeholder:text-white/30 focus:outline-none focus:border-violet-500/70 focus:bg-white/8',
          'transition-all duration-200',
          error && 'border-red-500/70 focus:border-red-500',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      {hint && !error && <p className="text-xs text-white/40">{hint}</p>}
    </div>
  );
});

export const Select = forwardRef(function Select(
  { label, error, hint, className = '', required, children, placeholder, ...props },
  ref
) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-white/80">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <select
        ref={ref}
        className={cn(
          'w-full px-4 py-2.5 bg-[#1e1b4b] border border-white/10 rounded-xl text-white',
          'focus:outline-none focus:border-violet-500/70 transition-all duration-200',
          'appearance-none cursor-pointer',
          error && 'border-red-500/70',
          className
        )}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {children}
      </select>
      {error && <p className="text-xs text-red-400">{error}</p>}
      {hint && !error && <p className="text-xs text-white/40">{hint}</p>}
    </div>
  );
});
