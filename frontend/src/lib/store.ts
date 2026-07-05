import { create } from 'zustand';
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
} from '@xyflow/react';

export type AppNode = Node;
export type AppEdge = Edge;

export type Cursor = {
  socketId: string;
  x: number;
  y: number;
  user: { name: string; _id: string };
};

export type HistoryState = {
  nodes: AppNode[];
  edges: AppEdge[];
};

export type AppState = {
  nodes: AppNode[];
  edges: AppEdge[];
  past: HistoryState[];
  future: HistoryState[];
  cursors: Record<string, Cursor>;
  onNodesChange: OnNodesChange<AppNode>;
  onEdgesChange: OnEdgesChange<AppEdge>;
  onConnect: OnConnect;
  setNodes: (nodes: AppNode[]) => void;
  setEdges: (edges: AppEdge[]) => void;
  addNode: (node: AppNode) => void;
  updateNode: (nodeId: string, updater: (node: AppNode) => AppNode) => void;
  updateNodes: (updater: (nodes: AppNode[]) => AppNode[]) => void;
  updateEdge: (edgeId: string, updater: (edge: AppEdge) => AppEdge) => void;
  deleteNode: (nodeId: string) => void;
  duplicateNode: (nodeId: string) => void;
  deleteEdge: (edgeId: string) => void;
  bringForward: (nodeId: string) => void;
  sendBackward: (nodeId: string) => void;
  undo: () => void;
  redo: () => void;
  saveHistory: () => void;
  
  // Remote events
  onRemoteNodeMoved: (data: { id: string; position: { x: number; y: number } }) => void;
  onRemoteNodeAdded: (node: AppNode) => void;
  onRemoteNodeUpdated: (node: AppNode) => void;
  onRemoteNodeDeleted: (nodeId: string) => void;
  onRemoteEdgeAdded: (edge: AppEdge) => void;
  onRemoteEdgeDeleted: (edgeId: string) => void;
  
  updateCursor: (cursor: Cursor) => void;
  removeCursor: (socketId: string) => void;
};

export const useDiagramStore = create<AppState>((set, get) => ({
  nodes: [],
  edges: [],
  past: [],
  future: [],
  cursors: {},
  saveHistory: () => {
    set((state) => ({
      past: [...state.past, { nodes: state.nodes, edges: state.edges }].slice(-50), // Keep 50 steps
      future: [],
    }));
  },
  undo: () => {
    set((state) => {
      if (state.past.length === 0) return state;
      const previous = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, state.past.length - 1);
      return {
        past: newPast,
        future: [{ nodes: state.nodes, edges: state.edges }, ...state.future],
        nodes: previous.nodes,
        edges: previous.edges,
      };
    });
  },
  redo: () => {
    set((state) => {
      if (state.future.length === 0) return state;
      const next = state.future[0];
      const newFuture = state.future.slice(1);
      return {
        past: [...state.past, { nodes: state.nodes, edges: state.edges }],
        future: newFuture,
        nodes: next.nodes,
        edges: next.edges,
      };
    });
  },
  onNodesChange: (changes: NodeChange<AppNode>[]) => {
    const isPositionChange = changes.some(c => c.type === 'position' && !c.dragging);
    const isAddRemove = changes.some(c => c.type === 'add' || c.type === 'remove');
    
    if (isPositionChange || isAddRemove) {
      get().saveHistory();
    }
    
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange<AppEdge>[]) => {
    const isAddRemove = changes.some(c => c.type === 'add' || c.type === 'remove');
    if (isAddRemove) {
      get().saveHistory();
    }
    
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection: Connection) => {
    get().saveHistory();
    set({
      edges: addEdge({ 
        ...connection, 
        type: 'premium',
        animated: true,
        style: { stroke: 'var(--text-muted)', strokeWidth: 1.5 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: 'var(--text-muted)',
        },
      }, get().edges),
    });
  },
  setNodes: (nodes: AppNode[]) => {
    set({ nodes });
  },
  setEdges: (edges: AppEdge[]) => {
    set({ edges });
  },
  addNode: (node: AppNode) => {
    get().saveHistory();
    set({ nodes: [...get().nodes, node] });
  },
  updateNode: (nodeId: string, updater: (node: AppNode) => AppNode) => {
    set({
      nodes: get().nodes.map((node) => (node.id === nodeId ? updater(node) : node)),
    });
  },
  updateNodes: (updater: (nodes: AppNode[]) => AppNode[]) => {
    get().saveHistory();
    set({ nodes: updater(get().nodes) });
  },
  updateEdge: (edgeId: string, updater: (edge: AppEdge) => AppEdge) => {
    get().saveHistory();
    set({
      edges: get().edges.map((edge) => (edge.id === edgeId ? updater(edge) : edge)),
    });
  },
  deleteNode: (nodeId: string) => {
    get().saveHistory();
    set({
      nodes: get().nodes.filter((node) => node.id !== nodeId),
      edges: get().edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
    });
  },
  duplicateNode: (nodeId: string) => {
    const nodeToDuplicate = get().nodes.find(n => n.id === nodeId);
    if (!nodeToDuplicate) return;

    const generateId = () => Math.random().toString(36).substr(2, 9);
    
    // Deep copy data to ensure nested objects (comments, snippets) are distinct
    const clonedData = JSON.parse(JSON.stringify(nodeToDuplicate.data));
    
    const newNode: AppNode = {
      ...nodeToDuplicate,
      id: generateId(),
      position: {
        x: nodeToDuplicate.position.x + 40,
        y: nodeToDuplicate.position.y + 40
      },
      data: clonedData,
      selected: false
    };
    
    get().saveHistory();
    set({ nodes: [...get().nodes, newNode] });
  },
  deleteEdge: (edgeId: string) => {
    get().saveHistory();
    set({ edges: get().edges.filter((edge) => edge.id !== edgeId) });
  },
  bringForward: (nodeId: string) => {
    get().saveHistory();
    set(state => {
      const node = state.nodes.find(n => n.id === nodeId);
      if (!node) return state;
      const currentZ = node.zIndex || 0;
      return {
        nodes: state.nodes.map(n => n.id === nodeId ? { ...n, zIndex: currentZ + 1 } : n)
      };
    });
  },
  sendBackward: (nodeId: string) => {
    get().saveHistory();
    set(state => {
      const node = state.nodes.find(n => n.id === nodeId);
      if (!node) return state;
      const currentZ = node.zIndex || 0;
      return {
        nodes: state.nodes.map(n => n.id === nodeId ? { ...n, zIndex: currentZ - 1 } : n)
      };
    });
  },
  onRemoteNodeMoved: (data) => {
    set({
      nodes: get().nodes.map((n) => (n.id === data.id ? { ...n, position: data.position } : n)),
    });
  },
  onRemoteNodeAdded: (node) => {
    if (!get().nodes.find(n => n.id === node.id)) {
      set({ nodes: [...get().nodes, node] });
    }
  },
  onRemoteNodeUpdated: (node) => {
    set({
      nodes: get().nodes.map((n) => (n.id === node.id ? node : n)),
    });
  },
  onRemoteNodeDeleted: (nodeId) => {
    set({
      nodes: get().nodes.filter((node) => node.id !== nodeId),
      edges: get().edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
    });
  },
  onRemoteEdgeAdded: (edge) => {
    if (!get().edges.find(e => e.id === edge.id)) {
      set({ edges: [...get().edges, edge] });
    }
  },
  onRemoteEdgeDeleted: (edgeId) => {
    set({ edges: get().edges.filter((edge) => edge.id !== edgeId) });
  },
  updateCursor: (cursor) => {
    set((state) => ({ cursors: { ...state.cursors, [cursor.socketId]: cursor } }));
  },
  removeCursor: (socketId) => {
    set((state) => {
      const newCursors = { ...state.cursors };
      delete newCursors[socketId];
      return { cursors: newCursors };
    });
  },
}));
