'use client';

import React, { useState, useEffect } from 'react';
import { Handle, Position, NodeProps, NodeResizeControl } from '@xyflow/react';
import { useDiagramStore } from '@/lib/store';
import { GripHorizontal } from 'lucide-react';

export default function StickyNode({ id, data, selected }: NodeProps) {
  const { text = '', color = '#FEF08A', rotation = 0, opacity = 1, width = 200, height = 200 } = data as any;
  const updateNode = useDiagramStore(state => state.updateNode);
  const [localText, setLocalText] = useState(text);

  useEffect(() => {
    setLocalText(text);
  }, [text]);

  const handleBlur = () => {
    if (localText !== text) {
      updateNode(id, (n) => ({ ...n, data: { ...n.data, text: localText } }));
    }
  };

  return (
    <div 
      className="relative group transition-opacity shadow-[4px_4px_15px_rgba(0,0,0,0.3)] hover:shadow-[6px_6px_20px_rgba(0,0,0,0.4)] transition-shadow duration-200 flex flex-col" 
      style={{ 
        width,
        height,
        backgroundColor: color,
        transform: `rotate(${rotation}deg)`,
        opacity: opacity 
      }}
    >
      <NodeResizeControl style={{ background: 'transparent', border: 'none' }} minWidth={100} minHeight={100}>
        <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-black/10 rounded-tl-full pointer-events-auto" />
      </NodeResizeControl>

      {selected && (
        <div className="absolute -inset-1 border-2 border-blue-500 rounded-sm pointer-events-none z-10" />
      )}
      
      {/* Drag handle area (top part) */}
      <div className="h-6 w-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-grab bg-black/5">
        <GripHorizontal className="w-4 h-4 text-black/30" />
      </div>

      <textarea
        value={localText}
        onChange={(e) => setLocalText(e.target.value)}
        onBlur={handleBlur}
        placeholder="Type here..."
        className="flex-1 w-full bg-transparent outline-none border-none resize-none m-0 p-4 text-black/80 font-medium text-sm nodrag"
      />

      {/* Connection Handles */}
      <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-black/40 !border-none opacity-0 group-hover:opacity-100" />
      <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !bg-black/40 !border-none opacity-0 group-hover:opacity-100" />
      <Handle type="source" position={Position.Left} id="left" className="!w-2 !h-2 !bg-black/40 !border-none opacity-0 group-hover:opacity-100" />
      <Handle type="source" position={Position.Right} id="right" className="!w-2 !h-2 !bg-black/40 !border-none opacity-0 group-hover:opacity-100" />
    </div>
  );
}
