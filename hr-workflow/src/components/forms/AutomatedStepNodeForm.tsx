import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useWorkflow } from '../../hooks/useWorkflow';
import { useAutomations } from '../../hooks/useAutomations';
import type { AutomatedStepNodeData } from '../../types/workflow';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  actionId: z.string().min(1, 'Action is required'),
  actionParams: z.record(z.string(), z.string()).optional()
});

export const AutomatedStepNodeForm = ({ nodeId, data }: { nodeId: string, data: AutomatedStepNodeData }) => {
  const { updateNodeData } = useWorkflow();
  const { automations } = useAutomations();
  
  const { register, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: data.title || '',
      actionId: data.actionId || '',
      actionParams: data.actionParams || {}
    }
  });

  const selectedActionId = watch('actionId');
  const activeAction = automations.find(a => a.id === selectedActionId);

  // Clear params if action changes
  useEffect(() => {
    if (data.actionId !== selectedActionId && selectedActionId) {
      setValue('actionParams', {});
    }
  }, [selectedActionId, data.actionId, setValue]);

  useEffect(() => {
    const subscription = watch((value) => {
      updateNodeData(nodeId, value as Partial<AutomatedStepNodeData>);
    });
    return () => subscription.unsubscribe();
  }, [watch, nodeId, updateNodeData]);

  return (
    <div className="flex flex-col gap-3">
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">Title</label>
        <input {...register('title')} className="w-full text-sm p-2 border rounded border-slate-300" />
        {errors.title && <span className="text-red-500 text-xs mt-1">{errors.title?.message as string}</span>}
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">Automated Action</label>
        <select {...register('actionId')} className="w-full text-sm p-2 border rounded border-slate-300 bg-white">
          <option value="">Select an action...</option>
          {automations.map(act => (
            <option key={act.id} value={act.id}>{act.label}</option>
          ))}
        </select>
        {errors.actionId && <span className="text-red-500 text-xs mt-1">{errors.actionId?.message as string}</span>}
      </div>

      {activeAction && activeAction.params.length > 0 && (
        <div className="bg-slate-50 p-3 rounded border border-slate-200">
          <label className="block text-xs font-medium text-slate-700 mb-2">Action Parameters</label>
          <div className="flex flex-col gap-2">
            {activeAction.params.map(param => (
               <div key={param}>
                 <input 
                   {...register(`actionParams.${param}`)} 
                   placeholder={param}
                   className="w-full text-sm p-2 border rounded border-slate-300" 
                 />
               </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
