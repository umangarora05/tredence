import { Handle, Position } from '@xyflow/react';
import { Play } from 'lucide-react';
import { BaseNode } from './BaseNode';
import type { StartNodeData } from '../../types/workflow';

export const StartNode = ({ id, data, selected }: { id: string, data: StartNodeData, selected?: boolean }) => {
  return (
    <BaseNode
      id={id}
      selected={selected}
      icon={Play}
      className="bg-green-50 border-t-4 border-t-green-400 text-green-700"
      title={data.title || data.label}
    >
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-green-500 border-none" />
    </BaseNode>
  );
};
