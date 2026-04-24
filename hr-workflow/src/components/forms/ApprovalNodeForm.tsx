import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useWorkflow } from '../../hooks/useWorkflow';
import type { ApprovalNodeData } from '../../types/workflow';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  approverRole: z.enum(['Manager', 'HRBP', 'Director'], { message: 'Role is required' }),
  autoApproveThreshold: z.number().min(0).max(100)
});

export const ApprovalNodeForm = ({ nodeId, data }: { nodeId: string, data: ApprovalNodeData }) => {
  const { updateNodeData } = useWorkflow();
  const { register, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: data.title || '',
      approverRole: data.approverRole || 'Manager',
      autoApproveThreshold: data.autoApproveThreshold || 0
    }
  });

  const autoApproveThreshold = watch('autoApproveThreshold');

  useEffect(() => {
    const subscription = watch((value) => {
      updateNodeData(nodeId, value as Partial<ApprovalNodeData>);
    });
    return () => subscription.unsubscribe();
  }, [watch, nodeId, updateNodeData]);

  return (
    <div className="flex flex-col gap-3">
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">Title</label>
        <input {...register('title')} className="w-full text-sm p-2 border rounded border-slate-300" />
        {errors.title && <span className="text-red-500 text-xs mt-1">{errors.title.message}</span>}
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">Approver Role</label>
        <select {...register('approverRole')} className="w-full text-sm p-2 border rounded border-slate-300 bg-white">
          <option value="Manager">Manager</option>
          <option value="HRBP">HRBP</option>
          <option value="Director">Director</option>
        </select>
        {errors.approverRole && <span className="text-red-500 text-xs mt-1">{errors.approverRole.message}</span>}
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">Auto Approve Threshold (Days)</label>
        <div className="flex items-center gap-2">
          <input type="range" min="0" max="100" {...register('autoApproveThreshold', { valueAsNumber: true })} className="w-full" />
          <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded">{autoApproveThreshold}</span>
        </div>
      </div>
    </div>
  );
};
