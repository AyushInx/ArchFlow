'use client';

import React from 'react';
import { useDiagramStore } from '@/lib/store';
import { useReactFlow } from '@xyflow/react';

export default function LiveCursors() {
  const cursors = useDiagramStore((state) => state.cursors);
  const { flowToScreenPosition } = useReactFlow();

  return (
    <div className="absolute inset-0 pointer-events-none z-50">
      {Object.values(cursors).map((cursor) => {
        // Convert the flow coordinates back to screen coordinates so the cursors
        // overlay correctly on the absolute container
        const position = flowToScreenPosition({ x: cursor.x, y: cursor.y });
        
        return (
          <div
            key={cursor.socketId}
            className="absolute transition-all duration-100 ease-linear pointer-events-none"
            style={{
              transform: `translate(${position.x}px, ${position.y}px)`,
            }}
          >
            {/* Cursor SVG */}
            <svg
              width="24"
              height="36"
              viewBox="0 0 24 36"
              fill="none"
              stroke="white"
              strokeWidth="2"
              className="drop-shadow-md text-[var(--teal-circuit)]"
            >
              <path d="M5.65376 21.1597L2.06349 3.33235C1.65083 1.2828 3.96347 -0.19825 5.76106 0.967909L22.2599 11.6669C24.0886 12.8526 23.6309 15.6886 21.5031 16.3601L14.421 18.5954C13.8821 18.7655 13.4116 19.1417 13.1118 19.6457L9.63853 25.4851C8.54486 27.3242 5.92211 26.6852 5.65376 24.1597Z" fill="currentColor"/>
            </svg>
            
            {/* Name badge */}
            <div
              className="absolute left-6 top-6 bg-[var(--teal-circuit)] text-[var(--ink)] text-xs px-2 py-1 rounded font-bold font-mono whitespace-nowrap"
            >
              {cursor.user.name}
            </div>
          </div>
        );
      })}
    </div>
  );
}
