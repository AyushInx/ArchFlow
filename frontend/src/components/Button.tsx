'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'ghost' | 'teal';
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
    'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses: Record<string, string> = {
    primary:
      'bg-[var(--amber-signal)] text-[var(--ink)] hover:brightness-110 focus:ring-[var(--amber-signal)] shadow-md hover:shadow-lg active:scale-[0.98]',
    danger:
      'bg-[var(--coral-alert)] text-white hover:brightness-110 focus:ring-[var(--coral-alert)] shadow-md hover:shadow-lg active:scale-[0.98]',
    ghost:
      'bg-transparent text-[var(--grid-line)] border border-[var(--grid-line)] hover:bg-[var(--grid-line)]/10 hover:text-white focus:ring-[var(--grid-line)]',
    teal:
      'bg-[var(--teal-circuit)] text-[var(--ink)] hover:brightness-110 focus:ring-[var(--teal-circuit)] shadow-md hover:shadow-lg active:scale-[0.98]',
  };

  const sizeClasses: Record<string, string> = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3.5 text-base gap-2.5',
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
