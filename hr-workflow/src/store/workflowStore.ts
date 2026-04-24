import { create } from 'zustand';
import type {
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
} from '@xyflow/react';
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from '@xyflow/react';
import type { NodeType, WorkflowNode, WorkflowNodeData, WorkflowPanel } from '../types/workflow';

interface WorkflowState {
  panels: WorkflowPanel[];
  activePanelId: string;
  selectedNodeId: string | null;
  
  // Panel management
  addPanel: (name: string) => void;
  renamePanel: (id: string, name: string) => void;
  switchPanel: (id: string) => void;
  deletePanel: (id: string) => void;

  setNodes: (nodes: WorkflowNode[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (nodeType: NodeType, position: { x: number; y: number }) => void;
  updateNodeData: (nodeId: string, data: Partial<WorkflowNodeData>) => void;
  deleteNode: (nodeId: string) => void;
  selectNode: (nodeId: string | null) => void;
  getSelectedNode: () => WorkflowNode | null;
  onNodesChange: OnNodesChange<WorkflowNode>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
}

const getDefaultData = (type: NodeType): WorkflowNodeData => {
  const base = { nodeType: type, label: `${type.charAt(0).toUpperCase() + type.slice(1)} Node` };
  switch (type) {
    case 'start': return { ...base, nodeType: 'start', title: 'Start', metadata: [] };
    case 'task': return { ...base, nodeType: 'task', title: 'New Task', description: '', assignee: '', dueDate: '', customFields: [] };
    case 'approval': return { ...base, nodeType: 'approval', title: 'Approval Step', approverRole: 'Manager', autoApproveThreshold: 0 };
    case 'automated': return { ...base, nodeType: 'automated', title: 'Automated Step', actionId: '', actionParams: {} };
    case 'end': return { ...base, nodeType: 'end', endMessage: 'Done', showSummary: false };
    default: return base as WorkflowNodeData;
  }
};

const updateActivePanel = (state: WorkflowState, updater: (panel: WorkflowPanel) => Partial<WorkflowPanel>) => {
  return {
    panels: state.panels.map(p => {
      if (p.id === state.activePanelId) {
        return { ...p, ...updater(p) };
      }
      return p;
    })
  };
};

const getActivePanel = (state: WorkflowState) => state.panels.find(p => p.id === state.activePanelId) || state.panels[0];

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  panels: [
    { id: 'main', name: 'Main Workflow', nodes: [], edges: [] }
  ],
  activePanelId: 'main',
  selectedNodeId: null,

  addPanel: (name) => {
    const newPanelId = crypto.randomUUID();
    set(state => ({
      panels: [...state.panels, { id: newPanelId, name, nodes: [], edges: [] }],
      activePanelId: newPanelId,
      selectedNodeId: null
    }));
  },
  
  renamePanel: (id, name) => {
    set(state => ({
      panels: state.panels.map(p => p.id === id ? { ...p, name } : p)
    }));
  },
  
  switchPanel: (id) => {
    set({ activePanelId: id, selectedNodeId: null });
  },

  deletePanel: (id) => {
    set(state => {
      if (state.panels.length <= 1) return state; // Don't delete the last panel
      const newPanels = state.panels.filter(p => p.id !== id);
      const newActive = state.activePanelId === id ? newPanels[0].id : state.activePanelId;
      return { panels: newPanels, activePanelId: newActive, selectedNodeId: null };
    });
  },

  setNodes: (nodes) => set(state => updateActivePanel(state, () => ({ nodes }))),
  setEdges: (edges) => set(state => updateActivePanel(state, () => ({ edges }))),
  
  addNode: (nodeType, position) => {
    const newNode: WorkflowNode = {
      id: crypto.randomUUID(),
      type: nodeType,
      position,
      data: getDefaultData(nodeType)
    };
    set(state => updateActivePanel(state, (panel) => ({ nodes: [...panel.nodes, newNode] })));
  },

  updateNodeData: (nodeId, data) => {
    set(state => updateActivePanel(state, (panel) => ({
      nodes: panel.nodes.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, ...data } as WorkflowNodeData };
        }
        return node;
      })
    })));
  },

  deleteNode: (nodeId) => {
    set(state => {
      const isSelected = state.selectedNodeId === nodeId;
      const updates = updateActivePanel(state, (panel) => ({
        nodes: panel.nodes.filter((node) => node.id !== nodeId),
        edges: panel.edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
      }));
      return { ...updates, selectedNodeId: isSelected ? null : state.selectedNodeId };
    });
  },

  selectNode: (nodeId) => set({ selectedNodeId: nodeId }),
  
  getSelectedNode: () => {
    const state = get();
    const active = getActivePanel(state);
    return active.nodes.find(n => n.id === state.selectedNodeId) || null;
  },

  onNodesChange: (changes) => {
    set(state => updateActivePanel(state, (panel) => ({
      nodes: applyNodeChanges(changes, panel.nodes) as WorkflowNode[]
    })));
  },

  onEdgesChange: (changes) => {
    set(state => updateActivePanel(state, (panel) => ({
      edges: applyEdgeChanges(changes, panel.edges)
    })));
  },

  onConnect: (connection) => {
    set(state => updateActivePanel(state, (panel) => ({
      edges: addEdge(connection, panel.edges)
    })));
  },
}));
