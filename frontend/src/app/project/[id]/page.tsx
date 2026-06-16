'use client';

import React, { useRef, useCallback, useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ReactFlow, ReactFlowProvider, Background, Controls, useReactFlow, NodeChange, EdgeChange } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useAuth } from '@/lib/auth';
import { useDiagramStore } from '@/lib/store';
import { initSocket, getSocket, disconnectSocket } from '@/lib/socket';
import { nodeTypes } from '@/components/nodes';
import ComponentSidebar from '@/components/ComponentSidebar';
import BlueprintBackground from '@/components/BlueprintBackground';
import Button from '@/components/Button';
import LiveCursors from '@/components/LiveCursors';
import ExportMenu from '@/components/ExportMenu';
import CommentPopover from '@/components/CommentPopover';
import AIGenerateModal from '@/components/AIGenerateModal';

// Utility to generate a short random ID for new nodes
const generateId = () => Math.random().toString(36).substr(2, 9);

function FlowCanvas({ isViewOnly }: { isViewOnly: boolean }) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();
  
  const nodes = useDiagramStore((state) => state.nodes);
  const edges = useDiagramStore((state) => state.edges);
  const onNodesChange = useDiagramStore((state) => state.onNodesChange);
  const onEdgesChange = useDiagramStore((state) => state.onEdgesChange);
  const onConnect = useDiagramStore((state) => state.onConnect);
  const addNode = useDiagramStore((state) => state.addNode);

  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [popoverPos, setPopoverPos] = useState({ x: 0, y: 0 });

  const onNodeClick = useCallback((event: React.MouseEvent, node: any) => {
    setActiveNodeId(node.id);
    setPopoverPos({ x: event.clientX, y: event.clientY });
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

      const type = event.dataTransfer.getData('application/reactflow');
      const label = event.dataTransfer.getData('application/reactflow-label');

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
    <div className="flex-1 h-full w-full relative" ref={reactFlowWrapper} onPointerMove={onPointerMove}>
      {/* We apply the blueprint styling directly to the React Flow wrapper/background */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={isViewOnly ? undefined : handleNodesChange}
        onEdgesChange={isViewOnly ? undefined : handleEdgesChange}
        onConnect={isViewOnly ? undefined : handleConnect}
        onNodeClick={onNodeClick}
        onPaneClick={() => setActiveNodeId(null)}
        nodeTypes={nodeTypes}
        onDrop={onDrop}
        onDragOver={onDragOver}
        fitView
        nodesDraggable={!isViewOnly}
        nodesConnectable={!isViewOnly}
        elementsSelectable={!isViewOnly}
        proOptions={{ hideAttribution: true }} // Hide watermark for clean UI
        className="bg-[var(--ink)]"
      >
        <Background 
          color="var(--grid-line)" 
          gap={24} 
          size={1} 
          variant="dots" as any 
        />
        <Controls className="bg-[var(--slate)] border border-[var(--grid-line)] fill-white text-white" />
        <LiveCursors />
        {activeNodeId && params.id && (
          <CommentPopover 
            projectId={params.id as string} 
            nodeId={activeNodeId} 
            onClose={() => setActiveNodeId(null)} 
            style={{ left: popoverPos.x + 20, top: popoverPos.y - 20 }}
          />
        )}
      </ReactFlow>
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
      
      const { onRemoteNodeMoved, onRemoteNodeAdded, onRemoteNodeDeleted, onRemoteEdgeDeleted, updateCursor, removeCursor } = useDiagramStore.getState();

      socket.on('NODE_MOVED', onRemoteNodeMoved);
      socket.on('NODE_ADDED', onRemoteNodeAdded);
      socket.on('NODE_DELETED', onRemoteNodeDeleted);
      socket.on('EDGE_DELETED', onRemoteEdgeDeleted);
      socket.on('PRESENCE_UPDATE', updateCursor);
      socket.on('USER_LEFT', ({ socketId }) => removeCursor(socketId));

      return () => {
        socket.off('NODE_MOVED');
        socket.off('NODE_ADDED');
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
    return <div className="min-h-screen bg-[var(--ink)] flex items-center justify-center text-[var(--grid-line)]">Loading...</div>;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[var(--ink)]">
      {/* Top Navigation */}
      <header className="h-14 border-b border-[var(--grid-line)] bg-[var(--ink)] flex items-center justify-between px-4 z-10 shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')}>
            ← Back
          </Button>
          <div className="h-6 w-px bg-[var(--grid-line)]"></div>
          <h1 className="text-white font-heading font-bold text-lg truncate max-w-[300px]">
            {projectTitle}
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          {saveStatus && <span className="text-xs text-[var(--teal-circuit)] mr-2">{saveStatus}</span>}
          {!isViewOnly && (
            <>
              <Button variant="teal" size="sm" onClick={() => setIsAIModalOpen(true)}>✨ AI Generate</Button>
              <Button variant="primary" size="sm" onClick={handleSave} loading={isSaving}>Save</Button>
            </>
          )}
          <Button variant="ghost" size="sm" onClick={handleShare}>Share</Button>
          <ExportMenu />
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden relative">
        {!isViewOnly && <ComponentSidebar />}
        
        {/* Canvas Area */}
        <ReactFlowProvider>
          <FlowCanvas isViewOnly={isViewOnly} />
        </ReactFlowProvider>
      </div>

      {isAIModalOpen && <AIGenerateModal onClose={() => setIsAIModalOpen(false)} />}
    </div>
  );
}
