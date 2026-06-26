import { useCallback } from 'react';
import { useStorage } from './useStorage';
import { STORAGE_KEYS } from '../utils/constants';
import { generateUUID } from '../utils/idGenerator';

export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useStorage(STORAGE_KEYS.SUBSCRIPTIONS, []);

  const createSubscription = useCallback((formData) => {
    const sub = {
      id: generateUUID(),
      name: formData.name,
      monthlyCost: Number(formData.monthlyCost) || 0,
      annualCost: (Number(formData.monthlyCost) || 0) * 12,
      dueDate: Number(formData.dueDate) || 1,
      category: formData.category || 'subscription',
      autoRenew: formData.autoRenew !== false,
      status: 'active',
      notes: formData.notes || '',
      createdAt: new Date().toISOString(),
    };
    setSubscriptions((prev) => [...(prev || []), sub]);
    return sub;
  }, [setSubscriptions]);

  const updateSubscription = useCallback((id, updates) => {
    setSubscriptions((prev) =>
      (prev || []).map((s) => {
        if (s.id !== id) return s;
        const updated = { ...s, ...updates };
        if (updates.monthlyCost !== undefined) {
          updated.annualCost = Number(updates.monthlyCost) * 12;
        }
        return updated;
      })
    );
  }, [setSubscriptions]);

  const deleteSubscription = useCallback((id) => {
    setSubscriptions((prev) => (prev || []).filter((s) => s.id !== id));
  }, [setSubscriptions]);

  const monthlyTotal = (subscriptions || [])
    .filter((s) => s.status === 'active')
    .reduce((sum, s) => sum + (s.monthlyCost || 0), 0);

  return {
    subscriptions: subscriptions || [],
    createSubscription,
    updateSubscription,
    deleteSubscription,
    monthlyTotal,
  };
}
