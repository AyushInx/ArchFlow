'use client';

import React, { useState } from 'react';
import { MessageSquare, StickyNote, Code2, Image as ImageIcon, Lock, Unlock, Trash2, Sparkles, Copy } from 'lucide-react';
import { useDiagramStore } from '@/lib/store';
import { useOnSelectionChange } from '@xyflow/react';
import NodeModals from './NodeModals';

export default function BottomDock({ isViewOnly }: { isViewOnly: boolean }) {
  const deleteNode = useDiagramStore(state => state.deleteNode);
  const updateNode = useDiagramStore(state => state.updateNode);
  const duplicateNode = useDiagramStore(state => state.duplicateNode);
  const nodes = useDiagramStore(state => state.nodes);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<'comments' | 'docs' | 'code' | 'images' | 'ai' | null>(null);

  useOnSelectionChange({
    onChange: ({ nodes }) => {
      setActiveNodeId(nodes.length === 1 ? nodes[0].id : null);
    },
  });

  if (isViewOnly) return null;

  const activeNode = nodes.find(n => n.id === activeNodeId);
  const isLocked = activeNode?.data?.isLocked || false;

  const handleDelete = () => {
    if (activeNodeId && !isLocked) {
      deleteNode(activeNodeId);
      setActiveModal(null);
    }
  };

  const handleDuplicate = () => {
    if (activeNodeId && !isLocked) {
      duplicateNode(activeNodeId);
    }
  };

  const handleLock = () => {
    if (activeNodeId) {
      updateNode(activeNodeId, n => ({
        ...n,
        data: { ...n.data, isLocked: !n.data?.isLocked }
      }));
    }
  };

  return (
    <>
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-40">
        <div className="cosmic-panel rounded-2xl px-2 py-1.5 flex items-center gap-0.5 shadow-2xl animate-fade-in">
          <DockItem icon={MessageSquare} label="Comment" disabled={!activeNodeId} onClick={() => setActiveModal('comments')} />
          <DockItem icon={StickyNote} label="Documentation" disabled={!activeNodeId} onClick={() => setActiveModal('docs')} />
          <DockItem icon={Code2} label="Code Snippets" disabled={!activeNodeId} onClick={() => setActiveModal('code')} />
          <DockItem icon={ImageIcon} label="Images" disabled={!activeNodeId} onClick={() => setActiveModal('images')} />
          <div className="w-px h-5 bg-white/8 mx-1.5" />
          <DockItem icon={isLocked ? Unlock : Lock} label={isLocked ? "Unlock" : "Lock"} disabled={!activeNodeId} onClick={handleLock} isActive={isLocked} />
          <DockItem icon={Sparkles} label="AI Explain" disabled={!activeNodeId || isLocked} onClick={() => setActiveModal('ai')} />
          <DockItem icon={Copy} label="Duplicate" disabled={!activeNodeId || isLocked} onClick={handleDuplicate} />
          <DockItem icon={Trash2} label="Delete" disabled={!activeNodeId || isLocked} onClick={handleDelete} isDanger />
        </div>
      </div>
      
      {/* Modals rendered relative to viewport */}
      <NodeModals 
        activeNodeId={activeNodeId!} 
        activeModal={activeModal} 
        onClose={() => setActiveModal(null)} 
      />
    </>
  );
}

function DockItem({ icon: Icon, label, disabled, onClick, isDanger, isActive }: any) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      title={label}
      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150 relative group ${
        disabled
          ? 'opacity-25 cursor-not-allowed'
          : isDanger
            ? 'hover:bg-red-500/15 hover:text-red-400 text-[var(--text-muted)] hover:scale-[1.05]'
            : isActive
              ? 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/8 hover:scale-[1.05]'
      }`}
    >
      <Icon className="w-[18px] h-[18px]" />
      {/* Tooltip */}
      <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-[var(--cosmic-primary)] border border-[var(--cosmic-border)] text-[var(--text-primary)] text-[10px] font-medium py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl z-50">
        {label}
      </span>
    </button>
  );
}
