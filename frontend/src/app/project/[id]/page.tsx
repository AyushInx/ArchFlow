'use client';

import React, { useRef, useCallback, useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ReactFlow, ReactFlowProvider, Background, Controls, MiniMap, useReactFlow, NodeChange, EdgeChange, BackgroundVariant, useOnSelectionChange } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useAuth } from '@/lib/auth';
import { useDiagramStore } from '@/lib/store';
import { initSocket, getSocket, disconnectSocket } from '@/lib/socket';
import { nodeTypes } from '@/components/nodes';
import PremiumEdge from '@/components/edges/PremiumEdge';
import ComponentSidebar from '@/components/ComponentSidebar';
import BlueprintBackground from '@/components/BlueprintBackground';
import Button from '@/components/Button';
import LiveCursors from '@/components/LiveCursors';
import ExportMenu from '@/components/ExportMenu';
import AIGenerateModal from '@/components/AIGenerateModal';
import TopToolbar from '@/components/TopToolbar';
import BottomDock from '@/components/BottomDock';
import PropertiesPanel from '@/components/PropertiesPanel';
import LayersPanel from '@/components/LayersPanel';
import SelectionToolbar from '@/components/SelectionToolbar';
import ContextMenu from '@/components/ContextMenu';

// Utility to generate a short random ID for new nodes
const generateId = () => Math.random().toString(36).substr(2, 9);

const edgeTypes = {
  premium: PremiumEdge,
};

function FlowCanvas({ isViewOnly }: { isViewOnly: boolean }) {
  const params = useParams();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();
  
  const nodes = useDiagramStore((state) => state.nodes);
  const edges = useDiagramStore((state) => state.edges);
  const onNodesChange = useDiagramStore((state) => state.onNodesChange);
  const onEdgesChange = useDiagramStore((state) => state.onEdgesChange);
  const onConnect = useDiagramStore((state) => state.onConnect);
  const addNode = useDiagramStore((state) => state.addNode);
  
  const undo = useDiagramStore(state => state.undo);
  const redo = useDiagramStore(state => state.redo);
  const deleteNode = useDiagramStore(state => state.deleteNode);
  const duplicateNode = useDiagramStore(state => state.duplicateNode);
  const updateNodes = useDiagramStore(state => state.updateNodes);

  const [activeSelection, setActiveSelection] = useState<string[]>([]);
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, nodeId?: string, edgeId?: string } | null>(null);

  useOnSelectionChange({
    onChange: ({ nodes }) => {
      setActiveSelection(nodes.map(n => n.id));
    },
  });

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        activeSelection.forEach(id => deleteNode(id));
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault(); // Prevent default bookmark dialog
        activeSelection.forEach(id => duplicateNode(id));
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'g') {
        e.preventDefault();
        handleGroupNodes();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, deleteNode, duplicateNode, activeSelection, nodes]);

  const handleGroupNodes = useCallback(() => {
    if (activeSelection.length < 2) return;
    const selectedNodes = nodes.filter(n => activeSelection.includes(n.id));
    if (selectedNodes.length === 0) return;

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    selectedNodes.forEach(n => {
      minX = Math.min(minX, n.position.x);
      minY = Math.min(minY, n.position.y);
      maxX = Math.max(maxX, n.position.x + (n.measured?.width || 100));
      maxY = Math.max(maxY, n.position.y + (n.measured?.height || 100));
    });

    const padding = 40;
    const frameId = generateId();
    const frameNode = {
      id: frameId,
      type: 'FrameNode',
      position: { x: minX - padding, y: minY - padding },
      data: { title: 'New Group', width: (maxX - minX) + padding * 2, height: (maxY - minY) + padding * 2 },
    };

    // Update positions relative to frame
    updateNodes(currentNodes => {
      const newNodes = currentNodes.map(n => {
        if (activeSelection.includes(n.id)) {
          return { ...n, parentNode: frameId, position: { x: n.position.x - (minX - padding), y: n.position.y - (minY - padding) } };
        }
        return n;
      });
      return [...newNodes, frameNode];
    });

    const socket = getSocket();
    if (socket) socket.emit('NODE_ADDED', frameNode);
  }, [activeSelection, nodes, updateNodes]);

  const onNodeContextMenu = useCallback((event: React.MouseEvent, node: any) => {
    event.preventDefault();
    setContextMenu({ x: event.clientX, y: event.clientY, nodeId: node.id });
  }, []);

  const onEdgeContextMenu = useCallback((event: React.MouseEvent, edge: any) => {
    event.preventDefault();
    setContextMenu({ x: event.clientX, y: event.clientY, edgeId: edge.id });
  }, []);

  const onPaneContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenu({ x: event.clientX, y: event.clientY });
  }, []);

  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      onNodesChange(changes);
      if (isViewOnly) return;
      const socket = getSocket();
      if (!socket) return;
      
      changes.forEach(change => {
        if (change.type === 'position' && change.position) {
          socket.emit('NODE_MOVED', { id: change.id, position: change.position });
        } else if (change.type === 'remove') {
          socket.emit('NODE_DELETED', change.id);
        }
      });
    },
    [onNodesChange, isViewOnly]
  );

  const handleEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      onEdgesChange(changes);
      if (isViewOnly) return;
      const socket = getSocket();
      if (!socket) return;

      changes.forEach(change => {
        if (change.type === 'remove') {
          socket.emit('EDGE_DELETED', change.id);
        }
      });
    },
    [onEdgesChange, isViewOnly]
  );

  const handleConnect = useCallback(
    (connection: any) => {
      onConnect(connection);
      if (isViewOnly) return;
      const socket = getSocket();
      if (!socket) return;
      // Emit the new edge; the store handles the actual addEdge creation logic, 
      // so we might need a more sophisticated way to get the generated edge.
      // For simplicity here, we assume others will get the full edge list or we emit the edge.
      // A better approach is to listen to the new edges list.
    },
    [onConnect, isViewOnly]
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (isViewOnly) return;

      const dataStr = event.dataTransfer.getData('text/plain');
      if (!dataStr) return;
      
      let type, label;
      try {
        const parsed = JSON.parse(dataStr);
        type = parsed.type;
        label = parsed.label;
      } catch (e) {
        // Fallback for older format if needed
        type = event.dataTransfer.getData('application/reactflow');
        label = event.dataTransfer.getData('application/reactflow-label');
      }

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: generateId(),
        type,
        position,
        data: { label, sublabel: 'new-node' },
      };

      addNode(newNode);
      
      const socket = getSocket();
      if (socket) {
        socket.emit('NODE_ADDED', newNode);
      }
    },
    [screenToFlowPosition, addNode, isViewOnly]
  );

  const onPointerMove = useCallback((event: React.PointerEvent) => {
    if (isViewOnly) return;
    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });
    
    const socket = getSocket();
    if (socket) {
      socket.emit('PRESENCE_UPDATE', { x: position.x, y: position.y });
    }
  }, [screenToFlowPosition, isViewOnly]);

  return (
    <div className="flex-1 h-full w-full relative" ref={reactFlowWrapper} onPointerMove={onPointerMove} onDrop={onDrop} onDragOver={onDragOver}>
      {/* We apply the blueprint styling directly to the React Flow wrapper/background */}
      <ReactFlow
        nodes={nodes.map(n => ({
          ...n,
          draggable: n.data?.isLocked ? false : undefined,
          deletable: n.data?.isLocked ? false : undefined
        }))}
        edges={edges}
        onNodesChange={isViewOnly ? undefined : handleNodesChange}
        onEdgesChange={isViewOnly ? undefined : handleEdgesChange}
        onConnect={isViewOnly ? undefined : handleConnect}
        onNodeContextMenu={onNodeContextMenu}
        onEdgeContextMenu={onEdgeContextMenu}
        onPaneContextMenu={onPaneContextMenu}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        proOptions={{ hideAttribution: true }} // Hide watermark for clean UI
        fitView
        nodesDraggable={!isViewOnly}
        nodesConnectable={!isViewOnly}
        elementsSelectable={!isViewOnly}
        className="canvas-cosmic"
        snapToGrid={true}
        snapGrid={[20, 20]}
      >
        <Controls className="!bg-black/40 !border-[var(--cosmic-border)] !text-white" />
        <MiniMap 
          className="!bg-black/60 !border !border-[var(--cosmic-border)] !rounded-lg"
          nodeColor={(n) => {
            if (n.type === 'FrameNode') return 'rgba(255,255,255,0.1)';
            return 'var(--accent-primary)';
          }}
          maskColor="rgba(0,0,0,0.4)"
        />
        <Background 
          id="1"
          gap={20} 
          color="rgba(255, 255, 255, 0.05)" 
          variant={BackgroundVariant.Lines} 
        />
        <Background 
          id="2"
          gap={100} 
          offset={1} 
          color="rgba(255, 255, 255, 0.06)" 
          variant={BackgroundVariant.Lines} 
        />
        <LiveCursors />
      </ReactFlow>
      
      {contextMenu && (
        <ContextMenu 
          x={contextMenu.x} 
          y={contextMenu.y} 
          nodeId={contextMenu.nodeId} 
          edgeId={contextMenu.edgeId} 
          onClose={() => setContextMenu(null)} 
        />
      )}
    </div>
  );
}

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isViewOnly = searchParams.get('mode') === 'view';
  
  const { user, loading, token } = useAuth();
  
  const [projectTitle, setProjectTitle] = useState('Loading Project...');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  
  const setNodes = useDiagramStore((state) => state.setNodes);
  const setEdges = useDiagramStore((state) => state.setEdges);
  const nodes = useDiagramStore((state) => state.nodes);
  const edges = useDiagramStore((state) => state.edges);

  // Effect to handle auth redirection and data loading
  useEffect(() => {
    if (!loading && !user && !isViewOnly) {
      router.push('/login');
    } else if (!loading && (user || isViewOnly)) {
      loadProject();
    }
  }, [user, loading, router, isViewOnly]);

  const loadProject = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/projects/${params.id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setProjectTitle(data.project.title);
        if (data.diagram) {
          setNodes(data.diagram.nodes || []);
          setEdges(data.diagram.edges || []);
        }
      }
    } catch (err) {
      console.error('Error loading project', err);
    }
  };

  useEffect(() => {
    if (token && user && params.id) {
      const socket = initSocket(token, params.id as string, user);
      
      const { onRemoteNodeMoved, onRemoteNodeAdded, onRemoteNodeUpdated, onRemoteNodeDeleted, onRemoteEdgeDeleted, updateCursor, removeCursor } = useDiagramStore.getState();

      socket.on('NODE_MOVED', onRemoteNodeMoved);
      socket.on('NODE_ADDED', onRemoteNodeAdded);
      socket.on('NODE_UPDATED', onRemoteNodeUpdated);
      socket.on('NODE_DELETED', onRemoteNodeDeleted);
      socket.on('EDGE_DELETED', onRemoteEdgeDeleted);
      socket.on('PRESENCE_UPDATE', updateCursor);
      socket.on('USER_LEFT', ({ socketId }) => removeCursor(socketId));

      return () => {
        socket.off('NODE_MOVED');
        socket.off('NODE_ADDED');
        socket.off('NODE_UPDATED');
        socket.off('NODE_DELETED');
        socket.off('EDGE_DELETED');
        socket.off('PRESENCE_UPDATE');
        socket.off('USER_LEFT');
        disconnectSocket();
      };
    }
  }, [token, user, params.id]);

  const handleSave = async () => {
    if (isViewOnly || !token) return;
    setIsSaving(true);
    setSaveStatus('Saving...');
    try {
      const res = await fetch(`http://localhost:5000/api/projects/${params.id}/diagram`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nodes, edges }),
      });
      if (res.ok) {
        setSaveStatus('Saved!');
        setTimeout(() => setSaveStatus(''), 2000);
      }
    } catch (err) {
      console.error('Save failed', err);
      setSaveStatus('Error');
    } finally {
      setIsSaving(false);
    }
  };

  // Autosave
  useEffect(() => {
    if (isViewOnly || nodes.length === 0) return;
    const timeout = setTimeout(() => {
      handleSave();
    }, 10000); // 10s autosave

    return () => clearTimeout(timeout);
  }, [nodes, edges]);

  const handleShare = () => {
    const url = `${window.location.origin}/project/${params.id}?mode=view`;
    navigator.clipboard.writeText(url);
    alert('View-only link copied to clipboard!');
  };

  if (loading || (!user && !isViewOnly)) {
    return (
      <div className="min-h-screen bg-[var(--cosmic-primary)] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[var(--accent-purple)]/20 border-t-[var(--accent-purple)] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[var(--cosmic-primary)]">
      {/* Top Navigation */}
      <header className="h-12 border-b border-[var(--cosmic-border)] bg-[var(--cosmic-primary)]/80 backdrop-blur-xl flex items-center justify-between px-4 z-10 shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')}>
            ← Back
          </Button>
          <div className="h-4 w-px bg-[var(--cosmic-border)]"></div>
          <h1 className="text-[var(--text-primary)] font-medium text-[13px] truncate max-w-[300px]">
            {projectTitle}
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          {saveStatus && <span className="text-[11px] text-[var(--accent-emerald)] font-medium tracking-wide mr-2">{saveStatus}</span>}
          {!isViewOnly && (
            <Button variant="primary" size="sm" onClick={handleSave} loading={isSaving}>Save</Button>
          )}
          <Button variant="outline" size="sm" onClick={handleShare}>Share</Button>
        </div>
      </header>

      {/* Main Workspace */}
      <ReactFlowProvider>
        {!isViewOnly && <SelectionToolbar />}
        <div className="flex flex-1 overflow-hidden relative">
          {!isViewOnly && <ComponentSidebar />}
          
          {/* Canvas Area with Floating Panels */}
          <div className="flex-1 h-full relative">
            <TopToolbar onAIGenerate={() => setIsAIModalOpen(true)} onExport={handleShare} isViewOnly={isViewOnly} />
            <FlowCanvas isViewOnly={isViewOnly} />
            <BottomDock isViewOnly={isViewOnly} />
            <PropertiesPanel isViewOnly={isViewOnly} />
          </div>
          {!isViewOnly && <LayersPanel />}
        </div>
      </ReactFlowProvider>

      {isAIModalOpen && <AIGenerateModal onClose={() => setIsAIModalOpen(false)} />}
    </div>
  );
}
