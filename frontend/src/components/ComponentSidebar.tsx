'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useReactFlow } from '@xyflow/react';
import { useDiagramStore } from '@/lib/store';
import { getSocket } from '@/lib/socket';
import { SHAPE_REGISTRY, ShapeDefinition } from '@/lib/shapes';
import {
  Search, PanelLeftClose, PanelLeftOpen, GripVertical, Star, History, LayoutGrid, PenTool, ChevronDown
} from 'lucide-react';

const generateId = () => Math.random().toString(36).substr(2, 9);

export default function ComponentSidebar() {
  const { screenToFlowPosition } = useReactFlow();
  const addNode = useDiagramStore(state => state.addNode);

  const [search, setSearch] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [width, setWidth] = useState(320);
  const [isResizing, setIsResizing] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [componentsExpanded, setComponentsExpanded] = useState(true);
  const [drawingExpanded, setDrawingExpanded] = useState(true);

  useEffect(() => {
    const savedCol = localStorage.getItem('archflow-sidebar-collapsed');
    if (savedCol === 'true') setIsCollapsed(true);
    
    const savedFav = localStorage.getItem('archflow-favorites');
    if (savedFav) setFavorites(JSON.parse(savedFav));
    
    const savedRec = localStorage.getItem('archflow-recent');
    if (savedRec) setRecent(JSON.parse(savedRec));
  }, []);

  const toggleCollapse = () => {
    const nextState = !isCollapsed;
    setIsCollapsed(nextState);
    localStorage.setItem('archflow-sidebar-collapsed', nextState.toString());
  };

  const toggleFavorite = (e: React.MouseEvent, type: string, shapeId?: string) => {
    e.stopPropagation();
    const id = shapeId ? `${type}:${shapeId}` : type;
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      localStorage.setItem('archflow-favorites', JSON.stringify(next));
      return next;
    });
  };

  const addRecent = (type: string, shapeId?: string) => {
    const id = shapeId ? `${type}:${shapeId}` : type;
    setRecent(prev => {
      const filtered = prev.filter(r => r !== id);
      const next = [id, ...filtered].slice(0, 2); // Keep top 2 recent
      localStorage.setItem('archflow-recent', JSON.stringify(next));
      return next;
    });
  };

  const startResizing = useCallback(() => setIsResizing(true), []);
  const stopResizing = useCallback(() => setIsResizing(false), []);

  const resize = useCallback((mouseMoveEvent: MouseEvent) => {
    if (isResizing) {
      const newWidth = mouseMoveEvent.clientX;
      if (newWidth >= 280 && newWidth <= 420) {
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

  const onDragStart = (event: React.DragEvent<HTMLDivElement>, shape: ShapeDefinition) => {
    const payload = {
      type: shape.type,
      label: shape.label,
      ...shape.defaultData
    };
    event.dataTransfer.setData('text/plain', JSON.stringify(payload));
    event.dataTransfer.effectAllowed = 'move';
  };

  const onClick = (shape: ShapeDefinition) => {
    const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const position = screenToFlowPosition(center);
    const newNode = {
      id: generateId(),
      type: shape.type,
      position,
      data: {
        label: shape.label,
        sublabel: 'new-node',
        ...shape.defaultData
      },
    };
    addNode(newNode);
    const socket = getSocket();
    if (socket) socket.emit('NODE_ADDED', newNode);
    addRecent(shape.type, shape.shapeId);
  };

  const currentWidth = isCollapsed ? 56 : width;

  const renderShapeList = (shapes: ShapeDefinition[]) => {
    if (shapes.length === 0 && !isCollapsed) {
      return <div className="text-center py-4 text-[var(--text-muted)] text-sm">No items found.</div>;
    }
    return shapes.map((comp) => {
      const id = comp.shapeId ? `${comp.type}:${comp.shapeId}` : comp.type;
      const isFav = favorites.includes(id);

      return (
        <div
          key={id}
          className={`flex items-center gap-2.5 p-1.5 rounded-[12px] border border-transparent cursor-grab active:cursor-grabbing transition-all duration-150 group ${
            isCollapsed ? 'justify-center px-0 p-2' : ''
          } hover:bg-[var(--cosmic-card)] hover:border-[var(--cosmic-border)] hover:shadow-lg`}
          draggable={true}
          onDragStart={(event) => onDragStart(event, comp)}
          onClick={() => onClick(comp)}
          title={isCollapsed ? comp.label : undefined}
        >
          {/* Icon */}
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center border shrink-0 transition-all duration-150 group-hover:shadow-[0_0_12px_rgba(168,85,247,0.1)]"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderColor: `color-mix(in srgb, ${comp.accent} 15%, transparent)`,
            }}
          >
            <comp.icon className="w-3.5 h-3.5" style={{ color: comp.accent }} />
          </div>

          {!isCollapsed && (
            <>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-[13px] font-medium text-[var(--text-primary)] leading-tight truncate">{comp.label}</span>
                <span className="text-[11px] text-[var(--text-muted)] leading-tight mt-0.5 truncate">{comp.desc}</span>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={(e) => toggleFavorite(e, comp.type, comp.shapeId)} className={`p-1.5 rounded hover:bg-white/10 ${isFav ? 'text-yellow-400' : 'text-[var(--text-muted)]'}`}>
                  <Star className="w-3.5 h-3.5" fill={isFav ? "currentColor" : "none"} />
                </button>
                <GripVertical className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
              </div>
            </>
          )}
        </div>
      );
    });
  };

  const filteredShapes = SHAPE_REGISTRY.filter(c =>
    c.label.toLowerCase().includes(search.toLowerCase()) ||
    c.desc.toLowerCase().includes(search.toLowerCase())
  );

  const favShapes = SHAPE_REGISTRY.filter(c => favorites.includes(c.shapeId ? `${c.type}:${c.shapeId}` : c.type));
  const recentShapes = recent.map(r => SHAPE_REGISTRY.find(c => (c.shapeId ? `${c.type}:${c.shapeId}` : c.type) === r)).filter(Boolean) as ShapeDefinition[];
  const archShapes = filteredShapes.filter(c => c.category === 'Architecture');
  const drawingShapes = filteredShapes.filter(c => c.category === 'Drawing' || c.category === 'Text');

  return (
    <aside
      className="bg-[var(--cosmic-secondary)] border-r border-[var(--cosmic-border)] overflow-y-auto flex-shrink-0 flex flex-col hidden md:flex h-full shadow-2xl z-20 relative transition-panel"
      style={{ width: `${currentWidth}px` }}
    >
      {/* Header */}
      <div className="p-4 border-b border-[var(--cosmic-border)] bg-[var(--cosmic-primary)]/60 backdrop-blur-xl sticky top-0 z-10 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h3 className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-widest">Library</h3>
          )}
          <button
            onClick={toggleCollapse}
            className={`text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5 p-1.5 rounded-lg transition-all ${isCollapsed ? 'mx-auto' : ''}`}
          >
            {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        </div>

        {!isCollapsed && (
          <div className="relative animate-fade-in">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] w-3.5 h-3.5" />
            <input
              type="text"
              placeholder="Search components & shapes..."
              className="w-full bg-[var(--cosmic-card)] border border-[var(--cosmic-border)] rounded-xl py-2 pl-9 pr-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--accent-purple)]/40 focus:ring-1 focus:ring-[var(--accent-purple)]/20 transition-all outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Component List */}
      <div className="p-2 space-y-2 overflow-y-auto flex-1 pb-20">
        
        {!search && favShapes.length > 0 && (
          <div className="mb-2">
            {!isCollapsed && <h4 className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest px-2 mb-1 flex items-center gap-1.5"><Star className="w-3 h-3" /> Favorites</h4>}
            <div className="space-y-0.5">
              {renderShapeList(favShapes)}
            </div>
          </div>
        )}

        {!search && recentShapes.length > 0 && (
          <div className="mb-2">
            {!isCollapsed && <h4 className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest px-2 mb-1 flex items-center gap-1.5"><History className="w-3 h-3" /> Recently Used</h4>}
            <div className="space-y-0.5">
              {renderShapeList(recentShapes)}
            </div>
          </div>
        )}

        <div>
          {!isCollapsed && (
            <button 
              onClick={() => setComponentsExpanded(!componentsExpanded)}
              className="w-full text-left flex items-center justify-between px-2 mb-2 mt-4 hover:bg-white/5 py-1.5 rounded-lg transition-colors group"
            >
              <div className="flex items-center gap-2">
                <div className="bg-blue-500/20 p-1 rounded-md text-blue-400 group-hover:text-blue-300 transition-colors">
                  <LayoutGrid className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-blue-400/90 group-hover:text-blue-300 uppercase tracking-wider">Components</span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-blue-400/60 transition-transform duration-200 ${!componentsExpanded ? '-rotate-90' : ''}`} />
            </button>
          )}
          {(componentsExpanded || isCollapsed || search) && (
            <div className="space-y-0.5 px-1">
              {renderShapeList(archShapes)}
            </div>
          )}
        </div>

        <div>
          {!isCollapsed && (
            <button 
              onClick={() => setDrawingExpanded(!drawingExpanded)}
              className="w-full text-left flex items-center justify-between px-2 mb-2 mt-4 hover:bg-white/5 py-1.5 rounded-lg transition-colors group"
            >
              <div className="flex items-center gap-2">
                <div className="bg-purple-500/20 p-1 rounded-md text-purple-400 group-hover:text-purple-300 transition-colors">
                  <PenTool className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-purple-400/90 group-hover:text-purple-300 uppercase tracking-wider">Drawing Tools</span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-purple-400/60 transition-transform duration-200 ${!drawingExpanded ? '-rotate-90' : ''}`} />
            </button>
          )}
          {(drawingExpanded || isCollapsed || search) && (
            <div className="space-y-0.5 px-1">
              {renderShapeList(drawingShapes)}
            </div>
          )}
        </div>

      </div>

      {/* Resize Handle */}
      {!isCollapsed && (
        <div
          className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-[var(--accent-purple)]/40 transition-colors z-30"
          onMouseDown={startResizing}
        />
      )}
    </aside>
  );
}
