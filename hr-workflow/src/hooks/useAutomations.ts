import { useState, useEffect } from 'react';
import type { AutomationAction } from '../types/workflow';

export const useAutomations = () => {
  const [automations, setAutomations] = useState<AutomationAction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchActions = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/automations');
        const data = await res.json();
        setAutomations(data);
      } catch (err) {
        console.error('Failed to fetch automations', err);
      } finally {
        setLoading(false);
      }
    };
    fetchActions();
  }, []);

  return { automations, loading };
};
