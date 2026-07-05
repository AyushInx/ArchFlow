'use client';

import React from 'react';
import { MousePointer2, Hand, Waypoints, Undo2, Redo2, ZoomIn, ZoomOut, LayoutTemplate, Wand2, Download, LocateFixed, Network } from 'lucide-react';
import { useReactFlow } from '@xyflow/react';

export default function TopToolbar({ onAIGenerate, onExport, isViewOnly }: { onAIGenerate: () => void, onExport: () => void, isViewOnly: boolean }) {
  const { zoomIn, zoomOut, fitView, setCenter } = useReactFlow();

  if (isViewOnly) return null;

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40">
      <div className="cosmic-panel rounded-2xl px-2 py-1.5 flex items-center gap-0.5 shadow-2xl animate-fade-in">
        <ToolButton icon={MousePointer2} tooltip="Select (V)" />
        <ToolButton icon={Hand} tooltip="Pan (H)" />
        <ToolButton icon={Waypoints} tooltip="Connect (C)" />
        <Divider />
        <ToolButton icon={Undo2} tooltip="Undo (⌘Z)" />
        <ToolButton icon={Redo2} tooltip="Redo (⌘⇧Z)" />
        <Divider />
        <ToolButton icon={ZoomOut} onClick={() => zoomOut()} tooltip="Zoom Out" />
        <ToolButton icon={ZoomIn} onClick={() => zoomIn()} tooltip="Zoom In" />
        <ToolButton icon={LayoutTemplate} onClick={() => fitView({ duration: 800 })} tooltip="Fit View" />
        <ToolButton icon={LocateFixed} onClick={() => setCenter(0, 0, { duration: 800 })} tooltip="Center" />
        <ToolButton icon={Network} tooltip="Auto Layout" />
        <Divider />
        <button
          onClick={onAIGenerate}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-pink)] text-white text-[11px] font-semibold hover:opacity-90 hover:scale-[1.02] transition-all shadow-md shadow-purple-500/20"
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span>AI Generate</span>
        </button>
        <button
          onClick={onExport}
          className="flex items-center gap-1.5 px-3 py-2 ml-0.5 rounded-xl bg-white/5 text-[var(--text-primary)] text-[11px] font-medium border border-[var(--cosmic-border)] hover:bg-white/10 hover:scale-[1.02] transition-all"
        >
          <Download className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          <span>Export</span>
        </button>
      </div>
    </div>
  );
}

function Divider() {
  return <div className="w-px h-5 bg-white/8 mx-1" />;
}

function ToolButton({ icon: Icon, active, onClick, tooltip }: any) {
  return (
    <button
      onClick={onClick}
      title={tooltip}
      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150 relative group ${
        active
          ? 'bg-[var(--accent-purple)]/15 text-[var(--accent-purple)]'
          : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5 hover:scale-[1.05]'
      }`}
    >
      <Icon className="w-4 h-4" />
      {/* Tooltip */}
      <span className="absolute -bottom-9 left-1/2 -translate-x-1/2 bg-[var(--cosmic-primary)] border border-[var(--cosmic-border)] text-[var(--text-primary)] text-[10px] font-medium py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl z-50">
        {tooltip}
      </span>
    </button>
  );
}
