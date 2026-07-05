import React from 'react';
import BlueprintNode from './BlueprintNode';
import DrawingNode from './DrawingNode';
import TextNode from './TextNode';
import StickyNode from './StickyNode';
import FrameNode from './FrameNode';
import {
  Monitor, Smartphone, DoorOpen, Scale, Settings,
  Database, Zap, Mailbox, Globe, HardDrive
} from 'lucide-react';

export const ClientNode = ({ id, data, selected }: any) => (
  <BlueprintNode id={id} icon={Monitor} label={data.label || "Client"} sublabel={data.sublabel} selected={selected} accentColor={data.accentColor || "#34D399"} badge={data.badge || "HTTPS"} data={data} />
);

export const MobileAppNode = ({ id, data, selected }: any) => (
  <BlueprintNode id={id} icon={Smartphone} label={data.label || "Mobile App"} sublabel={data.sublabel} selected={selected} accentColor={data.accentColor || "#2DD4BF"} badge={data.badge} data={data} />
);

export const APIGatewayNode = ({ id, data, selected }: any) => (
  <BlueprintNode id={id} icon={DoorOpen} label={data.label || "API Gateway"} sublabel={data.sublabel} selected={selected} accentColor={data.accentColor || "#FBBF24"} badge={data.badge || "REST"} data={data} />
);

export const LoadBalancerNode = ({ id, data, selected }: any) => (
  <BlueprintNode id={id} icon={Scale} label={data.label || "Load Balancer"} sublabel={data.sublabel} selected={selected} accentColor={data.accentColor || "#38BDF8"} badge={data.badge} data={data} />
);

export const MicroserviceNode = ({ id, data, selected }: any) => (
  <BlueprintNode id={id} icon={Settings} label={data.label || "Microservice"} sublabel={data.sublabel} selected={selected} accentColor={data.accentColor || "#2DD4BF"} badge={data.badge} data={data} />
);

export const DatabaseNode = ({ id, data, selected }: any) => (
  <BlueprintNode id={id} icon={Database} label={data.label || "Database"} sublabel={data.sublabel} selected={selected} accentColor={data.accentColor || "#A855F7"} badge={data.badge || "PostgreSQL"} data={data} />
);

export const CacheNode = ({ id, data, selected }: any) => (
  <BlueprintNode id={id} icon={Zap} label={data.label || "Cache"} sublabel={data.sublabel} selected={selected} accentColor={data.accentColor || "#FBBF24"} badge={data.badge || "Redis"} data={data} />
);

export const QueueNode = ({ id, data, selected }: any) => (
  <BlueprintNode id={id} icon={Mailbox} label={data.label || "Queue"} sublabel={data.sublabel} selected={selected} accentColor={data.accentColor || "#EC4899"} badge={data.badge || "RabbitMQ"} data={data} />
);

export const CDNNode = ({ id, data, selected }: any) => (
  <BlueprintNode id={id} icon={Globe} label={data.label || "CDN"} sublabel={data.sublabel} selected={selected} accentColor={data.accentColor || "#38BDF8"} badge={data.badge || "Cloudflare"} data={data} />
);

export const StorageNode = ({ id, data, selected }: any) => (
  <BlueprintNode id={id} icon={HardDrive} label={data.label || "Storage"} sublabel={data.sublabel} selected={selected} accentColor={data.accentColor || "#FB7185"} badge={data.badge || "S3"} data={data} />
);

export const nodeTypes = {
  Client: ClientNode,
  MobileApp: MobileAppNode,
  APIGateway: APIGatewayNode,
  LoadBalancer: LoadBalancerNode,
  Microservice: MicroserviceNode,
  Database: DatabaseNode,
  Cache: CacheNode,
  Queue: QueueNode,
  CDN: CDNNode,
  Storage: StorageNode,
  DrawingNode: DrawingNode,
  TextNode: TextNode,
  StickyNode: StickyNode,
  FrameNode: FrameNode,
};
