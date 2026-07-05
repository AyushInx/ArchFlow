'use client';

import React, { useState, useEffect } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { useDiagramStore } from '@/lib/store';

export default function TextNode({ id, data, selected }: NodeProps) {
  const { text = '', fontSize = 16, color = '#F4F4F5', fontWeight = 'normal', rotation = 0, opacity = 1 } = data as any;
  const updateNode = useDiagramStore(state => state.updateNode);
  const [isEditing, setIsEditing] = useState(false);
  const [localText, setLocalText] = useState(text);

  useEffect(() => {
    setLocalText(text);
  }, [text]);

  const handleBlur = () => {
    setIsEditing(false);
    if (localText !== text) {
      updateNode(id, (n) => ({ ...n, data: { ...n.data, text: localText } }));
    }
  };

  return (
    <div 
      className="relative group transition-opacity" 
      style={{ 
        transform: `rotate(${rotation}deg)`,
        opacity: opacity 
      }}
      onDoubleClick={() => setIsEditing(true)}
    >
      {selected && !isEditing && (
        <div className="absolute -inset-1 border border-[var(--accent-primary)]/50 border-dashed rounded-sm pointer-events-none z-10" />
      )}
      
      {isEditing ? (
        <textarea
          autoFocus
          value={localText}
          onChange={(e) => setLocalText(e.target.value)}
          onBlur={handleBlur}
          className="bg-transparent outline-none border-none resize-none overflow-hidden m-0 p-0"
          style={{ 
            color, 
            fontSize: `${fontSize}px`, 
            fontWeight, 
            width: Math.max(100, localText.length * (fontSize * 0.6)) + 'px', 
            height: Math.max(40, localText.split('\n').length * (fontSize * 1.5)) + 'px' 
          }}
        />
      ) : (
        <div 
          className="whitespace-pre-wrap cursor-text"
          style={{ color, fontSize: `${fontSize}px`, fontWeight }}
        >
          {localText || 'Double click to edit'}
        </div>
      )}

      {/* Connection Handles */}
      <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-[var(--accent-primary)] !border-none opacity-0 group-hover:opacity-100" />
      <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !bg-[var(--accent-primary)] !border-none opacity-0 group-hover:opacity-100" />
      <Handle type="source" position={Position.Left} id="left" className="!w-2 !h-2 !bg-[var(--accent-primary)] !border-none opacity-0 group-hover:opacity-100" />
      <Handle type="source" position={Position.Right} id="right" className="!w-2 !h-2 !bg-[var(--accent-primary)] !border-none opacity-0 group-hover:opacity-100" />
    </div>
  );
}
