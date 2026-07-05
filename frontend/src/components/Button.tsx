'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'ghost' | 'teal' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent-purple)]/30 focus:ring-offset-0 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.97] hover:scale-[1.02]';

  const variantClasses: Record<string, string> = {
    primary:
      'bg-white text-[var(--cosmic-primary)] hover:bg-[var(--text-primary)] shadow-sm hover:shadow-md border border-transparent',
    danger:
      'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20',
    ghost:
      'bg-transparent text-[var(--text-muted)] border border-transparent hover:bg-white/5 hover:text-[var(--text-primary)]',
    teal:
      'bg-[var(--accent-teal)] text-[var(--cosmic-primary)] hover:brightness-110 shadow-md shadow-teal-500/20',
    outline:
      'bg-transparent text-[var(--text-primary)] border border-[var(--cosmic-border)] hover:bg-white/5 hover:border-white/15',
  };

  const sizeClasses: Record<string, string> = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3 text-sm gap-2.5',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
