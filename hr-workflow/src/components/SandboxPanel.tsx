import { Play, Activity, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { useSimulate } from '../hooks/useSimulate';

export const SandboxPanel = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { simulate, loading, result, error } = useSimulate();

  if (!isOpen) return null;

  return (
    <div className="absolute inset-x-8 bottom-8 rounded-xl shadow-2xl bg-white border border-slate-200 z-50 flex flex-col max-h-[50vh] overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-800 text-white flex justify-between items-center">
        <h3 className="font-semibold flex items-center gap-2 px-1"><Activity size={18}/> Workflow Simulation Sandbox</h3>
        <div className="flex gap-4">
          <button onClick={simulate} disabled={loading} className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 rounded text-sm font-medium flex items-center gap-2 disabled:opacity-50">
            <Play size={14} /> Run Test
          </button>
          <button onClick={onClose} className="text-slate-300 hover:text-white px-2 py-1 text-sm font-medium">Close</button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50 font-mono text-sm leading-relaxed">
        {!result && !loading && !error && (
          <div className="text-center text-slate-400 mt-10 italic">Click "Run Test" to validate and simulate this workflow.</div>
        )}
        
        {loading && (
          <div className="text-center text-blue-500 mt-10 animate-pulse font-medium">Executing Simulation via MSW API Layer...</div>
        )}

        {error && (
          <div className="text-red-600 bg-red-50 p-4 rounded-lg flex items-start gap-2 border border-red-200">
            <XCircle size={18} className="mt-0.5 shrink-0" />
            <div><strong>Critical Error:</strong> {error}</div>
          </div>
        )}

        {result && !result.success && (
          <div className="text-red-700">
            <h4 className="font-bold flex items-center gap-2 text-lg mb-4 text-red-600">
              <AlertCircle size={22} /> Validation Failed
            </h4>
            <ul className="list-disc pl-6 space-y-2">
              {result.errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {result && result.success && (
          <div className="timeline-container">
            <h4 className="font-bold text-green-700 flex items-center gap-2 mb-6 text-lg border-b pb-2">
              <CheckCircle2 size={22} /> Simulation Succeeded
            </h4>
            <div className="space-y-4">
              {result.steps.map((step, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="pt-1"><CheckCircle2 className="text-green-500" size={18} /></div>
                  <div className="bg-white p-3 rounded shadow-sm border border-slate-200 flex-1">
                    <div className="flex justify-between mb-1">
                       <strong className="text-slate-800 uppercase text-xs tracking-wider">{step.nodeType} node: {step.label}</strong>
                       <span className="text-[10px] text-slate-400">{new Date(step.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div className="text-slate-600 text-sm">{step.message}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
