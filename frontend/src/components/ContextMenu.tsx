'use client';

import React, { useEffect, useState } from 'react';
import { useDiagramStore } from '@/lib/store';
import { 
  Copy, Trash2, Group, Ungroup, ChevronUp, ChevronDown, 
  Lock, Unlock, Type, StickyNote, BoxSelect, Maximize 
} from 'lucide-react';
import { useReactFlow } from '@xyflow/react';

interface ContextMenuProps {
  x: number;
  y: number;
  nodeId?: string;
  edgeId?: string;
  onClose: () => void;
}

export default function ContextMenu({ x, y, nodeId, edgeId, onClose }: ContextMenuProps) {
  const nodes = useDiagramStore(state => state.nodes);
  const deleteNode = useDiagramStore(state => state.deleteNode);
  const deleteEdge = useDiagramStore(state => state.deleteEdge);
  const duplicateNode = useDiagramStore(state => state.duplicateNode);
  const bringForward = useDiagramStore(state => state.bringForward);
  const sendBackward = useDiagramStore(state => state.sendBackward);
  const updateNode = useDiagramStore(state => state.updateNode);
  
  const { fitView } = useReactFlow();

  const [menuHeight, setMenuHeight] = useState(0);

  useEffect(() => {
    const handleGlobalClick = () => onClose();
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, [onClose]);

  const targetNode = nodeId ? nodes.find(n => n.id === nodeId) : null;
  const isLocked = targetNode?.data?.isLocked;

  // Prevent menu from overflowing screen bottom
  const adjustedY = y + menuHeight > window.innerHeight ? window.innerHeight - menuHeight - 10 : y;

  return (
    <div 
      className="absolute z-[100] w-48 bg-[var(--cosmic-card)] border border-[var(--cosmic-border)] rounded-xl shadow-2xl py-1 animate-fade-in"
      style={{ left: x, top: adjustedY }}
      ref={el => { if (el && menuHeight === 0) setMenuHeight(el.offsetHeight); }}
      onClick={(e) => e.stopPropagation()}
    >
      {nodeId && targetNode ? (
        <>
          <MenuItem icon={<Copy className="w-3.5 h-3.5" />} label="Duplicate" onClick={() => { duplicateNode(nodeId); onClose(); }} disabled={isLocked} />
          <MenuItem 
            icon={isLocked ? <Unlock className="w-3.5 h-3.5 text-yellow-400" /> : <Lock className="w-3.5 h-3.5" />} 
            label={isLocked ? "Unlock" : "Lock"} 
            onClick={() => { updateNode(nodeId, n => ({ ...n, data: { ...n.data, isLocked: !isLocked } })); onClose(); }} 
          />
          <div className="h-px bg-white/10 my-1 mx-2" />
          <MenuItem icon={<ChevronUp className="w-3.5 h-3.5" />} label="Bring Forward" onClick={() => { bringForward(nodeId); onClose(); }} />
          <MenuItem icon={<ChevronDown className="w-3.5 h-3.5" />} label="Send Backward" onClick={() => { sendBackward(nodeId); onClose(); }} />
          <div className="h-px bg-white/10 my-1 mx-2" />
          <MenuItem icon={<Trash2 className="w-3.5 h-3.5 text-red-400" />} label="Delete" onClick={() => { deleteNode(nodeId); onClose(); }} disabled={isLocked} isDanger />
        </>
      ) : edgeId ? (
        <>
          <MenuItem icon={<Trash2 className="w-3.5 h-3.5 text-red-400" />} label="Delete Edge" onClick={() => { deleteEdge(edgeId); onClose(); }} isDanger />
        </>
      ) : (
        <>
          <MenuItem icon={<Type className="w-3.5 h-3.5" />} label="Add Text" onClick={() => { alert('Use sidebar to add text'); onClose(); }} />
          <MenuItem icon={<StickyNote className="w-3.5 h-3.5" />} label="Add Sticky Note" onClick={() => { alert('Use sidebar to add sticky'); onClose(); }} />
          <MenuItem icon={<BoxSelect className="w-3.5 h-3.5" />} label="Add Frame" onClick={() => { alert('Use sidebar to add frame'); onClose(); }} />
          <div className="h-px bg-white/10 my-1 mx-2" />
          <MenuItem icon={<Maximize className="w-3.5 h-3.5" />} label="Fit to Screen" onClick={() => { fitView({ padding: 0.2, duration: 800 }); onClose(); }} />
        </>
      )}
    </div>
  );
}

function MenuItem({ icon, label, onClick, disabled, isDanger }: { icon: React.ReactNode, label: string, onClick: () => void, disabled?: boolean, isDanger?: boolean }) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      className={`w-full flex items-center gap-3 px-3 py-1.5 text-sm transition-colors
        ${disabled ? 'opacity-30 cursor-not-allowed text-[var(--text-muted)]' : 
          isDanger ? 'hover:bg-red-500/15 text-[var(--text-primary)] hover:text-red-400' : 
          'hover:bg-[var(--accent-primary)]/20 text-[var(--text-primary)] hover:text-[var(--accent-primary)]'}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
