import type { Edge } from '@xyflow/react';
import type { WorkflowNode } from '../types/workflow';

export const validateWorkflow = (nodes: WorkflowNode[], edges: Edge[]): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  const startNodes = nodes.filter(n => n.type === 'start');
  const endNodes = nodes.filter(n => n.type === 'end');

  if (startNodes.length === 0) {
    errors.push('Exactly one Start node is required. (Found 0)');
  } else if (startNodes.length > 1) {
    errors.push(`Exactly one Start node is required. (Found ${startNodes.length})`);
  }

  if (endNodes.length === 0) {
    errors.push('At least one End node is required.');
  }

  // Incoming and outgoing checks
  nodes.forEach(node => {
    const isStart = node.type === 'start';
    const isEnd = node.type === 'end';
    
    const incomingEdges = edges.filter(e => e.target === node.id);
    const outgoingEdges = edges.filter(e => e.source === node.id);

    if (!isStart && incomingEdges.length === 0) {
      errors.push(`Node "${node.data.label}" lacks an incoming connection.`);
    }

    if (!isEnd && outgoingEdges.length === 0) {
      errors.push(`Node "${node.data.label}" lacks an outgoing connection.`);
    }
  });

  // Cycle Detection (DFS)
  const adjMap = new Map<string, string[]>();
  nodes.forEach(n => adjMap.set(n.id, []));
  edges.forEach(e => {
    if (adjMap.has(e.source)) {
      adjMap.get(e.source)!.push(e.target);
    }
  });

  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  const hasCycle = (nodeId: string): boolean => {
    if (recursionStack.has(nodeId)) return true;
    if (visited.has(nodeId)) return false;

    visited.add(nodeId);
    recursionStack.add(nodeId);

    const neighbors = adjMap.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (hasCycle(neighbor)) return true;
    }

    recursionStack.delete(nodeId);
    return false;
  };

  for (const node of nodes) {
    if (!visited.has(node.id)) {
      if (hasCycle(node.id)) {
        errors.push('Cycle detected in the workflow graph. Loops are not permitted.');
        break;
      }
    }
  }

  // Connectivity from Start
  if (startNodes.length === 1) {
    const reachable = new Set<string>();
    const stack = [startNodes[0].id];
    
    while(stack.length > 0) {
      const current = stack.pop()!;
      if (!reachable.has(current)) {
        reachable.add(current);
        const neighbors = adjMap.get(current) || [];
        stack.push(...neighbors);
      }
    }
    
    let pathToEnd = false;
    for (const endNode of endNodes) {
      if (reachable.has(endNode.id)) {
        pathToEnd = true;
        break;
      }
    }

    if (!pathToEnd) {
      errors.push('There is no complete path from Start to an End node.');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
};
