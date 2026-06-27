import { useCallback } from 'react';
import { useStorage } from './useStorage';
import { STORAGE_KEYS } from '../utils/constants';
import { generateCustomerId, generateSongId, generateUUID } from '../utils/idGenerator';
import { addDays } from '../utils/dateUtils';

export function useCommissions() {
  const [commissions, setCommissions] = useStorage(STORAGE_KEYS.COMMISSIONS, []);

  const createCommission = useCallback((formData, clientNumber, songGlobalStart, settings) => {
    const customerId = generateCustomerId(formData.commissionType, clientNumber);
    const now = new Date().toISOString();

    const songs = Array.from({ length: formData.songCount }, (_, i) => {
      const globalNum = songGlobalStart + i;
      return {
        songId: generateSongId(
          '01',
          formData.genreCode || '17',
          formData.lyricCode || 'L',
          formData.vocalCode || 'M',
          globalNum
        ),
        globalNumber: globalNum,
        globalDisplay: String(globalNum).padStart(4, '0'),
        styleCode: '01',
        genreCode: formData.genreCode || '17',
        lyricCode: formData.lyricCode || 'L',
        vocalCode: formData.vocalCode || 'M',
        songTitle: '',
        subGenre: '',
        vocalTypeDescription: '',
        bpm: null,
        timeSig: '4/4',
        mood: '',
        tensionArc: '',
        aboutSong: '',
        instrumentsVocalElements: '',
        sunoVersion: '',
        generationNumber: null,
        deliveryStatus: 'pending',
        productionNotes: '',
      };
    });

    const commission = {
      id: customerId,
      internalId: generateUUID(),
      createdAt: now,
      clientName: formData.clientName,
      clientEmail: formData.clientEmail,
      clientPhone: formData.clientPhone || '',
      commissionType: formData.commissionType,
      package: formData.package,
      songCount: Number(formData.songCount),
      totalPayment: Number(formData.totalPayment) || 0,
      songwriterBuyout: formData.songwriterBuyout || false,
      buyoutSongs: formData.buyoutSongs || 0,
      stage: 'brief',
      stageHistory: [{ stage: 'brief', timestamp: now, userId: 'owner' }],
      isRush: formData.isRush || false,
      deliveryDeadline: formData.deliveryDeadline,
      deliveredAt: null,
      revisionWindowEnd: null,
      revisionsIncluded: 3,
      revisionsUsed: 0,
      revisionPackPurchased: false,
      revisionPackSessions: 0,
      revisionLog: [],
      songs,
      deliveryLink: '',
      communicationLog: [],
      followUpDate: null,
      followUpDismissed: false,
      briefSummary: formData.briefSummary || '',
      genre: formData.genre || '',
      vocalType: formData.vocalType || '',
      notes: '',
    };

    setCommissions((prev) => [commission, ...(prev || [])]);
    return commission;
  }, [setCommissions]);

  const updateCommission = useCallback((internalId, updates) => {
    setCommissions((prev) =>
      (prev || []).map((c) => (c.internalId === internalId ? { ...c, ...updates } : c))
    );
  }, [setCommissions]);

  const moveStage = useCallback((internalId, newStage) => {
    const now = new Date().toISOString();
    setCommissions((prev) =>
      (prev || []).map((c) => {
        if (c.internalId !== internalId) return c;
        const updates = {
          stage: newStage,
          stageHistory: [...(c.stageHistory || []), { stage: newStage, timestamp: now, userId: 'owner' }],
        };
        if (newStage === 'delivery') {
          updates.deliveredAt = now;
          updates.revisionWindowEnd = addDays(now, 14);
          updates.followUpDate = addDays(now, 7);
        }
        return { ...c, ...updates };
      })
    );
  }, [setCommissions]);

  const addRevision = useCallback((internalId, sessionData) => {
    const now = new Date().toISOString();
    setCommissions((prev) =>
      (prev || []).map((c) => {
        if (c.internalId !== internalId) return c;
        return {
          ...c,
          revisionsUsed: c.revisionsUsed + 1,
          revisionLog: [...(c.revisionLog || []), { date: now, ...sessionData }],
        };
      })
    );
  }, [setCommissions]);

  const addCommLog = useCallback((internalId, entry) => {
    const now = new Date().toISOString();
    setCommissions((prev) =>
      (prev || []).map((c) => {
        if (c.internalId !== internalId) return c;
        return {
          ...c,
          communicationLog: [...(c.communicationLog || []), { date: now, ...entry }],
        };
      })
    );
  }, [setCommissions]);

  const dismissFollowUp = useCallback((internalId) => {
    setCommissions((prev) =>
      (prev || []).map((c) =>
        c.internalId === internalId ? { ...c, followUpDismissed: true } : c
      )
    );
  }, [setCommissions]);

  const deleteCommission = useCallback((internalId) => {
    setCommissions((prev) => (prev || []).filter((c) => c.internalId !== internalId));
  }, [setCommissions]);

  const replaceAllCommissions = useCallback((data) => {
    setCommissions(data);
  }, [setCommissions]);

  const mergeCommissions = useCallback((incoming) => {
    setCommissions((prev) => {
      const existing = prev || [];
      const existingIds = new Set(existing.map((c) => c.id));
      const updates = new Map(incoming.map((c) => [c.id, c]));
      const merged = existing.map((c) => updates.has(c.id) ? { ...c, ...updates.get(c.id) } : c);
      incoming.forEach((c) => { if (!existingIds.has(c.id)) merged.push(c); });
      return merged;
    });
  }, [setCommissions]);

  return {
    commissions: commissions || [],
    createCommission,
    updateCommission,
    moveStage,
    addRevision,
    addCommLog,
    dismissFollowUp,
    deleteCommission,
    replaceAllCommissions,
    mergeCommissions,
  };
}
