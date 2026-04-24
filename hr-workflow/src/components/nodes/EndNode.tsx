import { Handle, Position } from '@xyflow/react';
import { Flag } from 'lucide-react';
import { BaseNode } from './BaseNode';
import type { EndNodeData } from '../../types/workflow';

export const EndNode = ({ id, data, selected }: { id: string, data: EndNodeData, selected?: boolean }) => {
  return (
    <BaseNode
      id={id}
      selected={selected}
      icon={Flag}
      className="bg-red-50 border-t-4 border-t-red-400 text-red-700"
      title={data.endMessage || data.label}
    >
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-red-500 border-none" />
    </BaseNode>
  );
};
