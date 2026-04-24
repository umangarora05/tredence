import { describe, expect, test } from 'vitest';
import { validateWorkflow } from './validation';
import type { WorkflowNode } from '../types/workflow';

describe('Validation Utility', () => {
  test('Valid graph passes execution', () => {
    const nodes: WorkflowNode[] = [
      { id: '1', type: 'start', data: { nodeType: 'start', label: 'S', title: 'S', metadata: [] }, position: { x: 0, y: 0 } },
      { id: '2', type: 'end', data: { nodeType: 'end', label: 'E', endMessage: 'E', showSummary: false }, position: { x: 0, y: 0 } }
    ];
    const edges = [{ id: 'e1-2', source: '1', target: '2' }];
    
    const result = validateWorkflow(nodes, edges);
    expect(result.valid).toBe(true);
    expect(result.errors.length).toBe(0);
  });

  test('Missing Start node fails validation', () => {
    const nodes: WorkflowNode[] = [
      { id: '2', type: 'end', data: { nodeType: 'end', label: 'E', endMessage: 'E', showSummary: false }, position: { x: 0, y: 0 } }
    ];
    const edges: any[] = [];
    
    const result = validateWorkflow(nodes, edges);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Exactly one Start node is required. (Found 0)');
  });

  test('Cycle detection fails validation', () => {
    const nodes: WorkflowNode[] = [
      { id: '1', type: 'start', data: { nodeType: 'start', label: 'S', title: 'S', metadata: [] }, position: { x: 0, y: 0 } },
      { id: '2', type: 'task', data: { nodeType: 'task', label: 'T', title: 'T', description: '', assignee: 'A', dueDate: '', customFields: [] }, position: { x: 0, y: 0 } },
      { id: '3', type: 'end', data: { nodeType: 'end', label: 'E', endMessage: 'E', showSummary: false }, position: { x: 0, y: 0 } }
    ];
    const edges = [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-2', source: '2', target: '2' }, // self cycle
      { id: 'e2-3', source: '2', target: '3' }
    ];
    
    const result = validateWorkflow(nodes, edges);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Cycle detected in the workflow graph. Loops are not permitted.');
  });
});
