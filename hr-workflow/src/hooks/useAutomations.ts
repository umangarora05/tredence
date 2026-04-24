import { useState, useEffect } from 'react';
import type { AutomationAction } from '../types/workflow';
import { automations as mockAutomations } from '../mocks/data/automations';

export const useAutomations = () => {
  const [automations, setAutomations] = useState<AutomationAction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchActions = async () => {
      setLoading(true);
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 200));
        setAutomations(mockAutomations as AutomationAction[]);
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
