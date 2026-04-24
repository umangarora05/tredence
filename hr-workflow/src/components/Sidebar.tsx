import type { DragEvent } from 'react';
import { Bot, CheckSquare, GitBranch, Flag, Play } from 'lucide-react';
import type { NodeType } from '../types/workflow';

export const Sidebar = () => {
  const onDragStart = (event: DragEvent<HTMLDivElement>, nodeType: NodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const templates = [
    { type: 'start' as NodeType, label: 'Start Node', desc: 'Entry point', icon: Play, colors: 'text-green-600 bg-green-50 border-green-200' },
    { type: 'task' as NodeType, label: 'Task Node', desc: 'Human action required', icon: CheckSquare, colors: 'text-blue-600 bg-blue-50 border-blue-200' },
    { type: 'approval' as NodeType, label: 'Approval Node', desc: 'Manager/HR sign-off', icon: GitBranch, colors: 'text-amber-600 bg-amber-50 border-amber-200' },
    { type: 'automated' as NodeType, label: 'Automated Step', desc: 'System actions', icon: Bot, colors: 'text-purple-600 bg-purple-50 border-purple-200' },
    { type: 'end' as NodeType, label: 'End Node', desc: 'Completion logic', icon: Flag, colors: 'text-red-600 bg-red-50 border-red-200' },
  ];

  return (
    <aside className="w-[200px] bg-white border-r border-slate-200 flex flex-col p-4 shadow-sm z-10 sticky top-0 h-full">
      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Node Palette</h2>
      <div className="flex flex-col gap-3">
        {templates.map((item) => (
          <div
            key={item.type}
            className={`flex flex-col p-3 border rounded-lg cursor-grab hover:shadow-md transition-all active:cursor-grabbing ${item.colors}`}
            onDragStart={(event) => onDragStart(event, item.type)}
            draggable
          >
            <div className="flex items-center gap-2 mb-1">
              <item.icon size={16} />
              <span className="text-sm font-semibold">{item.label}</span>
            </div>
            <span className="text-[10px] sm:text-xs opacity-75">{item.desc}</span>
          </div>
        ))}
      </div>
      <div className="mt-auto text-xs text-slate-400 text-center leading-relaxed">
        Drag nodes to the canvas to build your workflow.
      </div>
    </aside>
  );
};
