import {
  Monitor, Smartphone, DoorOpen, Scale, Settings,
  Database, Zap, Mailbox, Globe, HardDrive,
  Square, Circle, Triangle, Hexagon, Type, StickyNote, BoxSelect
} from 'lucide-react';

export type ShapeCategory = 'Architecture' | 'Drawing' | 'Text';

export interface ShapeDefinition {
  type: string; // The React Flow node type (e.g. 'DrawingNode', 'Database')
  shapeId?: string; // Specific shape identifier for generic DrawingNode (e.g. 'rectangle')
  icon: any;
  label: string;
  desc: string;
  category: ShapeCategory;
  accent: string;
  defaultData?: any;
}

export const SHAPE_REGISTRY: ShapeDefinition[] = [
  // --- Architecture Components (Legacy Node Types) ---
  { type: 'Client', icon: Monitor, label: 'Client', desc: 'Web Browser', category: 'Architecture', accent: '#34D399', defaultData: { badge: 'HTTPS' } },
  { type: 'MobileApp', icon: Smartphone, label: 'Mobile App', desc: 'iOS / Android', category: 'Architecture', accent: '#2DD4BF' },
  { type: 'APIGateway', icon: DoorOpen, label: 'API Gateway', desc: 'Entry Point', category: 'Architecture', accent: '#FBBF24', defaultData: { badge: 'REST' } },
  { type: 'LoadBalancer', icon: Scale, label: 'Load Balancer', desc: 'Traffic Router', category: 'Architecture', accent: '#38BDF8' },
  { type: 'Microservice', icon: Settings, label: 'Microservice', desc: 'Backend Logic', category: 'Architecture', accent: '#2DD4BF' },
  { type: 'Database', icon: Database, label: 'Database', desc: 'PostgreSQL', category: 'Architecture', accent: '#A855F7', defaultData: { badge: 'PostgreSQL' } },
  { type: 'Cache', icon: Zap, label: 'Cache', desc: 'Redis', category: 'Architecture', accent: '#FBBF24', defaultData: { badge: 'Redis' } },
  { type: 'Queue', icon: Mailbox, label: 'Queue', desc: 'RabbitMQ', category: 'Architecture', accent: '#EC4899', defaultData: { badge: 'RabbitMQ' } },
  { type: 'CDN', icon: Globe, label: 'CDN', desc: 'Content Delivery', category: 'Architecture', accent: '#38BDF8', defaultData: { badge: 'Cloudflare' } },
  { type: 'Storage', icon: HardDrive, label: 'Storage', desc: 'S3 Bucket', category: 'Architecture', accent: '#FB7185', defaultData: { badge: 'S3' } },

  // --- Drawing Tools ---
  { type: 'DrawingNode', shapeId: 'rectangle', icon: Square, label: 'Rectangle', desc: 'Basic shape', category: 'Drawing', accent: '#818CF8', defaultData: { shape: 'rectangle', fill: 'rgba(129, 140, 248, 0.1)', stroke: '#818CF8', strokeWidth: 2, radius: 4 } },
  { type: 'DrawingNode', shapeId: 'circle', icon: Circle, label: 'Circle', desc: 'Basic shape', category: 'Drawing', accent: '#818CF8', defaultData: { shape: 'circle', fill: 'rgba(129, 140, 248, 0.1)', stroke: '#818CF8', strokeWidth: 2 } },
  { type: 'DrawingNode', shapeId: 'triangle', icon: Triangle, label: 'Triangle', desc: 'Basic shape', category: 'Drawing', accent: '#818CF8', defaultData: { shape: 'triangle', fill: 'rgba(129, 140, 248, 0.1)', stroke: '#818CF8', strokeWidth: 2 } },
  { type: 'DrawingNode', shapeId: 'hexagon', icon: Hexagon, label: 'Hexagon', desc: 'Basic shape', category: 'Drawing', accent: '#818CF8', defaultData: { shape: 'hexagon', fill: 'rgba(129, 140, 248, 0.1)', stroke: '#818CF8', strokeWidth: 2 } },
  
  // --- Text & Annotations ---
  { type: 'TextNode', icon: Type, label: 'Text', desc: 'Free text', category: 'Text', accent: '#F4F4F5', defaultData: { text: 'Type something...', fontSize: 16, color: '#F4F4F5', fontWeight: 'normal' } },
  { type: 'StickyNode', icon: StickyNote, label: 'Sticky Note', desc: 'Post-it', category: 'Text', accent: '#FEF08A', defaultData: { text: 'Note...', color: '#FEF08A' } },
  
  // --- Frames ---
  { type: 'FrameNode', icon: BoxSelect, label: 'Frame', desc: 'Group items', category: 'Drawing', accent: '#A1A1AA', defaultData: { title: 'Frame', fill: 'rgba(0, 0, 0, 0.2)', stroke: '#A1A1AA', strokeWidth: 1 } },
];
