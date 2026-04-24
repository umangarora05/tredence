import { http, HttpResponse, delay } from 'msw';
import type { Edge } from '@xyflow/react';
import { automations } from './data/automations';
import { validateWorkflow } from '../utils/validation';
import type { WorkflowNode, SimulationResult, SimulationStep, ApprovalNodeData, AutomatedStepNodeData, NodeType } from '../types/workflow';

export const handlers = [
  http.get('/api/automations', async () => {
    await delay(200);
    return HttpResponse.json(automations);
  }),

  http.post('/api/simulate', async ({ request }) => {
    await delay(800);
    const body = await request.json() as { nodes: WorkflowNode[], edges: Edge[] };
    const { nodes, edges } = body;

    const validation = validateWorkflow(nodes, edges);
    if (!validation.valid) {
      return HttpResponse.json<SimulationResult>({
        success: false,
        steps: [],
        errors: validation.errors
      });
    }

    // Attempt topological sort to simulate step by step execution
    const steps: SimulationStep[] = [];
    const inDegree = new Map<string, number>();
    const adjList = new Map<string, string[]>();

    nodes.forEach(n => {
      inDegree.set(n.id, 0);
      adjList.set(n.id, []);
    });

    edges.forEach(e => {
      adjList.get(e.source)!.push(e.target);
      inDegree.set(e.target, inDegree.get(e.target)! + 1);
    });

    const queue: string[] = [];
    nodes.forEach(n => {
      if (inDegree.get(n.id) === 0) {
        queue.push(n.id);
      }
    });

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      const node = nodes.find(n => n.id === currentId)!;

      let msg = 'Executed successfully';
      if (node.type === 'approval') msg = `Pending approval from ${(node.data as ApprovalNodeData).approverRole}`;
      if (node.type === 'automated') msg = `Triggering internal action: ${(node.data as AutomatedStepNodeData).actionId}`;

      steps.push({
        nodeId: node.id,
        nodeType: node.type as NodeType,
        label: node.data.label || 'Untitled Node',
        status: 'success',
        message: msg,
        timestamp: new Date().toISOString()
      });

      const neighbors = adjList.get(currentId) || [];
      for (const neighbor of neighbors) {
        inDegree.set(neighbor, inDegree.get(neighbor)! - 1);
        if (inDegree.get(neighbor) === 0) {
          queue.push(neighbor);
        }
      }
    }

    return HttpResponse.json<SimulationResult>({
      success: true,
      steps,
      errors: []
    });
  })
];
