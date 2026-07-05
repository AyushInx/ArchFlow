'use client';

import React, { useState, useEffect } from 'react';
import { useDiagramStore } from '@/lib/store';
import { useReactFlow, useOnSelectionChange } from '@xyflow/react';
import { 
  Trash2, Copy, Lock, Unlock, ChevronUp, ChevronDown, 
  Palette, MousePointer2, Type, Group, AlignLeft
} from 'lucide-react';

export default function SelectionToolbar() {
  const nodes = useDiagramStore(state => state.nodes);
  const edges = useDiagramStore(state => state.edges);
  const updateNode = useDiagramStore(state => state.updateNode);
  const updateNodes = useDiagramStore(state => state.updateNodes);
  const deleteNode = useDiagramStore(state => state.deleteNode);
  const duplicateNode = useDiagramStore(state => state.duplicateNode);
  const bringForward = useDiagramStore(state => state.bringForward);
  const sendBackward = useDiagramStore(state => state.sendBackward);
  
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
  const [selectedEdgeIds, setSelectedEdgeIds] = useState<string[]>([]);

  useOnSelectionChange({
    onChange: ({ nodes, edges }) => {
      setSelectedNodeIds(nodes.map(n => n.id));
      setSelectedEdgeIds(edges.map(e => e.id));
    },
  });

  if (selectedNodeIds.length === 0 && selectedEdgeIds.length === 0) return null;

  const isMulti = selectedNodeIds.length > 1;
  const activeNodes = nodes.filter(n => selectedNodeIds.includes(n.id));
  const primaryNode = activeNodes[0];
  const isLocked = activeNodes.every(n => n.data?.isLocked);

  const handleDelete = () => {
    selectedNodeIds.forEach(id => {
      if (!nodes.find(n => n.id === id)?.data?.isLocked) {
        deleteNode(id);
      }
    });
  };

  const handleDuplicate = () => {
    selectedNodeIds.forEach(id => {
      if (!nodes.find(n => n.id === id)?.data?.isLocked) {
        duplicateNode(id);
      }
    });
  };

  const handleLockToggle = () => {
    updateNodes(nds => nds.map(n => {
      if (selectedNodeIds.includes(n.id)) {
        return { ...n, data: { ...n.data, isLocked: !isLocked } };
      }
      return n;
    }));
  };

  const handleColorChange = (color: string) => {
    updateNodes(nds => nds.map(n => {
      if (selectedNodeIds.includes(n.id)) {
        if (n.type === 'DrawingNode' || n.type === 'FrameNode') {
          return { ...n, data: { ...n.data, fill: color } };
        }
        if (n.type === 'TextNode' || n.type === 'StickyNode') {
          return { ...n, data: { ...n.data, color } };
        }
      }
      return n;
    }));
  };

  const colors = [
    'rgba(239, 68, 68, 0.2)', // Red
    'rgba(245, 158, 11, 0.2)', // Orange
    'rgba(16, 185, 129, 0.2)', // Green
    'rgba(59, 130, 246, 0.2)', // Blue
    'rgba(139, 92, 246, 0.2)', // Purple
    'rgba(255, 255, 255, 0.1)' // White
  ];

  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 animate-fade-in pointer-events-auto">
      <div className="bg-[var(--cosmic-card)] border border-[var(--cosmic-border)] rounded-xl shadow-2xl flex items-center p-1.5 gap-1">
        
        {/* Colors (Only for shapes/text) */}
        {!isMulti && primaryNode && ['DrawingNode', 'FrameNode', 'StickyNode'].includes(primaryNode.type || '') && (
          <div className="flex items-center gap-1 pr-2 border-r border-white/10">
            {colors.map(c => (
              <button 
                key={c}
                onClick={() => handleColorChange(c)}
                className="w-5 h-5 rounded-full border border-white/20 hover:scale-110 transition-transform"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        )}

        {/* Alignment (Only Multi) */}
        {isMulti && (
          <div className="flex items-center gap-1 pr-2 border-r border-white/10 text-[var(--text-muted)]">
            <button className="p-1.5 hover:bg-white/10 rounded-lg hover:text-white" title="Group (Ctrl+G)">
              <Group className="w-4 h-4" />
            </button>
            <button className="p-1.5 hover:bg-white/10 rounded-lg hover:text-white" title="Align">
              <AlignLeft className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Layering */}
        <div className="flex items-center gap-1 pr-2 border-r border-white/10 text-[var(--text-muted)]">
          <button onClick={() => selectedNodeIds.forEach(bringForward)} className="p-1.5 hover:bg-white/10 rounded-lg hover:text-white" title="Bring Forward">
            <ChevronUp className="w-4 h-4" />
          </button>
          <button onClick={() => selectedNodeIds.forEach(sendBackward)} className="p-1.5 hover:bg-white/10 rounded-lg hover:text-white" title="Send Backward">
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Common Actions */}
        <div className="flex items-center gap-1 text-[var(--text-muted)]">
          <button onClick={handleLockToggle} className={`p-1.5 hover:bg-white/10 rounded-lg ${isLocked ? 'text-yellow-400' : 'hover:text-white'}`} title={isLocked ? "Unlock" : "Lock"}>
            {isLocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          </button>
          <button onClick={handleDuplicate} className="p-1.5 hover:bg-white/10 rounded-lg hover:text-white" title="Duplicate">
            <Copy className="w-4 h-4" />
          </button>
          <button onClick={handleDelete} className="p-1.5 hover:bg-red-500/20 rounded-lg hover:text-red-400" title="Delete">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
