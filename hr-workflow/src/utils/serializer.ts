import type { Edge } from '@xyflow/react';
import type { WorkflowNode, WorkflowJSON, NodeType } from '../types/workflow';

export const serializeWorkflow = (nodes: WorkflowNode[], edges: Edge[]): WorkflowJSON => {
  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    nodes: nodes.map(n => ({
      id: n.id,
      type: n.type as string,
      data: n.data,
      position: n.position
    })),
    edges: edges.map(e => ({
      id: e.id,
      source: e.source,
      target: e.target
    }))
  };
};

export const importWorkflow = (json: WorkflowJSON): { nodes: WorkflowNode[], edges: Edge[] } => {
  return {
    nodes: json.nodes.map(n => ({
      id: n.id,
      type: n.type as NodeType,
      data: n.data,
      position: n.position
    })),
    edges: json.edges.map(e => ({
      id: e.id,
      source: e.source,
      target: e.target
    }))
  };
};
