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
} from '@xyflow/react';

export type AppNode = Node;
export type AppEdge = Edge;

export type Cursor = {
  socketId: string;
  x: number;
  y: number;
  user: { name: string; _id: string };
};

export type AppState = {
  nodes: AppNode[];
  edges: AppEdge[];
  cursors: Record<string, Cursor>;
  onNodesChange: OnNodesChange<AppNode>;
  onEdgesChange: OnEdgesChange<AppEdge>;
  onConnect: OnConnect;
  setNodes: (nodes: AppNode[]) => void;
  setEdges: (edges: AppEdge[]) => void;
  addNode: (node: AppNode) => void;
  deleteNode: (nodeId: string) => void;
  deleteEdge: (edgeId: string) => void;
  
  // Remote events
  onRemoteNodeMoved: (data: { id: string; position: { x: number; y: number } }) => void;
  onRemoteNodeAdded: (node: AppNode) => void;
  onRemoteNodeDeleted: (nodeId: string) => void;
  onRemoteEdgeAdded: (edge: AppEdge) => void;
  onRemoteEdgeDeleted: (edgeId: string) => void;
  
  updateCursor: (cursor: Cursor) => void;
  removeCursor: (socketId: string) => void;
};

export const useDiagramStore = create<AppState>((set, get) => ({
  nodes: [],
  edges: [],
  cursors: {},
  onNodesChange: (changes: NodeChange<AppNode>[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange<AppEdge>[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection: Connection) => {
    set({
      // Provide a clean curved line with our amber-signal color by default
      edges: addEdge({ ...connection, style: { stroke: 'var(--amber-signal)', strokeWidth: 2 }, animated: false }, get().edges),
    });
  },
  setNodes: (nodes: AppNode[]) => {
    set({ nodes });
  },
  setEdges: (edges: AppEdge[]) => {
    set({ edges });
  },
  addNode: (node: AppNode) => {
    set({ nodes: [...get().nodes, node] });
  },
  deleteNode: (nodeId: string) => {
    set({
      nodes: get().nodes.filter((node) => node.id !== nodeId),
      edges: get().edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
    });
  },
  deleteEdge: (edgeId: string) => {
    set({ edges: get().edges.filter((edge) => edge.id !== edgeId) });
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
