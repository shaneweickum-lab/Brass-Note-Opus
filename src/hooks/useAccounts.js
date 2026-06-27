import { useCallback } from 'react';
import { useStorage } from './useStorage';
import { STORAGE_KEYS } from '../utils/constants';
import { hashPassword, verifyPassword } from '../utils/dateUtils';

export function useAccounts() {
  const [accounts, setAccounts] = useStorage(STORAGE_KEYS.ACCOUNTS, []);

  const list = accounts || [];

  const createAccount = useCallback((username, password, role) => {
    const trimmed = String(username || '').trim();
    if (!trimmed) throw new Error('Username is required.');
    const dupe = (accounts || []).some(
      (a) => a.username.toLowerCase() === trimmed.toLowerCase()
    );
    if (dupe) throw new Error('Username already taken.');
    const account = {
      username: trimmed,
      passwordHash: hashPassword(password),
      role,
      createdAt: new Date().toISOString(),
    };
    setAccounts((prev) => [...(prev || []), account]);
    return account;
  }, [accounts, setAccounts]);

  const deleteAccount = useCallback((username) => {
    setAccounts((prev) => (prev || []).filter((a) => a.username !== username));
  }, [setAccounts]);

  const updatePassword = useCallback((username, newPassword) => {
    setAccounts((prev) =>
      (prev || []).map((a) =>
        a.username === username ? { ...a, passwordHash: hashPassword(newPassword) } : a
      )
    );
  }, [setAccounts]);

  // Returns { username, role } on success, null on failure
  const login = useCallback((username, role, password) => {
    const account = (accounts || []).find(
      (a) =>
        a.username.toLowerCase() === String(username || '').trim().toLowerCase() &&
        a.role === role
    );
    if (!account) return null;
    if (!verifyPassword(password, account.passwordHash)) return null;
    return { username: account.username, role: account.role };
  }, [accounts]);

  const hasAccounts = list.length > 0;
  const adminCount = list.filter((a) => a.role === 'admin').length;

  return {
    accounts: list,
    hasAccounts,
    adminCount,
    createAccount,
    deleteAccount,
    updatePassword,
    login,
  };
}
