import { useWorkflow } from '../hooks/useWorkflow';
import { X } from 'lucide-react';
import { StartNodeForm } from './forms/StartNodeForm';
import { TaskNodeForm } from './forms/TaskNodeForm';
import { ApprovalNodeForm } from './forms/ApprovalNodeForm';
import { AutomatedStepNodeForm } from './forms/AutomatedStepNodeForm';
import { EndNodeForm } from './forms/EndNodeForm';

export const NodeConfigPanel = () => {
  const { selectedNodeId, getSelectedNode, selectNode } = useWorkflow();
  
  if (!selectedNodeId) return null;

  const node = getSelectedNode();
  if (!node) return null;

  const renderForm = () => {
    switch (node.type) {
      case 'start':     return <StartNodeForm nodeId={node.id} data={node.data as never} />;
      case 'task':      return <TaskNodeForm nodeId={node.id} data={node.data as never} />;
      case 'approval':  return <ApprovalNodeForm nodeId={node.id} data={node.data as never} />;
      case 'automated': return <AutomatedStepNodeForm nodeId={node.id} data={node.data as never} />;
      case 'end':       return <EndNodeForm nodeId={node.id} data={node.data as never} />;
      default:          return <div className="text-sm text-slate-500">No configuration panel available.</div>;
    }
  };

  return (
    <aside className="w-80 bg-white border-l border-slate-200 flex flex-col shadow-xl absolute right-0 top-0 bottom-0 z-10">
      <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
        <h2 className="font-semibold text-slate-800">Configure Node</h2>
        <button onClick={() => selectNode(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
          <X size={18} />
        </button>
      </div>
      <div className="p-6 overflow-y-auto flex-1 bg-white">
        {renderForm()}
      </div>
    </aside>
  );
};
