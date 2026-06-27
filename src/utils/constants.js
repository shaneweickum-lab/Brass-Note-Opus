export const STAGES = {
  BRIEF: 'brief',
  ARCHITECTURE: 'architecture',
  GENERATION: 'generation',
  QUALITY_REVIEW: 'quality_review',
  DELIVERY: 'delivery',
  ARCHIVE: 'archive',
};

export const STAGE_LABELS = {
  brief: 'Brief',
  architecture: 'Architecture',
  generation: 'Generation',
  quality_review: 'Quality Review',
  delivery: 'Delivery',
  archive: 'Archive',
};

export const STAGE_COLORS = {
  brief: '#8A9BB0',
  architecture: '#5EABA6',
  generation: '#0D9488',
  quality_review: '#D4A843',
  delivery: '#1A5C38',
  archive: '#333333',
};

export const COMMISSION_TYPES = {
  individual: 'Individual',
  organization: 'Organization',
  content_creator: 'Content Creator',
};

export const TYPE_CODES = {
  individual: '1',
  organization: '2',
  content_creator: '3',
};

export const GENRE_CODES = {
  '01': 'R&B / Soul',
  '02': 'Pop',
  '03': 'Hip-Hop / Cinematic',
  '04': 'Gospel / Worship',
  '05': 'Jazz',
  '06': 'Country',
  '07': 'Rock',
  '08': 'Classical / Orchestral',
  '09': 'A Cappella / Vocal',
  '10': 'Electronic',
  '11': 'Funk',
  '12': 'Blues',
  '13': 'Latin',
  '14': 'Reggae',
  '15': 'Folk',
  '16': 'Cinematic / Soundtrack',
  '17': 'Other',
};

export const STYLE_CODES = {
  '01': 'Commission (Custom for Client)',
  '02': 'Original Release',
  '03': 'Instrumental Only',
  '04': 'Sample / Demo',
};

export const LYRIC_CODES = {
  L: 'Custom Lyrics',
  I: 'Instrumental',
  C: 'Customer Brought',
};

export const VOCAL_CODES = {
  M: 'Male',
  F: 'Female',
  B: 'Both',
  N: 'None',
};

export const EXPERIMENT_CODES = {
  EXP001: 'Melody Variation',
  EXP002: 'Lyric Style',
  EXP003: 'Vocal Texture',
  EXP004: 'Production Style',
  EXP005: 'Genre Blend',
  EXP006: 'Tempo Study',
  EXP007: 'Harmony Structure',
  EXP008: 'Instrument Focus',
  EXP009: 'Energy Level',
  EXP010: 'Prompt Engineering',
  EXP011: 'Version Comparison',
  EXP012: 'Constraint Testing',
};

export const RESULT_CODES = ['PASS', 'FAIL', 'PARTIAL', 'ANOMALY'];

export const INTEGRATION_STATUSES = ['INTEGRATED', 'PENDING', 'REJECTED', 'NEEDS_TESTING'];

export const LAB_STAGES = {
  HYPOTHESIS: 'hypothesis',
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in_progress',
  ANALYSIS: 'analysis',
  INTEGRATED: 'integrated',
  ARCHIVED: 'archived',
};

export const SUBSCRIPTION_CATEGORIES = {
  subscription: 'Subscription',
  software: 'Software',
  marketing: 'Marketing',
  equipment: 'Equipment',
  legal: 'Legal',
  other: 'Other',
};

export const REMINDER_TYPES = {
  follow_up: 'Follow-Up',
  revision_due: 'Revision Due',
  renewal: 'Renewal',
  custom: 'Custom',
};

export const STORAGE_KEYS = {
  COMMISSIONS: 'opus:commissions',
  LABS: 'opus:labs',
  SUBSCRIPTIONS: 'opus:subscriptions',
  SETTINGS: 'opus:settings',
  REMINDERS: 'opus:reminders',
  ACCOUNTS: 'opus:accounts',
};

export const PACKAGES = ['First Song', 'EP', 'LP', 'Album', 'Singles Bundle', 'Custom'];

export const COLORS = {
  signalBlack: '#0A0E1A',
  midnightBlue: '#0F172A',
  cardHover: '#131D30',
  livingBrass: '#D4A843',
  electricTeal: '#0D9488',
  warmCream: '#FAF3E0',
  gray: '#8A9BB0',
  danger: '#C0392B',
  success: '#1A5C38',
  labsPurple: '#4A148C',
};
