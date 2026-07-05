import React, { useState } from 'react';
import { BaseEdge, EdgeLabelRenderer, EdgeProps, getSmoothStepPath, getBezierPath, getStraightPath, useReactFlow } from '@xyflow/react';
import { useDiagramStore } from '@/lib/store';

export default function PremiumEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  markerStart,
  data,
  selected,
}: EdgeProps) {
  const edgeType = data?.edgeType || 'smooth'; // smooth, bezier, straight, step
  const thickness = data?.thickness || 1.5;
  const color = data?.color || 'rgba(255, 255, 255, 0.4)';
  const dashed = data?.dashed;
  const dotted = data?.dotted;
  const animated = data?.animated;
  const label = data?.label || data?.protocol;
  
  const updateEdgeData = useDiagramStore(state => state.updateNode); // Note: store doesn't have updateEdge yet, we will add it to page or handle via store. 
  // Let's implement local editing for the label if needed, or rely on PropertiesPanel.

  let getPath = getSmoothStepPath;
  if (edgeType === 'bezier') getPath = getBezierPath;
  else if (edgeType === 'straight') getPath = getStraightPath;

  const [edgePath, labelX, labelY] = getPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: edgeType === 'step' ? 0 : 24,
  });

  const strokeDasharray = dotted ? '2 6' : dashed ? '8 8' : 'none';

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        markerStart={markerStart}
        style={{
          ...style,
          stroke: selected ? 'var(--accent-purple)' : color,
          strokeWidth: selected ? thickness + 1 : thickness,
          strokeDasharray,
        }}
        id={id}
      />

      {/* Animated packet */}
      {animated && (
        <circle r={thickness * 1.5} fill={selected ? 'var(--accent-purple)' : color} opacity="0.6">
          <animateMotion dur="3s" repeatCount="indefinite" path={edgePath} />
        </circle>
      )}

      {label && (
        <EdgeLabelRenderer>
          <div
            className="nodrag nopan px-2.5 py-1 rounded-md text-[10px] font-medium shadow-lg backdrop-blur-md"
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
              background: 'rgba(19, 10, 31, 0.85)',
              border: `1px solid ${selected ? 'var(--accent-purple)' : 'rgba(255, 255, 255, 0.1)'}`,
              color: 'white',
            }}
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
