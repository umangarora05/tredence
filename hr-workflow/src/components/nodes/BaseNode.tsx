import type { ReactNode } from 'react';
import { useWorkflow } from '../../hooks/useWorkflow';
import { X } from 'lucide-react';

interface BaseNodeProps {
  id: string;
  selected?: boolean;
  className?: string;
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export const BaseNode = ({ id, selected, className, icon: Icon, title, subtitle, children }: BaseNodeProps) => {
  const { deleteNode } = useWorkflow();

  return (
    <div className={`relative w-[200px] bg-white rounded-lg shadow-sm border-2 transition-all ${selected ? 'ring-2 ring-blue-500 border-blue-500' : 'border-slate-200 hover:shadow-md'} ${className || ''}`}>
      <button 
        type="button"
        onClick={(e) => { e.stopPropagation(); deleteNode(id); }}
        className="absolute top-1 right-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ opacity: selected ? 1 : undefined }}
      >
        <X size={14} />
      </button>
      <div className="p-3">
        <div className="flex items-center gap-2 mb-1">
          <Icon size={16} />
          <div className="font-semibold text-sm truncate flex-1">{title}</div>
        </div>
        {subtitle && <div className="text-[12px] opacity-80 truncate">{subtitle}</div>}
      </div>
      {children}
    </div>
  );
};
