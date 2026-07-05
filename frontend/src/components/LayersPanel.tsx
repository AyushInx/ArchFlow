'use client';

import React, { useState } from 'react';
import { useDiagramStore } from '@/lib/store';
import { Layers, Eye, EyeOff, Lock, Unlock, ChevronUp, ChevronDown, Trash2 } from 'lucide-react';
import { useReactFlow } from '@xyflow/react';

export default function LayersPanel() {
  const nodes = useDiagramStore(state => state.nodes);
  const edges = useDiagramStore(state => state.edges);
  const updateNode = useDiagramStore(state => state.updateNode);
  const deleteNode = useDiagramStore(state => state.deleteNode);
  const bringForward = useDiagramStore(state => state.bringForward);
  const sendBackward = useDiagramStore(state => state.sendBackward);
  
  const { setNodes } = useReactFlow();

  const [isExpanded, setIsExpanded] = useState(true);

  // Sort nodes by z-index to display them in layer order
  const sortedNodes = [...nodes].sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0));

  const toggleVisibility = (id: string, currentHidden: boolean) => {
    updateNode(id, n => ({ ...n, hidden: !currentHidden }));
  };

  const toggleLock = (id: string, currentLocked: boolean) => {
    updateNode(id, n => ({ ...n, data: { ...n.data, isLocked: !currentLocked } }));
  };

  const handleSelect = (id: string) => {
    setNodes(nds => nds.map(n => ({ ...n, selected: n.id === id })));
  };

  if (!isExpanded) {
    return (
      <button 
        onClick={() => setIsExpanded(true)}
        className="absolute top-20 right-5 z-40 bg-[var(--cosmic-card)] border border-[var(--cosmic-border)] rounded-xl p-2.5 shadow-lg text-[var(--text-muted)] hover:text-white transition-colors"
      >
        <Layers className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="absolute top-20 right-5 z-40 w-64 bg-[var(--cosmic-card)] border border-[var(--cosmic-border)] rounded-xl shadow-2xl flex flex-col max-h-[60vh] overflow-hidden animate-fade-in">
      <div className="p-3 border-b border-[var(--cosmic-border)] flex items-center justify-between bg-black/20">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
          <Layers className="w-4 h-4 text-[var(--accent-primary)]" />
          Layers
        </h3>
        <button onClick={() => setIsExpanded(false)} className="text-[var(--text-muted)] hover:text-white text-xs px-2 py-1 bg-white/5 rounded-md">
          Hide
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {sortedNodes.length === 0 && (
          <div className="text-center py-4 text-xs text-[var(--text-muted)]">Canvas is empty</div>
        )}
        
        {sortedNodes.map((node) => {
          const isLocked = node.data?.isLocked || false;
          const isHidden = node.hidden || false;

          return (
            <div 
              key={node.id} 
              className={`flex items-center justify-between p-2 rounded-lg text-sm border border-transparent transition-colors ${node.selected ? 'bg-[var(--accent-primary)]/20 border-[var(--accent-primary)]/30 text-white' : 'hover:bg-white/5 text-[var(--text-muted)]'}`}
              onClick={() => handleSelect(node.id)}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-3 h-3 rounded-sm bg-white/10 shrink-0 flex items-center justify-center text-[8px] font-bold">
                  {node.type === 'DrawingNode' ? 'D' : node.type === 'TextNode' ? 'T' : 'N'}
                </div>
                <span className="truncate flex-1 max-w-[100px] cursor-pointer text-xs">
                  {node.data?.label || node.data?.title || node.data?.text || node.type}
                </span>
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ opacity: node.selected ? 1 : undefined }}>
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleVisibility(node.id, isHidden); }}
                  className="p-1 hover:text-white rounded"
                >
                  {isHidden ? <EyeOff className="w-3.5 h-3.5 text-red-400" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleLock(node.id, isLocked); }}
                  className="p-1 hover:text-white rounded"
                >
                  {isLocked ? <Lock className="w-3.5 h-3.5 text-yellow-400" /> : <Unlock className="w-3.5 h-3.5" />}
                </button>
                <button onClick={(e) => { e.stopPropagation(); bringForward(node.id); }} className="p-1 hover:text-[var(--accent-primary)] rounded">
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); sendBackward(node.id); }} className="p-1 hover:text-[var(--accent-primary)] rounded">
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
