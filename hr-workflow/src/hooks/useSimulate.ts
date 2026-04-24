import { useState } from 'react';
import { useWorkflow } from './useWorkflow';
import { serializeWorkflow } from '../utils/serializer';
import type { SimulationResult } from '../types/workflow';

export const useSimulate = () => {
  const { nodes, edges } = useWorkflow();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const simulate = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const payload = serializeWorkflow(nodes, edges);
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json() as SimulationResult;
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error during simulation');
    } finally {
      setLoading(false);
    }
  };

  return { simulate, loading, result, error };
};
