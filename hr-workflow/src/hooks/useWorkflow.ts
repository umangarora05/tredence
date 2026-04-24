import { useWorkflowStore } from '../store/workflowStore';

export const useWorkflow = () => {
  const store = useWorkflowStore();
  
  const activePanel = store.panels.find(p => p.id === store.activePanelId) || store.panels[0];
  
  return {
    nodes: activePanel.nodes,
    edges: activePanel.edges,
    selectedNodeId: store.selectedNodeId,
    setNodes: store.setNodes,
    setEdges: store.setEdges,
    addNode: store.addNode,
    updateNodeData: store.updateNodeData,
    deleteNode: store.deleteNode,
    selectNode: store.selectNode,
    getSelectedNode: store.getSelectedNode,
    onNodesChange: store.onNodesChange,
    onEdgesChange: store.onEdgesChange,
    onConnect: store.onConnect,
    panels: store.panels,
    activePanelId: store.activePanelId,
    addPanel: store.addPanel,
    renamePanel: store.renamePanel,
    switchPanel: store.switchPanel,
    deletePanel: store.deletePanel
  };
};
