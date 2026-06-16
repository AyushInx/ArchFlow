'use client';

import React from 'react';

const COMPONENT_TYPES = [
  { type: 'Client', icon: '🖥️', label: 'Client' },
  { type: 'MobileApp', icon: '📱', label: 'Mobile App' },
  { type: 'APIGateway', icon: '🚪', label: 'API Gateway' },
  { type: 'LoadBalancer', icon: '⚖️', label: 'Load Balancer' },
  { type: 'Microservice', icon: '⚙️', label: 'Microservice' },
  { type: 'Database', icon: '🗄️', label: 'Database' },
  { type: 'Cache', icon: '⚡', label: 'Cache' },
  { type: 'Queue', icon: '📬', label: 'Queue' },
  { type: 'CDN', icon: '🌐', label: 'CDN' },
  { type: 'Storage', icon: '💾', label: 'Storage' },
];

export default function ComponentSidebar() {
  const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string, label: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('application/reactflow-label', label);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-64 bg-[var(--ink)] border-r border-[var(--grid-line)] overflow-y-auto flex-shrink-0 flex flex-col hidden md:flex">
      <div className="p-4 border-b border-[var(--grid-line)]">
        <h2 className="text-white font-heading font-bold text-sm uppercase tracking-wider">Components</h2>
      </div>
      
      <div className="p-4 space-y-3">
        {COMPONENT_TYPES.map((comp) => (
          <div
            key={comp.type}
            className="flex items-center gap-3 p-3 rounded-lg border border-[var(--grid-line)] bg-[var(--slate)] cursor-grab hover:border-[var(--amber-signal)] transition-colors active:cursor-grabbing"
            draggable
            onDragStart={(event) => onDragStart(event, comp.type, comp.label)}
          >
            <span className="text-xl">{comp.icon}</span>
            <span className="text-sm font-bold text-white font-heading">{comp.label}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}
