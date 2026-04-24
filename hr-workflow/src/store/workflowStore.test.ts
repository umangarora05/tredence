import { describe, expect, test, beforeEach } from 'vitest';
import { useWorkflowStore } from './workflowStore';

describe('Workflow Zustand Store', () => {
  beforeEach(() => {
    useWorkflowStore.setState({
      panels: [{ id: 'main', name: 'Main Workflow', nodes: [], edges: [] }],
      activePanelId: 'main',
      selectedNodeId: null
    });
  });

  test('addNode creates node with correct defaults', () => {
    const store = useWorkflowStore.getState();
    store.addNode('start', { x: 100, y: 100 });
    
    const updatedStore = useWorkflowStore.getState();
    const nodes = updatedStore.panels[0].nodes;
    expect(nodes.length).toBe(1);
    expect(nodes[0].type).toBe('start');
    expect(nodes[0].data.nodeType).toBe('start');
  });

  test('deleteNode removes node and connected edges', () => {
    const store = useWorkflowStore.getState();
    store.addNode('start', { x: 0, y: 0 });
    store.addNode('end', { x: 100, y: 100 });
    
    let state = useWorkflowStore.getState();
    const startNode = state.panels[0].nodes[0];
    const endNode = state.panels[0].nodes[1];
    
    state.onConnect({ source: startNode.id, target: endNode.id, sourceHandle: null, targetHandle: null });
    
    state = useWorkflowStore.getState();
    expect(state.panels[0].edges.length).toBe(1);
    
    // delete node
    state.deleteNode(startNode.id);
    
    state = useWorkflowStore.getState();
    expect(state.panels[0].nodes.length).toBe(1);
    expect(state.panels[0].edges.length).toBe(0); // edge deleted
  });
});
