import { useState } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { Sidebar } from './components/Sidebar';
import { WorkflowCanvas } from './components/WorkflowCanvas';
import { NodeConfigPanel } from './components/NodeConfigPanel';
import { SandboxPanel } from './components/SandboxPanel';
import { HeaderTabs } from './components/HeaderTabs';
import { Play } from 'lucide-react';
import '@xyflow/react/dist/style.css';

function AppLayout() {
  const [sandboxOpen, setSandboxOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 font-sans text-slate-800 overflow-hidden">
      <header className="h-14 bg-white border-b border-slate-200 flex items-center px-6 shrink-0 z-20">
        <h1 className="font-bold text-slate-800 whitespace-nowrap">HR Workflow Designer</h1>
        <HeaderTabs />
        <div className="flex items-center gap-3 ml-auto">
          <button 
            onClick={() => setSandboxOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors"
          >
            <Play size={16} /> Test Workflow
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar />
        <WorkflowCanvas />
        <NodeConfigPanel />
        <SandboxPanel isOpen={sandboxOpen} onClose={() => setSandboxOpen(false)} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <AppLayout />
    </ReactFlowProvider>
  );
}
