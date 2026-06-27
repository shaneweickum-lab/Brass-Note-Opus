import { TYPE_CODES } from './constants';

export function generateCustomerId(commissionType, clientNumber) {
  const now = new Date();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const yy = String(now.getFullYear()).slice(-2);
  const typeDigit = TYPE_CODES[commissionType] || '1';
  const clientNum = String(clientNumber).padStart(2, '0');
  return `BNS${mm}${dd}${yy}${typeDigit}${clientNum}`;
}

export function formatGlobalSongNumber(num) {
  if (num <= 9999) {
    return String(num).padStart(4, '0');
  } else if (num <= 35999) {
    const base = num - 10000;
    const letter = String.fromCharCode(97 + Math.floor(base / 1000));
    const digits = String(base % 1000).padStart(3, '0');
    return `${letter}${digits}`;
  } else {
    const base = num - 36000;
    const letter = String.fromCharCode(65 + Math.floor(base / 1000));
    const digits = String(base % 1000).padStart(3, '0');
    return `${letter}${digits}`;
  }
}

export function formatLabsGlobalNumber(num) {
  if (num <= 9999) {
    return String(num).padStart(4, '0');
  } else {
    const base = num - 10000;
    const letter = String.fromCharCode(65 + Math.floor(base / 1000));
    const digits = String(base % 1000).padStart(3, '0');
    return `${letter}${digits}`;
  }
}

export function generateSongId(styleCode, genreCode, lyricCode, vocalCode, globalNumber) {
  const display = formatGlobalSongNumber(globalNumber);
  return `SNG-${styleCode}-${genreCode}-${lyricCode}-${vocalCode}-${display}`;
}

export function generateLabsId(experimentCode, labsGlobalNumber) {
  const now = new Date();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const yy = String(now.getFullYear()).slice(-2);
  const display = formatLabsGlobalNumber(labsGlobalNumber);
  return `BNL-${mm}${dd}${yy}-${experimentCode}-${display}`;
}

export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
