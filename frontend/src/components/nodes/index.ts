import React from 'react';
import BlueprintNode from './BlueprintNode';

export const ClientNode = ({ data, selected }: any) => (
  <BlueprintNode icon="🖥️" label={data.label || "Client"} sublabel={data.sublabel} selected={selected} />
);

export const MobileAppNode = ({ data, selected }: any) => (
  <BlueprintNode icon="📱" label={data.label || "Mobile App"} sublabel={data.sublabel} selected={selected} />
);

export const APIGatewayNode = ({ data, selected }: any) => (
  <BlueprintNode icon="🚪" label={data.label || "API Gateway"} sublabel={data.sublabel} selected={selected} />
);

export const LoadBalancerNode = ({ data, selected }: any) => (
  <BlueprintNode icon="⚖️" label={data.label || "Load Balancer"} sublabel={data.sublabel} selected={selected} />
);

export const MicroserviceNode = ({ data, selected }: any) => (
  <BlueprintNode icon="⚙️" label={data.label || "Microservice"} sublabel={data.sublabel} selected={selected} />
);

export const DatabaseNode = ({ data, selected }: any) => (
  <BlueprintNode icon="🗄️" label={data.label || "Database"} sublabel={data.sublabel} selected={selected} />
);

export const CacheNode = ({ data, selected }: any) => (
  <BlueprintNode icon="⚡" label={data.label || "Cache"} sublabel={data.sublabel} selected={selected} />
);

export const QueueNode = ({ data, selected }: any) => (
  <BlueprintNode icon="📬" label={data.label || "Queue"} sublabel={data.sublabel} selected={selected} />
);

export const CDNNode = ({ data, selected }: any) => (
  <BlueprintNode icon="🌐" label={data.label || "CDN"} sublabel={data.sublabel} selected={selected} />
);

export const StorageNode = ({ data, selected }: any) => (
  <BlueprintNode icon="💾" label={data.label || "Storage"} sublabel={data.sublabel} selected={selected} />
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
};
