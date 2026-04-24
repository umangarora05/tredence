import type { Node } from '@xyflow/react';

export type NodeType = 'start' | 'task' | 'approval' | 'automated' | 'end';

export interface BaseNodeData extends Record<string, unknown> {
  nodeType: NodeType;
  label: string;
}

export interface StartNodeData extends BaseNodeData {
  nodeType: 'start';
  title: string;
  metadata: { key: string; value: string }[];
}

export interface TaskNodeData extends BaseNodeData {
  nodeType: 'task';
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  customFields: { key: string; value: string }[];
}

export interface ApprovalNodeData extends BaseNodeData {
  nodeType: 'approval';
  title: string;
  approverRole: 'Manager' | 'HRBP' | 'Director';
  autoApproveThreshold: number;
}

export interface AutomatedStepNodeData extends BaseNodeData {
  nodeType: 'automated';
  title: string;
  actionId: string;
  actionParams: Record<string, string>;
}

export interface EndNodeData extends BaseNodeData {
  nodeType: 'end';
  endMessage: string;
  showSummary: boolean;
}

export type WorkflowNodeData = StartNodeData | TaskNodeData | ApprovalNodeData | AutomatedStepNodeData | EndNodeData;

export type WorkflowNode = Node<WorkflowNodeData, NodeType>;

export interface AutomationAction {
  id: string;
  label: string;
  params: string[];
}

export interface SimulationStep {
  nodeId: string;
  nodeType: NodeType;
  label: string;
  status: 'success' | 'pending' | 'skipped' | 'error';
  message: string;
  timestamp: string;
}

export interface SimulationResult {
  success: boolean;
  steps: SimulationStep[];
  errors: string[];
}

export interface WorkflowJSON {
  id: string;
  createdAt: string;
  nodes: { id: string; type: string; data: WorkflowNodeData; position: { x: number; y: number } }[];
  edges: { id: string; source: string; target: string }[];
}

export interface WorkflowPanel {
  id: string;
  name: string;
  nodes: WorkflowNode[];
  edges: import('@xyflow/react').Edge[];
}
