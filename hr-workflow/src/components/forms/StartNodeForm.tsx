import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useWorkflow } from '../../hooks/useWorkflow';
import type { StartNodeData } from '../../types/workflow';
import { Plus, Trash2 } from 'lucide-react';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  metadata: z.array(z.object({
    key: z.string().min(1, 'Key required'),
    value: z.string().min(1, 'Value required')
  }))
});

export const StartNodeForm = ({ nodeId, data }: { nodeId: string, data: StartNodeData }) => {
  const { updateNodeData } = useWorkflow();
  const { register, control, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: data.title || '',
      metadata: data.metadata || []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'metadata'
  });

  useEffect(() => {
    const subscription = watch((value) => {
      updateNodeData(nodeId, value as Partial<StartNodeData>);
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
        <label className="block text-xs font-medium text-slate-700 mb-2">Metadata Props</label>
        <div className="flex flex-col gap-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <input {...register(`metadata.${index}.key`)} placeholder="Key" className="w-1/2 text-sm p-1 border rounded" />
              <input {...register(`metadata.${index}.value`)} placeholder="Value" className="w-1/2 text-sm p-1 border rounded" />
              <button type="button" onClick={() => remove(index)} className="text-red-500 p-1 hover:bg-red-50 rounded"><Trash2 size={14}/></button>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => append({ key: '', value: '' })} className="mt-2 text-xs text-blue-600 flex items-center gap-1 font-medium hover:underline">
          <Plus size={12} /> Add Key-Value
        </button>
      </div>
    </div>
  );
};
