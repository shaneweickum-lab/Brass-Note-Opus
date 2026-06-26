import { useCallback } from 'react';
import { useStorage } from './useStorage';
import { STORAGE_KEYS } from '../utils/constants';
import { generateUUID } from '../utils/idGenerator';

export function useReminders() {
  const [reminders, setReminders] = useStorage(STORAGE_KEYS.REMINDERS, []);

  const createReminder = useCallback((formData) => {
    const reminder = {
      id: generateUUID(),
      date: formData.date,
      type: formData.type || 'custom',
      label: formData.label || '',
      commissionId: formData.commissionId || null,
      dismissed: false,
      createdAt: new Date().toISOString(),
    };
    setReminders((prev) => [...(prev || []), reminder]);
    return reminder;
  }, [setReminders]);

  const dismissReminder = useCallback((id) => {
    setReminders((prev) =>
      (prev || []).map((r) => (r.id === id ? { ...r, dismissed: true } : r))
    );
  }, [setReminders]);

  const deleteReminder = useCallback((id) => {
    setReminders((prev) => (prev || []).filter((r) => r.id !== id));
  }, [setReminders]);

  return {
    reminders: reminders || [],
    createReminder,
    dismissReminder,
    deleteReminder,
  };
}
