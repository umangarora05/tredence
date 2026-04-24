import { Handle, Position } from '@xyflow/react';
import { Zap } from 'lucide-react';
import { BaseNode } from './BaseNode';
import type { AutomatedStepNodeData } from '../../types/workflow';

export const AutomatedStepNode = ({ id, data, selected }: { id: string, data: AutomatedStepNodeData, selected?: boolean }) => {
  return (
    <BaseNode
      id={id}
      selected={selected}
      icon={Zap}
      className="bg-purple-50 border-t-4 border-t-purple-400 text-purple-700"
      title={data.title || data.label}
      subtitle={`Action: ${data.actionId || 'None'}`}
    >
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-purple-500 border-none" />
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-purple-500 border-none" />
    </BaseNode>
  );
};
