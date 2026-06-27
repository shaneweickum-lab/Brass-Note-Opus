import { useCallback } from 'react';
import { useStorage } from './useStorage';
import { STORAGE_KEYS, EXPERIMENT_CODES } from '../utils/constants';
import { generateLabsId, generateUUID } from '../utils/idGenerator';

export function useLabs() {
  const [labs, setLabs] = useStorage(STORAGE_KEYS.LABS, []);

  const createExperiment = useCallback((formData, labsGlobalNumber) => {
    const now = new Date().toISOString();
    const id = generateLabsId(formData.experimentCode, labsGlobalNumber);

    const experiment = {
      id,
      internalId: generateUUID(),
      labsGlobalNumber,
      labsGlobalDisplay: String(labsGlobalNumber).padStart(4, '0'),
      date: formData.date || now,
      experimentCode: formData.experimentCode,
      experimentName: EXPERIMENT_CODES[formData.experimentCode] || formData.experimentCode,
      sunoVersion: formData.sunoVersion || '',
      weirdness: Number(formData.weirdness) || 0,
      constraint: Number(formData.constraint) || 100,
      hypothesis: formData.hypothesis || '',
      expectedResult: formData.expectedResult || '',
      stylePrompt: formData.stylePrompt || '',
      lyricPrompt: formData.lyricPrompt || '',
      tier2Symbols: formData.tier2Symbols || '',
      tier3Applied: formData.tier3Applied || false,
      actualResult: '',
      resultCode: null,
      keyFinding: '',
      integrationStatus: null,
      generationNumber: Number(formData.generationNumber) || null,
      status: formData.status || 'scheduled',
      notes: formData.notes || '',
      createdAt: now,
    };

    setLabs((prev) => [experiment, ...(prev || [])]);
    return experiment;
  }, [setLabs]);

  const updateExperiment = useCallback((internalId, updates) => {
    setLabs((prev) =>
      (prev || []).map((e) => (e.internalId === internalId ? { ...e, ...updates } : e))
    );
  }, [setLabs]);

  const deleteExperiment = useCallback((internalId) => {
    setLabs((prev) => (prev || []).filter((e) => e.internalId !== internalId));
  }, [setLabs]);

  const replaceAllLabs = useCallback((data) => {
    setLabs(data);
  }, [setLabs]);

  const mergeLabs = useCallback((incoming) => {
    setLabs((prev) => {
      const existing = prev || [];
      const existingIds = new Set(existing.map((e) => e.id));
      const updates = new Map(incoming.map((e) => [e.id, e]));
      const merged = existing.map((e) => updates.has(e.id) ? { ...e, ...updates.get(e.id) } : e);
      incoming.forEach((e) => { if (!existingIds.has(e.id)) merged.push(e); });
      return merged;
    });
  }, [setLabs]);

  return {
    labs: labs || [],
    createExperiment,
    updateExperiment,
    deleteExperiment,
    replaceAllLabs,
    mergeLabs,
  };
}
