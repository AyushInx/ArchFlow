import React from 'react';
import { Handle, Position } from '@xyflow/react';

interface BlueprintNodeProps {
  icon: string;
  label: string;
  sublabel?: string;
  selected?: boolean;
}

export default function BlueprintNode({ icon, label, sublabel, selected }: BlueprintNodeProps) {
  return (
    <div
      className={`relative rounded-lg border bg-[var(--slate)] p-3 min-w-[150px] shadow-md transition-colors ${
        selected ? 'border-[var(--amber-signal)] ring-1 ring-[var(--amber-signal)]' : 'border-[var(--grid-line)]'
      }`}
    >
      {/* Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-[var(--grid-line)] border-2 border-[var(--ink)]"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-[var(--grid-line)] border-2 border-[var(--ink)]"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="w-3 h-3 bg-[var(--grid-line)] border-2 border-[var(--ink)]"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="w-3 h-3 bg-[var(--grid-line)] border-2 border-[var(--ink)]"
      />

      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 text-2xl">{icon}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white font-heading truncate">{label}</p>
          {sublabel && (
            <p className="text-xs text-[var(--grid-line)] font-mono truncate">{sublabel}</p>
          )}
        </div>
      </div>
    </div>
  );
}
