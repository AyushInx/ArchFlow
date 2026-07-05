'use client';

import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

export default function DrawingNode({ data, selected }: NodeProps) {
  const { shape, fill, stroke, strokeWidth, radius, rotation = 0, opacity = 1 } = data as any;

  let renderShape = null;

  switch (shape) {
    case 'rectangle':
      renderShape = (
        <div 
          className="w-full h-full"
          style={{ 
            backgroundColor: fill, 
            borderColor: stroke, 
            borderWidth: `${strokeWidth}px`, 
            borderStyle: 'solid',
            borderRadius: `${radius || 0}px` 
          }} 
        />
      );
      break;
    case 'circle':
      renderShape = (
        <div 
          className="w-full h-full rounded-full"
          style={{ 
            backgroundColor: fill, 
            borderColor: stroke, 
            borderWidth: `${strokeWidth}px`, 
            borderStyle: 'solid'
          }} 
        />
      );
      break;
    case 'triangle':
      renderShape = (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polygon 
            points="50,5 95,95 5,95" 
            fill={fill} 
            stroke={stroke} 
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
        </svg>
      );
      break;
    case 'hexagon':
      renderShape = (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polygon 
            points="50,5 95,25 95,75 50,95 5,75 5,25" 
            fill={fill} 
            stroke={stroke} 
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
        </svg>
      );
      break;
    default:
      renderShape = (
        <div 
          className="w-full h-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center text-xs text-red-500 font-bold"
        >
          Unknown
        </div>
      );
  }

  return (
    <div 
      className="relative w-full h-full group transition-opacity" 
      style={{ 
        width: data.width || 100, 
        height: data.height || 100, 
        transform: `rotate(${rotation}deg)`,
        opacity: opacity 
      }}
    >
      {selected && (
        <div className="absolute -inset-1 border border-[var(--accent-primary)] rounded-sm pointer-events-none z-10" />
      )}
      
      {renderShape}

      {/* Connection Handles */}
      <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-[var(--accent-primary)] !border-none opacity-0 group-hover:opacity-100" />
      <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !bg-[var(--accent-primary)] !border-none opacity-0 group-hover:opacity-100" />
      <Handle type="source" position={Position.Left} id="left" className="!w-2 !h-2 !bg-[var(--accent-primary)] !border-none opacity-0 group-hover:opacity-100" />
      <Handle type="source" position={Position.Right} id="right" className="!w-2 !h-2 !bg-[var(--accent-primary)] !border-none opacity-0 group-hover:opacity-100" />
    </div>
  );
}
