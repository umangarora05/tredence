import { Handle, Position } from '@xyflow/react';
import { GitBranch } from 'lucide-react';
import { BaseNode } from './BaseNode';
import type { ApprovalNodeData } from '../../types/workflow';

export const ApprovalNode = ({ id, data, selected }: { id: string, data: ApprovalNodeData, selected?: boolean }) => {
  return (
    <BaseNode
      id={id}
      selected={selected}
      icon={GitBranch}
      className="bg-amber-50 border-t-4 border-t-amber-400 text-amber-700"
      title={data.title || data.label}
      subtitle={`Approver: ${data.approverRole || 'Unassigned'}`}
    >
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-amber-500 border-none" />
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-amber-500 border-none" />
    </BaseNode>
  );
};
