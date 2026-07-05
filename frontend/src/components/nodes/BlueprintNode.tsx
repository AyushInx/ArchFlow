import React from 'react';
import { Handle, Position, NodeResizer, useReactFlow } from '@xyflow/react';
import { Lock, MessageSquare } from 'lucide-react';

interface BlueprintNodeProps {
  id: string;
  icon: React.ElementType;
  label: string;
  sublabel?: string;
  selected?: boolean;
  accentColor: string;
  badge?: string;
  data?: any;
}

export default function BlueprintNode({ id, icon: Icon, label, sublabel, selected, accentColor, badge, data }: BlueprintNodeProps) {
  const { setNodes } = useReactFlow();

  const isLocked = data?.isLocked;
  const hasComments = data?.comments?.length > 0;
  const commentsCount = data?.comments?.length || 0;

  const handleDoubleClick = () => {
    if (isLocked) return;
    setNodes((nodes) =>
      nodes.map((n) => {
        if (n.id === id) {
          const { width, height, ...restStyle } = n.style || {};
          return { ...n, style: restStyle, measured: undefined };
        }
        return n;
      })
    );
  };

  return (
    <>
      <NodeResizer
        color={accentColor}
        isVisible={selected && !isLocked}
        minWidth={160}
        minHeight={60}
        maxWidth={520}
        maxHeight={260}
      />
      <div
        onDoubleClick={handleDoubleClick}
        className={`
          relative w-full h-full rounded-xl p-4 
          flex flex-col justify-center 
          animate-node-create overflow-hidden
          transition-all duration-200 group
          backdrop-blur-2xl
          ${selected
            ? 'z-10'
            : 'hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)]'
          }
          ${isLocked ? 'cursor-not-allowed' : ''}
        `}
        style={{
          background: 'rgba(30, 24, 45, 0.92)',
          border: selected
            ? `1.5px solid ${accentColor}`
            : '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: selected
            ? `0 0 24px color-mix(in srgb, ${accentColor} 25%, transparent), 0 8px 32px rgba(0,0,0,0.4)`
            : '0 4px 16px rgba(0, 0, 0, 0.3)',
          opacity: isLocked ? 0.85 : 1,
        }}
      >
        {/* Selected animated glow ring */}
        {selected && (
          <div
            className="absolute inset-[-1px] rounded-xl pointer-events-none animate-border-glow"
            style={{
              border: `1.5px solid ${accentColor}`,
              boxShadow: `0 0 20px color-mix(in srgb, ${accentColor} 30%, transparent)`,
            }}
          />
        )}

        {/* Handles */}
        <Handle
          type="target"
          position={Position.Top}
          className="!w-2.5 !h-2.5 !bg-[rgba(30,24,45,0.92)] !border-2 transition-colors !top-[-5px]"
          style={{ borderColor: accentColor }}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          className="!w-2.5 !h-2.5 !bg-[rgba(30,24,45,0.92)] !border-2 transition-colors !bottom-[-5px]"
          style={{ borderColor: accentColor }}
        />
        <Handle
          type="target"
          position={Position.Left}
          id="left"
          className="!w-2.5 !h-2.5 !bg-[rgba(30,24,45,0.92)] !border-2 transition-colors !left-[-5px]"
          style={{ borderColor: accentColor }}
        />
        <Handle
          type="source"
          position={Position.Right}
          id="right"
          className="!w-2.5 !h-2.5 !bg-[rgba(30,24,45,0.92)] !border-2 transition-colors !right-[-5px]"
          style={{ borderColor: accentColor }}
        />

        <div className="flex items-start gap-3 h-full w-full relative z-10">
          {/* Icon Container */}
          <div
            className="flex-shrink-0 w-11 h-11 rounded-lg flex items-center justify-center border shadow-inner"
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              borderColor: `color-mix(in srgb, ${accentColor} 20%, transparent)`,
            }}
          >
            <Icon className="w-5 h-5" style={{ color: accentColor }} />
          </div>

          <div className="flex-1 min-w-0 flex flex-col justify-center overflow-hidden">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[13px] font-semibold text-[var(--text-primary)] break-words leading-tight">{label}</p>
              {/* Status Dot */}
              <div
                className="flex-shrink-0 w-2 h-2 rounded-full"
                style={{
                  backgroundColor: accentColor,
                  boxShadow: `0 0 8px ${accentColor}`,
                }}
              />
            </div>

            {sublabel && (
              <p className="text-[11px] text-[var(--text-muted)] break-words leading-tight mt-1">{sublabel}</p>
            )}

            {badge && (
              <div
                className="mt-2 inline-flex items-center self-start px-2 py-0.5 rounded-full text-[9px] font-mono tracking-wide uppercase"
                style={{
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: `1px solid color-mix(in srgb, ${accentColor} 25%, transparent)`,
                  color: accentColor,
                }}
              >
                {badge}
              </div>
            )}
          </div>
          
          {/* Top Right Badges (Lock & Comments) */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            {hasComments && (
              <div 
                className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[var(--cosmic-primary)] border border-[var(--cosmic-border)] text-[var(--text-muted)] text-[10px] font-medium"
                title={`${commentsCount} comment${commentsCount > 1 ? 's' : ''}`}
              >
                <MessageSquare className="w-3 h-3" />
                <span>{commentsCount}</span>
              </div>
            )}
            {isLocked && (
              <div className="w-5 h-5 rounded-md bg-black/40 border border-white/10 flex items-center justify-center" title="Locked">
                <Lock className="w-3 h-3 text-[var(--text-muted)]" />
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}
