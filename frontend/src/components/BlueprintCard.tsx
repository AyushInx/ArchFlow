'use client';

import React from 'react';

interface BlueprintCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'dark' | 'light';
  showCornerMarks?: boolean;
  hover?: boolean;
}

export default function BlueprintCard({
  children,
  className = '',
  variant = 'dark',
  showCornerMarks = true,
  hover = false,
}: BlueprintCardProps) {
  const bgColor = variant === 'dark' ? 'var(--slate)' : 'var(--paper)';
  const borderColor = 'var(--grid-line)';

  return (
    <div
      className={`blueprint-card relative rounded-lg border p-6 ${hover ? 'blueprint-card--hover' : ''} ${className}`}
      style={{
        backgroundColor: bgColor,
        borderColor: borderColor,
      }}
    >
      {/* Corner marks */}
      {showCornerMarks && (
        <>
          <CardCornerMark position="top-left" />
          <CardCornerMark position="top-right" />
          <CardCornerMark position="bottom-left" />
          <CardCornerMark position="bottom-right" />
        </>
      )}

      {children}
    </div>
  );
}

type CornerPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

function CardCornerMark({ position }: { position: CornerPosition }) {
  const positionClasses: Record<CornerPosition, string> = {
    'top-left': 'top-1.5 left-1.5',
    'top-right': 'top-1.5 right-1.5',
    'bottom-left': 'bottom-1.5 left-1.5',
    'bottom-right': 'bottom-1.5 right-1.5',
  };

  return (
    <span
      className={`absolute ${positionClasses[position]} pointer-events-none select-none`}
      style={{
        color: 'var(--grid-line)',
        opacity: 0.4,
        fontSize: '10px',
        fontFamily: 'var(--font-mono)',
        lineHeight: 1,
      }}
      aria-hidden="true"
    >
      ┼
    </span>
  );
}
