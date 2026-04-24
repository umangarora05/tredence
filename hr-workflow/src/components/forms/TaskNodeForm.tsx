import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useWorkflow } from '../../hooks/useWorkflow';
import type { TaskNodeData } from '../../types/workflow';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  assignee: z.string().min(1, 'Assignee is required'),
  dueDate: z.string().optional()
});

export const TaskNodeForm = ({ nodeId, data }: { nodeId: string, data: TaskNodeData }) => {
  const { updateNodeData } = useWorkflow();
  const { register, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    mode: 'all',
    defaultValues: {
      title: data.title || '',
      description: data.description || '',
      assignee: data.assignee || '',
      dueDate: data.dueDate || ''
    }
  });

  useEffect(() => {
    const subscription = watch((value) => {
      updateNodeData(nodeId, value as Partial<TaskNodeData>);
    });
    return () => subscription.unsubscribe();
  }, [watch, nodeId, updateNodeData]);

  return (
    <div className="flex flex-col gap-3">
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">Title</label>
        <input {...register('title')} className="w-full text-sm p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none border-slate-300" />
        {errors.title && <span className="text-red-500 text-xs mt-1">{errors.title.message}</span>}
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">Assignee</label>
        <input {...register('assignee')} className="w-full text-sm p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none border-slate-300" />
        {errors.assignee && <span className="text-red-500 text-xs mt-1">{errors.assignee.message}</span>}
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">Description (Optional)</label>
        <textarea {...register('description')} className="w-full text-sm p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none border-slate-300 min-h-[80px]" />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">Due Date</label>
        <input type="date" {...register('dueDate')} className="w-full text-sm p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none border-slate-300" />
      </div>
    </div>
  );
};
