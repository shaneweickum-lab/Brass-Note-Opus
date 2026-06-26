import { useState, useCallback } from 'react';

export function useStorage(key, defaultValue = null) {
  const read = useCallback(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : defaultValue;
    } catch {
      return defaultValue;
    }
  }, [key, defaultValue]);

  const [value, setValueState] = useState(read);

  const setValue = useCallback((updater) => {
    setValueState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch (e) {
        console.error('Storage write failed:', e);
      }
      return next;
    });
  }, [key]);

  return [value, setValue];
}
