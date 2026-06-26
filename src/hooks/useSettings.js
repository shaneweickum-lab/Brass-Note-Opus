import { useCallback } from 'react';
import { useStorage } from './useStorage';
import { STORAGE_KEYS } from '../utils/constants';
import { hashPassword } from '../utils/dateUtils';

const DEFAULT_SETTINGS = {
  lastClientNumber: 0,
  lastGlobalSongNumber: 0,
  lastLabsGlobalNumber: 0,
  appPassword: null,
  ownerName: 'Shane',
  businessName: 'Brass Note Studios',
  currentUserRole: 'owner',
  activeView: 'dashboard',
  revisionWindowDays: 14,
  followUpDelayDays: 7,
};

export function useSettings() {
  const [settings, setSettings] = useStorage(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);

  const updateSettings = useCallback((updates) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  }, [setSettings]);

  const nextClientNumber = useCallback(() => {
    let next;
    setSettings((prev) => {
      next = (prev.lastClientNumber || 0) + 1;
      return { ...prev, lastClientNumber: next };
    });
    return (settings.lastClientNumber || 0) + 1;
  }, [settings, setSettings]);

  const nextGlobalSongNumber = useCallback(() => {
    let next;
    setSettings((prev) => {
      next = (prev.lastGlobalSongNumber || 0) + 1;
      return { ...prev, lastGlobalSongNumber: next };
    });
    return (settings.lastGlobalSongNumber || 0) + 1;
  }, [settings, setSettings]);

  const nextLabsGlobalNumber = useCallback(() => {
    let next;
    setSettings((prev) => {
      next = (prev.lastLabsGlobalNumber || 0) + 1;
      return { ...prev, lastLabsGlobalNumber: next };
    });
    return (settings.lastLabsGlobalNumber || 0) + 1;
  }, [settings, setSettings]);

  const setPassword = useCallback((password) => {
    const hashed = hashPassword(password);
    updateSettings({ appPassword: hashed });
    return hashed;
  }, [updateSettings]);

  const isPasswordSet = settings?.appPassword != null;

  return {
    settings: settings || DEFAULT_SETTINGS,
    updateSettings,
    nextClientNumber,
    nextGlobalSongNumber,
    nextLabsGlobalNumber,
    setPassword,
    isPasswordSet,
  };
}
