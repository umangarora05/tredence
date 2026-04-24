import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useWorkflow } from '../../hooks/useWorkflow';
import type { EndNodeData } from '../../types/workflow';

const schema = z.object({
  endMessage: z.string().min(1, 'End message is required'),
  showSummary: z.boolean()
});

export const EndNodeForm = ({ nodeId, data }: { nodeId: string, data: EndNodeData }) => {
  const { updateNodeData } = useWorkflow();
  const { register, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      endMessage: data.endMessage || '',
      showSummary: data.showSummary || false
    }
  });

  useEffect(() => {
    const subscription = watch((value) => {
      updateNodeData(nodeId, value as Partial<EndNodeData>);
    });
    return () => subscription.unsubscribe();
  }, [watch, nodeId, updateNodeData]);

  return (
    <div className="flex flex-col gap-3">
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">End Message</label>
        <textarea {...register('endMessage')} className="w-full text-sm p-2 border rounded border-slate-300 min-h-[80px]" />
        {errors.endMessage && <span className="text-red-500 text-xs mt-1">{errors.endMessage.message}</span>}
      </div>
      
      <div className="flex items-center gap-2">
        <input type="checkbox" id="showSummary" {...register('showSummary')} className="w-4 h-4 text-blue-600 rounded border-slate-300" />
        <label htmlFor="showSummary" className="text-sm text-slate-700 font-medium">Show Summary to User</label>
      </div>
    </div>
  );
};
