'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useDiagramStore } from '@/lib/store';
import { useOnSelectionChange } from '@xyflow/react';
import { Type, PaintBucket, Maximize2, MoreHorizontal, PanelRightClose, PanelRightOpen, MousePointer2, Spline } from 'lucide-react';
import { getSocket } from '@/lib/socket';

export default function PropertiesPanel({ isViewOnly }: { isViewOnly: boolean }) {
  const nodes = useDiagramStore(state => state.nodes);
  const edges = useDiagramStore(state => state.edges);
  const updateNode = useDiagramStore(state => state.updateNode);
  const updateEdge = useDiagramStore(state => state.updateEdge);

  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [activeEdgeId, setActiveEdgeId] = useState<string | null>(null);

  useOnSelectionChange({
    onChange: ({ nodes, edges }) => {
      setActiveNodeId(nodes.length === 1 ? nodes[0].id : null);
      setActiveEdgeId(edges.length === 1 ? edges[0].id : null);
    },
  });

  const activeNode = nodes.find(n => n.id === activeNodeId);
  const activeEdge = edges.find(e => e.id === activeEdgeId);
  
  const [activeTab, setActiveTab] = useState('design');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [width, setWidth] = useState(320);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('archflow-inspector-collapsed');
    if (saved === 'true') setIsCollapsed(true);
  }, []);

  const toggleCollapse = () => {
    const nextState = !isCollapsed;
    setIsCollapsed(nextState);
    localStorage.setItem('archflow-inspector-collapsed', nextState.toString());
  };

  const startResizing = useCallback(() => setIsResizing(true), []);
  const stopResizing = useCallback(() => setIsResizing(false), []);

  const resize = useCallback((mouseMoveEvent: MouseEvent) => {
    if (isResizing) {
      const newWidth = window.innerWidth - mouseMoveEvent.clientX - 16;
      if (newWidth >= 320 && newWidth <= 420) {
        setWidth(newWidth);
      }
    }
  }, [isResizing]);

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [resize, stopResizing]);

  const handleNodeUpdate = (updater: (node: any) => any) => {
    if (!activeNodeId || isViewOnly) return;
    updateNode(activeNodeId, updater);

    const socket = getSocket();
    if (socket) {
      const currentNodes = useDiagramStore.getState().nodes;
      const updatedNode = currentNodes.find(n => n.id === activeNodeId);
      if (updatedNode) socket.emit('NODE_UPDATED', updatedNode);
    }
  };

  const updateNodeData = (key: string, value: any) => {
    handleNodeUpdate(node => ({ ...node, data: { ...node.data, [key]: value } }));
  };

  const updatePosition = (axis: 'x' | 'y', val: string) => {
    const value = parseInt(val);
    if (isNaN(value)) return;
    handleNodeUpdate(node => ({ ...node, position: { ...node.position, [axis]: value } }));
  };

  const updateDimensions = (dim: 'width' | 'height', val: string) => {
    const value = parseInt(val);
    if (isNaN(value)) return;
    handleNodeUpdate(node => ({
      ...node,
      [dim]: value,
      data: { ...node.data, [dim]: value },
      style: { ...node.style, [dim]: value }
    }));
  };

  const updateEdgeData = (key: string, value: any) => {
    if (!activeEdgeId || isViewOnly) return;
    updateEdge(activeEdgeId, edge => ({ ...edge, data: { ...edge.data, [key]: value } }));
  };

  if (isCollapsed) {
    return (
      <button
        onClick={toggleCollapse}
        className="absolute top-6 right-6 z-30 p-2.5 rounded-xl cosmic-panel text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all hover:scale-[1.05] shadow-lg animate-fade-in"
      >
        <PanelRightOpen className="w-5 h-5" />
      </button>
    );
  }

  const renderEdgeProperties = () => {
    if (!activeEdge) return null;
    return (
      <div className="p-5 space-y-6 overflow-y-auto flex-1">
        <section>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest">Edge Properties</h4>
            <Spline className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-[10px] text-[var(--text-muted)] mb-1.5 block uppercase tracking-wider">Type</label>
              <select
                value={activeEdge.data?.edgeType as string || 'smooth'}
                onChange={(e) => updateEdgeData('edgeType', e.target.value)}
                disabled={isViewOnly}
                className="w-full bg-black/30 border border-[var(--cosmic-border)] rounded-xl py-2 px-3 text-sm text-[var(--text-primary)] outline-none"
              >
                <option value="smooth">Smooth Step</option>
                <option value="bezier">Bezier</option>
                <option value="straight">Straight</option>
                <option value="step">Step</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-[var(--text-muted)] mb-1.5 block uppercase tracking-wider">Thickness</label>
              <input
                type="number"
                value={activeEdge.data?.thickness as number || 1.5}
                onChange={(e) => updateEdgeData('thickness', parseFloat(e.target.value))}
                disabled={isViewOnly}
                step={0.5}
                className="w-full bg-black/30 border border-[var(--cosmic-border)] rounded-xl py-2 px-3 text-sm text-[var(--text-primary)] outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] text-[var(--text-muted)] mb-1.5 block uppercase tracking-wider">Label</label>
              <input
                type="text"
                value={activeEdge.data?.label as string || activeEdge.data?.protocol as string || ''}
                onChange={(e) => updateEdgeData('label', e.target.value)}
                disabled={isViewOnly}
                className="w-full bg-black/30 border border-[var(--cosmic-border)] rounded-xl py-2 px-3 text-sm text-[var(--text-primary)] outline-none"
              />
            </div>
            
            <div className="flex gap-4 pt-2">
              <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <input type="checkbox" checked={activeEdge.data?.dashed as boolean || false} onChange={e => updateEdgeData('dashed', e.target.checked)} /> Dashed
              </label>
              <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <input type="checkbox" checked={activeEdge.data?.animated as boolean || false} onChange={e => updateEdgeData('animated', e.target.checked)} /> Animated
              </label>
            </div>
          </div>
        </section>
      </div>
    );
  };

  const renderNodeProperties = () => {
    if (!activeNode) return null;
    
    const isDrawingNode = ['DrawingNode', 'FrameNode'].includes(activeNode.type || '');
    const isTextNode = ['TextNode', 'StickyNode'].includes(activeNode.type || '');
    
    return (
      <div className="p-5 space-y-6 overflow-y-auto flex-1">
        {/* Layout */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest">Layout</h4>
            <Maximize2 className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <PropInput icon="W" value={activeNode.data?.width?.toString() || activeNode.style?.width?.toString() || Math.round(activeNode.measured?.width || 0).toString()} onChange={(val) => updateDimensions('width', val)} disabled={isViewOnly} />
            <PropInput icon="H" value={activeNode.data?.height?.toString() || activeNode.style?.height?.toString() || Math.round(activeNode.measured?.height || 0).toString()} onChange={(val) => updateDimensions('height', val)} disabled={isViewOnly} />
            <PropInput icon="X" value={Math.round(activeNode.position.x).toString()} onChange={(val) => updatePosition('x', val)} disabled={isViewOnly} />
            <PropInput icon="Y" value={Math.round(activeNode.position.y).toString()} onChange={(val) => updatePosition('y', val)} disabled={isViewOnly} />
            {isDrawingNode || isTextNode ? (
              <PropInput icon="R" value={activeNode.data?.rotation?.toString() || '0'} onChange={(val) => updateNodeData('rotation', parseInt(val))} disabled={isViewOnly} />
            ) : null}
          </div>
        </section>

        <div className="h-px bg-[var(--cosmic-border)] w-full" />

        {/* Content (For Architecture Nodes mostly) */}
        {!isDrawingNode && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest">Content</h4>
              <Type className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-[var(--text-muted)] mb-1.5 block uppercase tracking-wider">Title / Label</label>
                <input
                  type="text"
                  value={activeNode.data.label as string || activeNode.data.text as string || ''}
                  onChange={(e) => updateNodeData(isTextNode ? 'text' : 'label', e.target.value)}
                  disabled={isViewOnly}
                  className="w-full bg-black/30 border border-[var(--cosmic-border)] rounded-xl py-2 px-3 text-sm text-[var(--text-primary)] outline-none"
                />
              </div>
              {!isTextNode && (
                <>
                  <div>
                    <label className="text-[10px] text-[var(--text-muted)] mb-1.5 block uppercase tracking-wider">Subtitle</label>
                    <input type="text" value={activeNode.data.sublabel as string || ''} onChange={(e) => updateNodeData('sublabel', e.target.value)} disabled={isViewOnly} className="w-full bg-black/30 border border-[var(--cosmic-border)] rounded-xl py-2 px-3 text-sm text-[var(--text-primary)] outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] text-[var(--text-muted)] mb-1.5 block uppercase tracking-wider">Badge</label>
                    <input type="text" value={activeNode.data.badge as string || ''} onChange={(e) => updateNodeData('badge', e.target.value)} disabled={isViewOnly} className="w-full bg-black/30 border border-[var(--cosmic-border)] rounded-xl py-2 px-3 text-sm text-[var(--text-primary)] outline-none" />
                  </div>
                </>
              )}
            </div>
          </section>
        )}

        {/* Frame Content */}
        {activeNode.type === 'FrameNode' && (
          <section>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-[var(--text-muted)] mb-1.5 block uppercase tracking-wider">Frame Title</label>
                <input type="text" value={activeNode.data.title as string || ''} onChange={(e) => updateNodeData('title', e.target.value)} disabled={isViewOnly} className="w-full bg-black/30 border border-[var(--cosmic-border)] rounded-xl py-2 px-3 text-sm text-[var(--text-primary)] outline-none" />
              </div>
            </div>
          </section>
        )}

        {/* Appearance */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest">Appearance</h4>
            <PaintBucket className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          </div>

          <div className="space-y-3">
            {!isDrawingNode ? (
              <div>
                <label className="text-[10px] text-[var(--text-muted)] mb-1.5 block uppercase tracking-wider">Accent Color</label>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg border border-[var(--cosmic-border)]" style={{ backgroundColor: (activeNode.data.accentColor as string) || (activeNode.data.color as string) || '#A855F7' }} />
                  <input type="text" value={(activeNode.data.accentColor as string) || (activeNode.data.color as string) || ''} onChange={(e) => updateNodeData(isTextNode ? 'color' : 'accentColor', e.target.value)} disabled={isViewOnly} className="flex-1 bg-black/30 border border-[var(--cosmic-border)] rounded-xl py-2 px-3 text-sm font-mono text-[var(--text-primary)] outline-none" />
                </div>
              </div>
            ) : (
              <>
                <div>
                  <label className="text-[10px] text-[var(--text-muted)] mb-1.5 block uppercase tracking-wider">Fill Color</label>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg border border-[var(--cosmic-border)]" style={{ backgroundColor: (activeNode.data.fill as string) || 'transparent' }} />
                    <input type="text" value={activeNode.data.fill as string || ''} onChange={(e) => updateNodeData('fill', e.target.value)} disabled={isViewOnly} className="flex-1 bg-black/30 border border-[var(--cosmic-border)] rounded-xl py-2 px-3 text-sm font-mono text-[var(--text-primary)] outline-none" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-[var(--text-muted)] mb-1.5 block uppercase tracking-wider">Stroke Color</label>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg border border-[var(--cosmic-border)]" style={{ backgroundColor: (activeNode.data.stroke as string) || 'transparent' }} />
                    <input type="text" value={activeNode.data.stroke as string || ''} onChange={(e) => updateNodeData('stroke', e.target.value)} disabled={isViewOnly} className="flex-1 bg-black/30 border border-[var(--cosmic-border)] rounded-xl py-2 px-3 text-sm font-mono text-[var(--text-primary)] outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <PropInput icon="W" value={activeNode.data.strokeWidth?.toString() || '0'} onChange={(val) => updateNodeData('strokeWidth', parseInt(val))} disabled={isViewOnly} />
                  <PropInput icon="R" value={activeNode.data.radius?.toString() || '0'} onChange={(val) => updateNodeData('radius', parseInt(val))} disabled={isViewOnly} />
                </div>
              </>
            )}
            <div>
              <label className="text-[10px] text-[var(--text-muted)] mb-1.5 block uppercase tracking-wider">Opacity</label>
              <input type="range" min="0" max="1" step="0.1" value={activeNode.data.opacity as number ?? 1} onChange={(e) => updateNodeData('opacity', parseFloat(e.target.value))} disabled={isViewOnly} className="w-full" />
            </div>
          </div>
        </section>
      </div>
    );
  };

  return (
    <aside
      className="absolute top-4 right-4 bottom-4 cosmic-panel rounded-2xl overflow-hidden flex flex-col shadow-2xl z-30 transition-panel animate-slide-in-right"
      style={{ width: `${width}px` }}
    >
      <div className="absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-[var(--accent-purple)]/40 transition-colors z-40" onMouseDown={startResizing} />

      <div className="p-3 border-b border-[var(--cosmic-border)] bg-[var(--cosmic-primary)]/40 backdrop-blur-xl sticky top-0 z-10 flex items-center justify-between">
        <div className="flex gap-0.5 bg-black/30 p-1 rounded-xl border border-[var(--cosmic-border)]">
          <button onClick={() => setActiveTab('design')} className={`px-3 py-1.5 text-[11px] font-medium rounded-lg transition-all ${activeTab === 'design' ? 'bg-[var(--accent-purple)]/15 text-[var(--accent-purple)] shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}>Design</button>
          <button onClick={() => setActiveTab('inspect')} className={`px-3 py-1.5 text-[11px] font-medium rounded-lg transition-all ${activeTab === 'inspect' ? 'bg-[var(--accent-purple)]/15 text-[var(--accent-purple)] shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}>Inspect</button>
        </div>
        <div className="flex items-center gap-0.5">
          <button className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1.5 rounded-lg transition-all hover:bg-white/5"><MoreHorizontal className="w-4 h-4" /></button>
          <button onClick={toggleCollapse} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1.5 rounded-lg transition-all hover:bg-white/5"><PanelRightClose className="w-4 h-4" /></button>
        </div>
      </div>

      {!activeNodeId && !activeEdgeId ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-[var(--text-muted)]">
          <div className="w-14 h-14 rounded-2xl bg-[var(--accent-purple)]/5 border border-[var(--accent-purple)]/10 flex items-center justify-center mb-4">
            <MousePointer2 className="w-6 h-6 text-[var(--accent-purple)] opacity-40" />
          </div>
          <p className="text-sm font-medium text-[var(--text-secondary)]">Select an item</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">Properties will appear here</p>
        </div>
      ) : activeNodeId ? (
        renderNodeProperties()
      ) : (
        renderEdgeProperties()
      )}
    </aside>
  );
}

function PropInput({ icon, value, onChange, disabled }: { icon: string, value: string, onChange?: (val: string) => void, disabled?: boolean }) {
  const [localVal, setLocalVal] = useState(value);
  const inputId = `prop-input-${icon}`;

  useEffect(() => {
    if (document.activeElement?.id !== inputId) setLocalVal(value);
  }, [value, inputId]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onChange?.(localVal);
      e.currentTarget.blur();
    } else if (e.key === 'Escape') {
      setLocalVal(value);
      e.currentTarget.blur();
    }
  };

  const handleBlur = () => onChange?.(localVal);

  return (
    <div className={`flex items-center bg-black/30 border border-[var(--cosmic-border)] rounded-xl overflow-hidden focus-within:border-[var(--accent-purple)]/40 focus-within:ring-1 focus-within:ring-[var(--accent-purple)]/20 transition-all ${disabled ? 'opacity-40' : ''}`}>
      <div className="w-7 h-8 flex items-center justify-center text-[10px] font-semibold text-[var(--text-muted)] bg-black/20 border-r border-[var(--cosmic-border)]">{icon}</div>
      <input id={inputId} type="text" value={localVal} onChange={(e) => setLocalVal(e.target.value)} onKeyDown={handleKeyDown} onBlur={handleBlur} disabled={disabled} className="w-full h-8 bg-transparent px-2 text-xs text-[var(--text-primary)] outline-none font-mono" />
    </div>
  );
}
