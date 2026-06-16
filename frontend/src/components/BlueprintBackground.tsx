'use client';

import React from 'react';

interface BlueprintBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  showCornerMarks?: boolean;
  gridOpacity?: number;
}

export default function BlueprintBackground({
  children,
  className = '',
  showCornerMarks = true,
  gridOpacity = 0.3,
}: BlueprintBackgroundProps) {
  return (
    <div
      className={`blueprint-bg relative overflow-hidden ${className}`}
      style={{
        backgroundColor: 'var(--ink)',
        backgroundImage: `radial-gradient(circle, var(--grid-line) 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
        // @ts-expect-error CSS custom property for opacity
        '--grid-opacity': gridOpacity,
      }}
    >
      {/* Grid overlay with controlled opacity */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, var(--grid-line) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
          opacity: gridOpacity,
        }}
      />

      {/* Corner registration marks */}
      {showCornerMarks && (
        <>
          <CornerMark position="top-left" />
          <CornerMark position="top-right" />
          <CornerMark position="bottom-left" />
          <CornerMark position="bottom-right" />
        </>
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

type CornerPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

function CornerMark({ position }: { position: CornerPosition }) {
  const positionClasses: Record<CornerPosition, string> = {
    'top-left': 'top-3 left-3',
    'top-right': 'top-3 right-3',
    'bottom-left': 'bottom-3 left-3',
    'bottom-right': 'bottom-3 right-3',
  };

  return (
    <span
      className={`absolute ${positionClasses[position]} pointer-events-none select-none`}
      style={{
        color: 'var(--grid-line)',
        opacity: 0.5,
        fontSize: '14px',
        fontFamily: 'var(--font-mono)',
        lineHeight: 1,
      }}
      aria-hidden="true"
    >
      ┼
    </span>
  );
}
