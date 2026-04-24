import { useState, useRef, useEffect } from 'react';
import { useWorkflow } from '../hooks/useWorkflow';
import { Plus, X, Pencil, Check } from 'lucide-react';

export const HeaderTabs = () => {
  const { panels, activePanelId, switchPanel, addPanel, renamePanel, deletePanel } = useWorkflow();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingId]);

  const handleRename = () => {
    if (editingId && editName.trim()) {
      renamePanel(editingId, editName.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="flex items-center gap-1 ml-6 h-full flex-1 overflow-x-auto relative top-[1px]">
      {panels.map((panel) => (
        <div
          key={panel.id}
          className={`group flex items-center gap-1 px-3 h-full border-b-2 cursor-pointer
            ${activePanelId === panel.id ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700' : 'border-transparent text-slate-600 hover:bg-slate-50'}`}
          onClick={() => switchPanel(panel.id)}
          onDoubleClick={() => {
            setEditingId(panel.id);
            setEditName(panel.name);
          }}
        >
          {editingId === panel.id ? (
            <div className="flex items-center gap-1">
              <input
                ref={inputRef}
                className="text-sm font-medium bg-transparent border-none focus:outline-none focus:ring-0 w-28 px-1"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={handleRename}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRename();
                  if (e.key === 'Escape') setEditingId(null);
                }}
              />
              <button 
                onMouseDown={(e) => { e.preventDefault(); handleRename(); }}
                className="p-1 text-green-600 hover:bg-green-100 rounded"
              >
                <Check size={14} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium select-none whitespace-nowrap pl-1">{panel.name}</span>
              <button
                className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-100 rounded transition-all ml-1"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingId(panel.id);
                  setEditName(panel.name);
                }}
              >
                <Pencil size={12} />
              </button>
            </div>
          )}
          {panels.length > 1 && (
            <button
              className="opacity-0 group-hover:opacity-100 p-1 ml-1 hover:bg-slate-200 rounded text-slate-400 hover:text-red-500 transition-all"
              onClick={(e) => {
                e.stopPropagation();
                deletePanel(panel.id);
              }}
            >
              <X size={12} />
            </button>
          )}
        </div>
      ))}
      <button
        onClick={() => addPanel(`Workflow ${panels.length + 1}`)}
        className="ml-2 p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
      >
        <Plus size={16} />
      </button>
    </div>
  );
};
