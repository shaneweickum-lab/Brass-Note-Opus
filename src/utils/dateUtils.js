export function isOverdue(deliveryDeadline, stage) {
  if (stage === 'delivery' || stage === 'archive') return false;
  if (!deliveryDeadline) return false;
  return new Date(deliveryDeadline) < new Date();
}

export function daysOverdue(deliveryDeadline) {
  const diff = new Date() - new Date(deliveryDeadline);
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function daysUntil(dateStr) {
  const diff = new Date(dateStr) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function isDueThisWeek(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const sevenDays = new Date();
  sevenDays.setDate(now.getDate() + 7);
  return d >= now && d <= sevenDays;
}

export function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatDateFull(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function isToday(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const now = new Date();
  return d.toDateString() === now.toDateString();
}

export function isTodayOrPast(dateStr) {
  if (!dateStr) return false;
  return new Date(dateStr) <= new Date();
}

export function isWithinDays(dateStr, days) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const future = new Date();
  future.setDate(future.getDate() + days);
  return d >= new Date() && d <= future;
}

export function isRevisionWindowOpen(revisionWindowEnd) {
  if (!revisionWindowEnd) return false;
  return new Date(revisionWindowEnd) > new Date();
}

export function getMonthDays(year, month) {
  const days = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Pad start
  for (let i = 0; i < firstDay.getDay(); i++) {
    days.push(null);
  }

  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d));
  }

  return days;
}

export function sameDay(a, b) {
  if (!a || !b) return false;
  return new Date(a).toDateString() === new Date(b).toDateString();
}

export function getDayOfMonth(dateStr) {
  return new Date(dateStr).getDate();
}

export function hashPassword(password) {
  // Simple deterministic hash for V1 single-user auth
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return btoa(`opus:${hash}:${password.length}`);
}

export function verifyPassword(password, hash) {
  return hashPassword(password) === hash;
}
