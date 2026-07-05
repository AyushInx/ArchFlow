'use client';

import React, { useState, useEffect } from 'react';
import { Handle, Position, NodeProps, NodeResizeControl } from '@xyflow/react';
import { useDiagramStore } from '@/lib/store';

export default function FrameNode({ id, data, selected }: NodeProps) {
  const { title = 'Frame', fill = 'rgba(0,0,0,0.2)', stroke = '#A1A1AA', strokeWidth = 1, width = 400, height = 300, opacity = 1 } = data as any;
  const updateNode = useDiagramStore(state => state.updateNode);
  const [localTitle, setLocalTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setLocalTitle(title);
  }, [title]);

  const handleBlur = () => {
    setIsEditing(false);
    if (localTitle !== title) {
      updateNode(id, (n) => ({ ...n, data: { ...n.data, title: localTitle } }));
    }
  };

  return (
    <div 
      className="relative group transition-opacity flex flex-col" 
      style={{ 
        width,
        height,
        backgroundColor: fill,
        borderColor: stroke,
        borderWidth: `${strokeWidth}px`,
        borderStyle: 'solid',
        opacity: opacity 
      }}
    >
      <NodeResizeControl style={{ background: 'transparent', border: 'none' }} minWidth={200} minHeight={150}>
        <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-black/20 pointer-events-auto" />
      </NodeResizeControl>

      {selected && (
        <div className="absolute -inset-1 border border-blue-500 rounded-sm pointer-events-none z-10" />
      )}
      
      {/* Title bar */}
      <div 
        className="w-full px-3 py-1 flex items-center border-b border-black/20 bg-black/10 cursor-grab"
        onDoubleClick={() => setIsEditing(true)}
      >
        {isEditing ? (
          <input
            autoFocus
            value={localTitle}
            onChange={(e) => setLocalTitle(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={(e) => { if (e.key === 'Enter') handleBlur(); }}
            className="bg-transparent border-none outline-none text-white font-semibold text-sm w-full nodrag"
          />
        ) : (
          <span className="text-white font-semibold text-sm truncate select-none">{localTitle}</span>
        )}
      </div>

      {/* Frame content area */}
      <div className="flex-1 w-full h-full pointer-events-none" />

      {/* Connection Handles */}
      <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-[var(--accent-primary)] !border-none opacity-0 group-hover:opacity-100" />
      <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !bg-[var(--accent-primary)] !border-none opacity-0 group-hover:opacity-100" />
      <Handle type="source" position={Position.Left} id="left" className="!w-2 !h-2 !bg-[var(--accent-primary)] !border-none opacity-0 group-hover:opacity-100" />
      <Handle type="source" position={Position.Right} id="right" className="!w-2 !h-2 !bg-[var(--accent-primary)] !border-none opacity-0 group-hover:opacity-100" />
    </div>
  );
}
