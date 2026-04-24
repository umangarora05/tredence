import { Handle, Position } from '@xyflow/react';
import { CheckSquare } from 'lucide-react';
import { BaseNode } from './BaseNode';
import type { TaskNodeData } from '../../types/workflow';

export const TaskNode = ({ id, data, selected }: { id: string, data: TaskNodeData, selected?: boolean }) => {
  return (
    <BaseNode
      id={id}
      selected={selected}
      icon={CheckSquare}
      className="bg-blue-50 border-t-4 border-t-blue-400 text-blue-700"
      title={data.title || data.label}
      subtitle={data.assignee}
    >
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-blue-500 border-none" />
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-blue-500 border-none" />
    </BaseNode>
  );
};
